import razorpay from "razorpay";
import crypto from "crypto";
import { CURRENCY } from "../constants/index.js";

let razorpayInstance = null;

const getRazorpay = () => {
  if (!razorpayInstance && process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET) {
    razorpayInstance = new razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
  }
  return razorpayInstance;
};

/**
 * Create a Razorpay order on the server side.
 */
export const createRazorpayOrder = async ({ amount, receipt, notes = {} }) => {
  const rp = getRazorpay();
  if (!rp) throw new Error("Razorpay is not configured.");
  return rp.orders.create({
    amount: Math.round(amount * 100), // paise
    currency: CURRENCY,
    receipt,
    notes,
  });
};

/**
 * Verify Razorpay payment signature server-side.
 * This is the ONLY reliable way to confirm payment.
 */
export const verifyRazorpaySignature = ({
  razorpay_order_id,
  razorpay_payment_id,
  razorpay_signature,
}) => {
  const secret = process.env.RAZORPAY_KEY_SECRET;
  if (!secret) throw new Error("Razorpay secret not configured.");
  const body = razorpay_order_id + "|" + razorpay_payment_id;
  const expectedSignature = crypto
    .createHmac("sha256", secret)
    .update(body)
    .digest("hex");
  return expectedSignature === razorpay_signature;
};

/**
 * Fetch order status from Razorpay (backup verification).
 */
export const fetchRazorpayOrder = async (razorpayOrderId) => {
  const rp = getRazorpay();
  if (!rp) throw new Error("Razorpay is not configured.");
  return rp.orders.fetch(razorpayOrderId);
};
