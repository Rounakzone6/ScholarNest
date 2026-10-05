import Notification from "../models/notificationModel.js";
import transporter from "../config/nodemailer.js";

/**
 * Create an in-app notification for a user.
 */
export const createNotification = async ({ userId, type, title, message = "", data = {} }) => {
  try {
    await Notification.create({ userId, type, title, message, data });
  } catch (error) {
    console.error("notificationService.createNotification:", error.message);
  }
};

/**
 * Send a transactional email and optionally create an in-app notification.
 */
export const notifyByEmail = async ({ to, subject, html, text, userId, type, title, message, data }) => {
  // In-app notification
  if (userId && type && title) {
    await createNotification({ userId, type, title, message, data });
  }

  // Email
  if (!to || !process.env.SENDER_EMAIL) return;
  try {
    await transporter.sendMail({
      from: `"ScholarNest" <${process.env.SENDER_EMAIL}>`,
      to,
      subject,
      html,
      text,
    });
  } catch (error) {
    console.error("notificationService.notifyByEmail:", error.message);
  }
};

/**
 * Mark notification as read.
 */
export const markRead = async (notificationId, userId) => {
  return Notification.findOneAndUpdate(
    { _id: notificationId, userId },
    { read: true },
    { new: true }
  );
};

/**
 * Mark all notifications as read for a user.
 */
export const markAllRead = async (userId) => {
  return Notification.updateMany({ userId, read: false }, { read: true });
};

/**
 * Get paginated notifications for a user.
 */
export const getUserNotifications = async (userId, { page = 1, limit = 30 } = {}) => {
  const skip = (Math.max(1, page) - 1) * limit;
  const [notifications, total, unread] = await Promise.all([
    Notification.find({ userId }).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
    Notification.countDocuments({ userId }),
    Notification.countDocuments({ userId, read: false }),
  ]);
  return { notifications, total, unread, page, pages: Math.ceil(total / limit) };
};
