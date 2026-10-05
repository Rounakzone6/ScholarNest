import mongoose from "mongoose";
import {
  REPORT_STATUS,
  REPORT_TARGET_TYPES,
  REPORT_REASONS,
} from "../constants/index.js";

const reportSchema = new mongoose.Schema(
  {
    reporterId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    targetType: {
      type: String,
      enum: Object.values(REPORT_TARGET_TYPES),
      required: true,
    },
    targetId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    reason: {
      type: String,
      enum: REPORT_REASONS,
      required: true,
    },
    description: { type: String, default: "", maxlength: 1000 },
    status: {
      type: String,
      enum: Object.values(REPORT_STATUS),
      default: REPORT_STATUS.OPEN,
      index: true,
    },
    adminNotes: { type: String, default: "" },
    resolvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    resolvedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

reportSchema.index({ targetType: 1, targetId: 1 });
reportSchema.index({ reporterId: 1 });
reportSchema.index({ status: 1, createdAt: -1 });

const Report = mongoose.models.Report || mongoose.model("Report", reportSchema);
export default Report;
