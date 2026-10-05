import mongoose from "mongoose";

const marketplaceOrderSchema = new mongoose.Schema({
  orderNumber: { type: String, required: true, unique: true, index: true },
  buyerId: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true, index: true },
  sellerId: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true, index: true },
  listingId: { type: mongoose.Schema.Types.ObjectId, ref: "listing", required: true },
  amount: { type: Number, required: true, min: 1 },
  paymentStatus: { type: String, enum: ["pay_in_person", "pending", "paid", "refunded"], default: "pay_in_person" },
  status: { type: String, enum: ["reserved", "handoff_pending", "completed", "cancelled", "disputed"], default: "reserved", index: true },
  handoffPreference: { type: String, default: "Campus meetup" },
  reservedUntil: { type: Date, required: true },
  completedAt: { type: Date },
}, { timestamps: true });

export default mongoose.models.marketplaceOrder || mongoose.model("marketplaceOrder", marketplaceOrderSchema);
