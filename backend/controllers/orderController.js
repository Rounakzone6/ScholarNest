import Order from "../models/orderModel.js";
import Listing from "../models/listingModel.js";
import User from "../models/userModel.js";
import { notifyByEmail } from "../services/notificationService.js";
import { getEmailHtml } from "../services/emailService.js";
import { ORDER_STATUS, LISTING_STATUS } from "../constants/index.js";
import mongoose from "mongoose";

// ── Reserve Listing (Checkout) ───────────────────────────────────────
export const reserveListing = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { listingId, pickupType, pickupLocation, paymentMethod } = req.body;
    const buyerId = req.userId;

    // 1. Atomically lock the listing (must be PUBLISHED)
    const listing = await Listing.findOneAndUpdate(
      { _id: listingId, status: LISTING_STATUS.PUBLISHED, sellerId: { $ne: buyerId } },
      { $set: { status: LISTING_STATUS.RESERVED } },
      { new: true, session }
    );

    if (!listing) {
      await session.abortTransaction();
      session.endSession();
      return res.status(409).json({ success: false, message: "This item is no longer available." });
    }

    // 2. Snapshots
    const [buyer, seller] = await Promise.all([
      User.findById(buyerId).select("name email phone").session(session),
      User.findById(listing.sellerId).select("name email").session(session),
    ]);

    // 3. Create the order
    const orderNumber = Order.generateOrderNumber();
    const order = await Order.create(
      [
        {
          orderNumber,
          buyerId,
          sellerId: listing.sellerId,
          listingId: listing._id,
          amount: listing.price,
          total: listing.price,
          pickupType: pickupType || "Campus meetup",
          pickupLocation,
          paymentMethod,
          orderStatus: ORDER_STATUS.RESERVED,
          buyerName: buyer.name,
          buyerPhone: buyer.phone,
          buyerEmail: buyer.email,
          sellerName: seller.name,
          reservedUntil: new Date(Date.now() + 48 * 60 * 60 * 1000), // 48 hrs to complete
        },
      ],
      { session }
    );

    await session.commitTransaction();
    session.endSession();

    // 4. Notifications (outside transaction)
    const html = getEmailHtml("order_confirmation", {
      buyerName: buyer.name,
      listingTitle: listing.title,
      orderNumber,
      amount: listing.price,
    });
    
    await notifyByEmail({
      to: seller.email,
      subject: "A student reserved your ScholarNest listing",
      html,
      userId: seller._id,
      type: "listing_reserved",
      title: "Item reserved!",
      message: `${buyer.name} reserved "${listing.title}". Meet at campus to hand off.`,
      data: { orderId: order[0]._id },
    });

    res.status(201).json({
      success: true,
      order: order[0],
      message: "Item reserved successfully. Arrange your handoff.",
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    next(error);
  }
};

// ── My Orders (Buyer or Seller) ───────────────────────────────────────
export const myOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({
      $or: [{ buyerId: req.userId }, { sellerId: req.userId }],
    })
      .populate("listingId", "title images campus locationArea")
      .populate("buyerId", "name username avatar phone")
      .populate("sellerId", "name username avatar")
      .sort({ createdAt: -1 });

    const formattedOrders = orders.map((order) => {
      const isBuyer = String(order.buyerId._id) === String(req.userId);
      return {
        ...order.toObject(),
        viewerRole: isBuyer ? "buyer" : "seller",
      };
    });

    res.json({ success: true, orders: formattedOrders });
  } catch (error) {
    next(error);
  }
};

// ── Update Order Status ───────────────────────────────────────────────
export const updateOrder = async (req, res, next) => {
  try {
    const { orderId, action } = req.body;
    const order = await Order.findOne({
      _id: orderId,
      $or: [{ buyerId: req.userId }, { sellerId: req.userId }],
    });

    if (!order) return res.status(404).json({ success: false, message: "Order not found." });

    const isBuyer = String(order.buyerId) === String(req.userId);

    if (action === "ready" && !isBuyer && order.orderStatus === ORDER_STATUS.RESERVED) {
      order.orderStatus = ORDER_STATUS.READY_FOR_PICKUP;
    } else if (action === "complete" && isBuyer && [ORDER_STATUS.RESERVED, ORDER_STATUS.READY_FOR_PICKUP].includes(order.orderStatus)) {
      order.orderStatus = ORDER_STATUS.COMPLETED;
      order.completedAt = new Date();
    } else if (action === "cancel" && order.orderStatus === ORDER_STATUS.RESERVED) {
      order.orderStatus = ORDER_STATUS.CANCELLED;
      order.cancelledAt = new Date();
    } else {
      return res.status(409).json({ success: false, message: "Invalid action for current order state." });
    }

    await order.save();

    // Cascading Listing updates
    if (order.orderStatus === ORDER_STATUS.COMPLETED) {
      await Listing.updateOne(
        { _id: order.listingId, status: LISTING_STATUS.RESERVED },
        { $set: { status: LISTING_STATUS.SOLD } }
      );
      // Update stats
      await User.updateOne({ _id: order.sellerId }, { $inc: { "sellerStats.totalSales": 1 } });
      await User.updateOne({ _id: order.buyerId }, { $inc: { "buyerStats.totalPurchases": 1 } });
    }

    if (order.orderStatus === ORDER_STATUS.CANCELLED) {
      await Listing.updateOne(
        { _id: order.listingId, status: LISTING_STATUS.RESERVED },
        { $set: { status: LISTING_STATUS.PUBLISHED } }
      );
    }

    const messages = {
      [ORDER_STATUS.READY_FOR_PICKUP]: "Buyer notified that the item is ready.",
      [ORDER_STATUS.COMPLETED]: "Exchange completed. Thank you for using ScholarNest!",
      [ORDER_STATUS.CANCELLED]: "Reservation cancelled. Item returned to marketplace.",
    };

    res.json({ success: true, order, message: messages[order.orderStatus] });
  } catch (error) {
    next(error);
  }
};
