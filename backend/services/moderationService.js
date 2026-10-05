import AuditLog from "../models/auditLogModel.js";

/**
 * Log a moderation action for audit trail.
 */
export const logModerationAction = async ({
  adminId,
  action,
  targetType,
  targetId,
  previousState = null,
  newState = null,
  reason = "",
  metadata = {},
}) => {
  try {
    await AuditLog.create({
      adminId,
      action,
      targetType,
      targetId,
      previousState,
      newState,
      reason,
      metadata,
    });
  } catch (error) {
    console.error("moderationService.logAction:", error.message);
  }
};

/**
 * Get audit logs, paginated.
 */
export const getAuditLogs = async ({ page = 1, limit = 50, targetType, adminId } = {}) => {
  const filter = {};
  if (targetType) filter.targetType = targetType;
  if (adminId) filter.adminId = adminId;
  const skip = (Math.max(1, page) - 1) * limit;
  const [logs, total] = await Promise.all([
    AuditLog.find(filter)
      .populate("adminId", "name username")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    AuditLog.countDocuments(filter),
  ]);
  return { logs, total, page, pages: Math.ceil(total / limit) };
};
