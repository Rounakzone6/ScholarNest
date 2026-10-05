import mongoose from "mongoose";
import { NOTIFICATION_TYPES } from "../constants/index.js";

const notificationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    type: {
      type: String,
      enum: Object.values(NOTIFICATION_TYPES),
      required: true,
    },
    title: { type: String, required: true },
    message: { type: String, default: "" },
    data: { type: mongoose.Schema.Types.Mixed, default: {} }, // contextual payload
    read: { type: Boolean, default: false },
  },
  { timestamps: true }
);

notificationSchema.index({ userId: 1, read: 1, createdAt: -1 });

const Notification =
  mongoose.models.Notification || mongoose.model("Notification", notificationSchema);
export default Notification;
