import mongoose from "mongoose";

const auditLogSchema = new mongoose.Schema(
  {
    adminId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    action: { type: String, required: true },
    targetType: { type: String, required: true }, // "listing", "user", "order", etc.
    targetId: { type: mongoose.Schema.Types.ObjectId, required: true },
    previousState: { type: mongoose.Schema.Types.Mixed, default: null },
    newState: { type: mongoose.Schema.Types.Mixed, default: null },
    reason: { type: String, default: "" },
    metadata: { type: mongoose.Schema.Types.Mixed, default: {} },
  },
  { timestamps: true }
);

auditLogSchema.index({ adminId: 1, createdAt: -1 });
auditLogSchema.index({ targetType: 1, targetId: 1 });
auditLogSchema.index({ action: 1, createdAt: -1 });

const AuditLog = mongoose.models.AuditLog || mongoose.model("AuditLog", auditLogSchema);
export default AuditLog;
