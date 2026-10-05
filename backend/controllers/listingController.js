import { v2 as cloudinary } from "cloudinary";
import Listing from "../models/listingModel.js";
import { LISTING_STATUS } from "../constants/index.js";
import { logModerationAction } from "../services/moderationService.js";
import { notifyByEmail } from "../services/notificationService.js";
import { getEmailHtml } from "../services/emailService.js";

// ── Browse Listings ───────────────────────────────────────────────────
export const listListings = async (req, res, next) => {
  try {
    const {
      q,
      category,
      campus,
      minPrice,
      maxPrice,
      condition,
      sellerId,
      sort = "newest",
      page = 1,
    } = req.query;

    const filter = { status: LISTING_STATUS.PUBLISHED };
    if (category) filter.categoryName = category;
    if (campus) filter.campus = campus;
    if (condition) filter.condition = condition;
    if (sellerId) filter.sellerId = sellerId;
    if (minPrice || maxPrice) {
      filter.price = {
        ...(minPrice ? { $gte: Number(minPrice) } : {}),
        ...(maxPrice ? { $lte: Number(maxPrice) } : {}),
      };
    }
    if (q?.trim()) {
      filter.$text = { $search: q.trim() };
    }

    const sortBy =
      sort === "price-low" ? { price: 1 } :
      sort === "price-high" ? { price: -1 } :
      { createdAt: -1 };

    const limit = 24;
    const skip = (Math.max(1, Number(page)) - 1) * limit;

    const [listings, total] = await Promise.all([
      Listing.find(filter)
        .populate("sellerId", "name username campus avatar verificationStatus")
        .sort(sortBy)
        .skip(skip)
        .limit(limit)
        .lean(),
      Listing.countDocuments(filter),
    ]);

    res.json({
      success: true,
      listings,
      page: Math.max(1, Number(page)),
      pages: Math.ceil(total / limit),
      total,
    });
  } catch (error) {
    next(error);
  }
};

// ── Get Single Listing ────────────────────────────────────────────────
export const getListing = async (req, res, next) => {
  try {
    const listing = await Listing.findOne({
      _id: req.params.id,
      status: { $in: [LISTING_STATUS.PUBLISHED, LISTING_STATUS.RESERVED, LISTING_STATUS.SOLD] },
    }).populate("sellerId", "name username avatar campus college course verificationStatus createdAt responseRate");

    if (!listing) {
      return res.status(404).json({ success: false, message: "This listing is unavailable." });
    }

    // Increment views safely (using $inc prevents race conditions vs standard save)
    await Listing.updateOne({ _id: listing._id }, { $inc: { views: 1 } });

    res.json({ success: true, listing });
  } catch (error) {
    next(error);
  }
};

// ── Create Listing ────────────────────────────────────────────────────
export const createListing = async (req, res, next) => {
  try {
    const {
      title,
      description,
      categoryName,
      condition,
      price,
      originalPrice,
      negotiable,
      campus,
      locationArea,
      pickupPreference,
      draft,
      brand,
      model,
    } = req.body;

    if (!title?.trim() || !description?.trim() || !categoryName || !campus || !price) {
      return res.status(400).json({ success: false, message: "Please fill all required details." });
    }

    const files = Object.values(req.files || {}).flat();
    if (!files.length && draft !== "true") {
      return res.status(400).json({ success: false, message: "Add at least one photo before submitting." });
    }

    let images = [];
    if (files.length > 0) {
      images = await Promise.all(
        files.map(async (file) => {
          const uploaded = await cloudinary.uploader.upload(file.path, {
            resource_type: "image",
            folder: "scholarnest/listings",
          });
          return uploaded.secure_url;
        })
      );
    }

    const listingStatus = draft === "true" ? LISTING_STATUS.DRAFT : LISTING_STATUS.PENDING_REVIEW;

    const listing = await Listing.create({
      sellerId: req.userId,
      title: title.trim(),
      description: description.trim(),
      categoryName,
      condition,
      price: Number(price),
      originalPrice: originalPrice ? Number(originalPrice) : undefined,
      negotiable: negotiable === "true",
      images,
      campus: campus.trim(),
      locationArea: locationArea?.trim(),
      pickupPreference,
      brand,
      model,
      status: listingStatus,
    });

    res.status(201).json({
      success: true,
      listing,
      message: draft === "true" ? "Draft saved." : "Listing submitted for review.",
    });
  } catch (error) {
    next(error);
  }
};

// ── My Listings ───────────────────────────────────────────────────────
export const myListings = async (req, res, next) => {
  try {
    const listings = await Listing.find({ sellerId: req.userId }).sort({ updatedAt: -1 });
    res.json({ success: true, listings });
  } catch (error) {
    next(error);
  }
};

// ── Moderate Listing (Admin) ──────────────────────────────────────────
export const moderateListing = async (req, res, next) => {
  try {
    const { id, status, rejectionReason } = req.body;

    if (![LISTING_STATUS.PUBLISHED, LISTING_STATUS.REJECTED, LISTING_STATUS.SUSPENDED].includes(status)) {
      return res.status(400).json({ success: false, message: "Invalid moderation status." });
    }

    const listing = await Listing.findById(id).populate("sellerId");
    if (!listing) return res.status(404).json({ success: false, message: "Listing not found." });

    const previousState = listing.status;
    listing.status = status;

    if (status === LISTING_STATUS.REJECTED) {
      listing.rejectionReason = rejectionReason || "Does not meet community guidelines.";
      // Send rejection email
      const html = getEmailHtml("listing_rejected", { title: listing.title, reason: listing.rejectionReason });
      await notifyByEmail({
        to: listing.sellerId.email,
        subject: "ScholarNest – Action Required on your Listing",
        html,
        userId: listing.sellerId._id,
        type: "listing_rejected",
        title: "Listing rejected",
        message: `Your listing "${listing.title}" requires edits. Reason: ${listing.rejectionReason}`,
        data: { listingId: listing._id },
      });
    }

    if (status === LISTING_STATUS.PUBLISHED) {
      listing.rejectionReason = "";
      if (!listing.publishedAt) listing.publishedAt = new Date();
      // Send approval notification
      await notifyByEmail({
        userId: listing.sellerId._id,
        type: "listing_approved",
        title: "Listing approved!",
        message: `Your listing "${listing.title}" is now live on the marketplace.`,
        data: { listingId: listing._id },
      });
    }

    await listing.save();

    await logModerationAction({
      adminId: req.adminId,
      action: "moderate_listing",
      targetType: "listing",
      targetId: listing._id,
      previousState,
      newState: status,
      reason: rejectionReason,
    });

    res.json({ success: true, listing, message: `Listing ${status.replace("_", " ")}.` });
  } catch (error) {
    next(error);
  }
};

// ── Moderation Queue (Admin) ──────────────────────────────────────────
export const moderationQueue = async (req, res, next) => {
  try {
    const listings = await Listing.find({
      status: { $in: [LISTING_STATUS.PENDING_REVIEW, LISTING_STATUS.REJECTED, LISTING_STATUS.SUSPENDED] },
    })
      .populate("sellerId", "name email campus verificationStatus")
      .sort({ createdAt: 1 });
    res.json({ success: true, listings });
  } catch (error) {
    next(error);
  }
};
