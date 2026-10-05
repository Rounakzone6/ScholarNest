import mongoose from "mongoose";
import { ORDER_STATUS, PAYMENT_STATUS, PAYMENT_METHODS } from "../constants/index.js";

const orderSchema = new mongoose.Schema(
  {
    orderNumber: {
      type: String,
      required: true,
      unique: true,
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
    listingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Listing",
      required: true,
    },

    // ── Financials ────────────────────────────────────────────────
    amount: { type: Number, required: true, min: 1 },
    platformFee: { type: Number, default: 0 },
    deliveryFee: { type: Number, default: 0 },
    total: { type: Number, required: true, min: 1 },

    // ── Payment ───────────────────────────────────────────────────
    paymentMethod: {
      type: String,
      enum: Object.values(PAYMENT_METHODS),
      default: PAYMENT_METHODS.IN_PERSON,
    },
    paymentStatus: {
      type: String,
      enum: Object.values(PAYMENT_STATUS),
      default: PAYMENT_STATUS.PAY_IN_PERSON,
    },
    transactionId: { type: String, default: "" },
    razorpayOrderId: { type: String, default: "" },
    razorpayPaymentId: { type: String, default: "" },

    // ── Status ────────────────────────────────────────────────────
    orderStatus: {
      type: String,
      enum: Object.values(ORDER_STATUS),
      default: ORDER_STATUS.RESERVED,
      index: true,
    },

    // ── Fulfillment ───────────────────────────────────────────────
    pickupType: { type: String, default: "Campus meetup" },
    pickupLocation: { type: String, default: "" },

    // ── Timestamps ────────────────────────────────────────────────
    reservedAt: { type: Date, default: Date.now },
    reservedUntil: { type: Date },
    confirmedAt: { type: Date },
    completedAt: { type: Date },
    cancelledAt: { type: Date },

    // ── Disputes ──────────────────────────────────────────────────
    refundStatus: {
      type: String,
      enum: ["none", "requested", "approved", "refunded", "rejected"],
      default: "none",
    },
    disputeStatus: {
      type: String,
      enum: ["none", "open", "under_review", "resolved", "closed"],
      default: "none",
    },
    disputeReason: { type: String, default: "" },

    // ── Buyer / Seller info snapshot ──────────────────────────────
    buyerName: { type: String, default: "" },
    buyerPhone: { type: String, default: "" },
    buyerEmail: { type: String, default: "" },
    sellerName: { type: String, default: "" },
  },
  { timestamps: true }
);

// ── Indexes ───────────────────────────────────────────────────────────
orderSchema.index({ buyerId: 1, createdAt: -1 });
orderSchema.index({ sellerId: 1, createdAt: -1 });
orderSchema.index({ listingId: 1 });
orderSchema.index({ orderStatus: 1, createdAt: -1 });
orderSchema.index({ paymentStatus: 1 });

// ── Statics ───────────────────────────────────────────────────────────
orderSchema.statics.generateOrderNumber = function () {
  const ts = Date.now().toString(36).toUpperCase();
  const rand = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `SN-${ts}-${rand}`;
};

const Order = mongoose.models.Order || mongoose.model("Order", orderSchema);
export default Order;
