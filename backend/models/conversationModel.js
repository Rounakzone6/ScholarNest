import mongoose from "mongoose";

const conversationSchema = new mongoose.Schema(
  {
    listingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Listing",
      default: null,
    },
    participants: [
      { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    ],
    buyerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    sellerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    lastMessage: { type: String, default: "" },
    lastMessageAt: { type: Date, default: Date.now },
    blockedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    archived: {
      type: Map,
      of: Boolean,
      default: {},
    },
    unreadCount: {
      type: Map,
      of: Number,
      default: {},
    },
  },
  { timestamps: true }
);

conversationSchema.index({ participants: 1 });
conversationSchema.index({ buyerId: 1, sellerId: 1, listingId: 1 }, { unique: true });
conversationSchema.index({ lastMessageAt: -1 });

const Conversation =
  mongoose.models.Conversation || mongoose.model("Conversation", conversationSchema);
export default Conversation;
