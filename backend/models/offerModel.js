import mongoose from "mongoose";
import { OFFER_STATUS } from "../constants/index.js";

const offerSchema = new mongoose.Schema(
  {
    listingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Listing",
      required: true,
      index: true,
    },
    buyerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    sellerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    offeredPrice: { type: Number, required: true, min: 1 },
    counterPrice: { type: Number, default: null },
    message: { type: String, default: "", maxlength: 500 },
    status: {
      type: String,
      enum: Object.values(OFFER_STATUS),
      default: OFFER_STATUS.PENDING,
      index: true,
    },
    expiresAt: {
      type: Date,
      default: () => new Date(Date.now() + 48 * 60 * 60 * 1000), // 48h default
    },
  },
  { timestamps: true }
);

offerSchema.index({ listingId: 1, buyerId: 1 });
offerSchema.index({ sellerId: 1, status: 1 });
offerSchema.index({ buyerId: 1, status: 1 });

const Offer = mongoose.models.Offer || mongoose.model("Offer", offerSchema);
export default Offer;
