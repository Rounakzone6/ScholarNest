import mongoose from "mongoose";
import { REVIEW_STATUS } from "../constants/index.js";

const reviewSchema = new mongoose.Schema(
  {
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },
    reviewerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    revieweeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    listingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Listing",
      required: true,
    },
    rating: { type: Number, required: true, min: 1, max: 5 },
    communicationRating: { type: Number, min: 1, max: 5, default: null },
    accuracyRating: { type: Number, min: 1, max: 5, default: null },
    reliabilityRating: { type: Number, min: 1, max: 5, default: null },
    comment: { type: String, default: "", maxlength: 1000 },
    status: {
      type: String,
      enum: Object.values(REVIEW_STATUS),
      default: REVIEW_STATUS.ACTIVE,
    },
  },
  { timestamps: true }
);

// Prevent duplicate reviews: one reviewer per order
reviewSchema.index({ orderId: 1, reviewerId: 1 }, { unique: true });
reviewSchema.index({ revieweeId: 1, status: 1, createdAt: -1 });
reviewSchema.index({ listingId: 1 });

const Review = mongoose.models.Review || mongoose.model("Review", reviewSchema);
export default Review;
