// ── Roles ──────────────────────────────────────────────────────────
export const USER_ROLES = {
  STUDENT: "student",
  MODERATOR: "moderator",
  SUPPORT: "support",
  SUPER_ADMIN: "super_admin",
};

export const ADMIN_ROLES = [
  USER_ROLES.SUPER_ADMIN,
  USER_ROLES.MODERATOR,
  USER_ROLES.SUPPORT,
];

// ── Account Status ─────────────────────────────────────────────────
export const ACCOUNT_STATUS = {
  ACTIVE: "active",
  SUSPENDED: "suspended",
  DEACTIVATED: "deactivated",
};

// ── Verification Status ────────────────────────────────────────────
export const VERIFICATION_STATUS = {
  UNVERIFIED: "unverified",
  PENDING: "pending",
  VERIFIED: "verified",
  REJECTED: "rejected",
};

// ── Listing ────────────────────────────────────────────────────────
export const LISTING_STATUS = {
  DRAFT: "draft",
  PENDING_REVIEW: "pending_review",
  PUBLISHED: "published",
  RESERVED: "reserved",
  SOLD: "sold",
  REJECTED: "rejected",
  SUSPENDED: "suspended",
  EXPIRED: "expired",
  DELETED: "deleted",
};

export const LISTING_CONDITIONS = ["Like New", "Good", "Fair"];

// ── Order ──────────────────────────────────────────────────────────
export const ORDER_STATUS = {
  PAYMENT_PENDING: "payment_pending",
  CONFIRMED: "confirmed",
  SELLER_NOTIFIED: "seller_notified",
  RESERVED: "reserved",
  READY_FOR_PICKUP: "ready_for_pickup",
  HANDED_OVER: "handed_over",
  SHIPPED: "shipped",
  DELIVERED: "delivered",
  COMPLETED: "completed",
  CANCELLED: "cancelled",
  DISPUTED: "disputed",
  REFUNDED: "refunded",
};

export const PAYMENT_STATUS = {
  PENDING: "pending",
  PAID: "paid",
  PAY_IN_PERSON: "pay_in_person",
  REFUNDED: "refunded",
  FAILED: "failed",
};

export const PAYMENT_METHODS = {
  IN_PERSON: "in_person",
  RAZORPAY: "razorpay",
  STRIPE: "stripe",
};

// ── Offer ──────────────────────────────────────────────────────────
export const OFFER_STATUS = {
  PENDING: "pending",
  ACCEPTED: "accepted",
  REJECTED: "rejected",
  COUNTERED: "countered",
  EXPIRED: "expired",
  CANCELLED: "cancelled",
};

// ── Report ─────────────────────────────────────────────────────────
export const REPORT_STATUS = {
  OPEN: "open",
  UNDER_REVIEW: "under_review",
  RESOLVED: "resolved",
  REJECTED: "rejected",
};

export const REPORT_TARGET_TYPES = {
  LISTING: "listing",
  USER: "user",
  CONVERSATION: "conversation",
};

export const REPORT_REASONS = [
  "fake_listing",
  "inappropriate_content",
  "scam",
  "counterfeit",
  "wrong_category",
  "prohibited_item",
  "misleading_description",
  "harassment",
  "spam",
  "other",
];

// ── Notification ───────────────────────────────────────────────────
export const NOTIFICATION_TYPES = {
  LISTING_APPROVED: "listing_approved",
  LISTING_REJECTED: "listing_rejected",
  NEW_MESSAGE: "new_message",
  NEW_OFFER: "new_offer",
  OFFER_ACCEPTED: "offer_accepted",
  OFFER_REJECTED: "offer_rejected",
  OFFER_COUNTERED: "offer_countered",
  ORDER_PLACED: "order_placed",
  PAYMENT_SUCCESSFUL: "payment_successful",
  PAYMENT_FAILED: "payment_failed",
  LISTING_RESERVED: "listing_reserved",
  LISTING_SOLD: "listing_sold",
  REVIEW_RECEIVED: "review_received",
  SAVED_LISTING_CHANGED: "saved_listing_changed",
  VERIFICATION_SUCCESSFUL: "verification_successful",
  ADMIN_ANNOUNCEMENT: "admin_announcement",
};

// ── Review ─────────────────────────────────────────────────────────
export const REVIEW_STATUS = {
  ACTIVE: "active",
  FLAGGED: "flagged",
  REMOVED: "removed",
};

// ── Pickup ─────────────────────────────────────────────────────────
export const PICKUP_TYPES = [
  "Campus meetup",
  "Pickup from a public campus spot",
  "Can arrange delivery",
];

// ── Pagination ─────────────────────────────────────────────────────
export const DEFAULT_PAGE_SIZE = 24;
export const MAX_PAGE_SIZE = 100;

// ── Currency ───────────────────────────────────────────────────────
export const CURRENCY = "INR";
export const CURRENCY_SYMBOL = "₹";
