import mongoose from "mongoose";
import { LISTING_STATUS, LISTING_CONDITIONS } from "../constants/index.js";

const listingSchema = new mongoose.Schema(
  {
    // ── Ownership ────────────────────────────────────────────────
    sellerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    // ── Content ──────────────────────────────────────────────────
    title: { type: String, required: true, trim: true, maxlength: 100 },
    slug: { type: String, trim: true, lowercase: true, index: true },
    description: { type: String, required: true, trim: true, maxlength: 3000 },
    images: {
      type: [String],
      validate: [(items) => items.length <= 6, "Maximum six images"],
    },

    // ── Classification ───────────────────────────────────────────
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      default: null,
    },
    categoryName: { type: String, default: "", index: true }, // denormalized
    subCategoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      default: null,
    },
    subCategoryName: { type: String, default: "" },
    tags: [{ type: String, trim: true, lowercase: true }],

    // ── Pricing ──────────────────────────────────────────────────
    price: { type: Number, required: true, min: 1 },
    originalPrice: { type: Number, min: 0 },
    negotiable: { type: Boolean, default: false },

    // ── Item Details ─────────────────────────────────────────────
    condition: {
      type: String,
      enum: LISTING_CONDITIONS,
      required: true,
    },
    brand: { type: String, default: "", trim: true },
    model: { type: String, default: "", trim: true },
    purchaseYear: { type: String, default: "" },
    usageDuration: { type: String, default: "" },
    reasonForSelling: { type: String, default: "" },
    warrantyAvailable: { type: Boolean, default: false },
    billAvailable: { type: Boolean, default: false },
    accessories: { type: String, default: "" },
    defects: { type: String, default: "" },

    // ── Location ─────────────────────────────────────────────────
    campusId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Campus",
      default: null,
    },
    campus: { type: String, required: true, trim: true, index: true }, // denormalized name
    locationArea: { type: String, default: "", trim: true },
    pickupAvailable: { type: Boolean, default: true },
    deliveryAvailable: { type: Boolean, default: false },
    pickupPreference: { type: String, default: "Campus meetup" },

    // ── Status ───────────────────────────────────────────────────
    status: {
      type: String,
      enum: Object.values(LISTING_STATUS),
      default: LISTING_STATUS.PENDING_REVIEW,
      index: true,
    },
    rejectionReason: { type: String, default: "" },
    featured: { type: Boolean, default: false },
    publishedAt: { type: Date, default: null },
    expiresAt: { type: Date, default: null },

    // ── Metrics ──────────────────────────────────────────────────
    views: { type: Number, default: 0 },
    saves: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// ── Indexes ───────────────────────────────────────────────────────────
listingSchema.index({ status: 1, createdAt: -1 });
listingSchema.index({ status: 1, featured: -1, createdAt: -1 });
listingSchema.index({ sellerId: 1, status: 1 });
listingSchema.index({ campusId: 1, status: 1 });
listingSchema.index({ categoryName: 1, status: 1 });
listingSchema.index({ price: 1 });
listingSchema.index({ tags: 1 });
listingSchema.index(
  { title: "text", description: "text", categoryName: "text", campus: "text", tags: "text", brand: "text" },
  { weights: { title: 10, tags: 5, categoryName: 3, brand: 3, description: 1, campus: 1 } }
);

// ── Slug generation ───────────────────────────────────────────────────
listingSchema.pre("save", function (next) {
  if (this.isModified("title") && !this.slug) {
    this.slug =
      this.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "") +
      "-" +
      String(this._id).slice(-6);
  }
  if (this.isModified("status") && this.status === LISTING_STATUS.PUBLISHED && !this.publishedAt) {
    this.publishedAt = new Date();
  }
  next();
});

const Listing = mongoose.models.Listing || mongoose.model("Listing", listingSchema);
export default Listing;
