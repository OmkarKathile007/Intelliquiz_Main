const express  = require("express");
const crypto   = require("crypto");
const Subscription = require("../models/Subscription");

const router = express.Router();

const PLAN_AMOUNTS = { pro: 9900, premium: 19900 }; // paise (₹99, ₹199)

// Lazy-load Razorpay so the server starts without the package if key isn't set
function getRazorpay() {
  const Razorpay = require("razorpay");
  return new Razorpay({
    key_id:     process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });
}

// POST /api/subscription/create-order
router.post("/create-order", async (req, res) => {
  const { plan, userId } = req.body;

  if (!PLAN_AMOUNTS[plan]) {
    return res.status(400).json({ msg: "Invalid plan." });
  }

  if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
    return res.status(503).json({ msg: "Payment gateway not configured." });
  }

  try {
    const razorpay = getRazorpay();
    const order = await razorpay.orders.create({
      amount:   PLAN_AMOUNTS[plan],
      currency: "INR",
      receipt:  `iq_${userId.slice(0, 15)}_${Date.now()}`,
    });

    res.json({
      orderId:  order.id,
      amount:   order.amount,
      currency: order.currency,
      keyId:    process.env.RAZORPAY_KEY_ID,
    });
  } catch (err) {
    console.error("Razorpay order error:", err?.error || err?.message || err);
    res.status(500).json({ msg: "Failed to create payment order.", detail: err?.error?.description || err?.message });
  }
});

// POST /api/subscription/verify
router.post("/verify", async (req, res) => {
  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    plan,
    userId,
  } = req.body;

  const secret = process.env.RAZORPAY_KEY_SECRET;
  if (!secret) return res.status(503).json({ msg: "Payment gateway not configured." });

  const expected = crypto
    .createHmac("sha256", secret)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest("hex");

  if (expected !== razorpay_signature) {
    return res.status(400).json({ msg: "Payment verification failed." });
  }

  try {
    const expiresAt = new Date();
    expiresAt.setMonth(expiresAt.getMonth() + 1);

    await Subscription.findOneAndUpdate(
      { userId },
      { plan, razorpayOrderId: razorpay_order_id, razorpayPaymentId: razorpay_payment_id, expiresAt },
      { upsert: true, new: true }
    );

    res.json({ success: true, plan });
  } catch (err) {
    console.error("Subscription save error:", err);
    res.status(500).json({ msg: "Failed to activate subscription." });
  }
});

// GET /api/subscription/status/:userId
router.get("/status/:userId", async (req, res) => {
  try {
    const sub = await Subscription.findOne({ userId: req.params.userId });
    if (!sub || (sub.expiresAt && sub.expiresAt < new Date())) {
      return res.json({ plan: "free" });
    }
    res.json({ plan: sub.plan, expiresAt: sub.expiresAt });
  } catch {
    res.status(500).json({ msg: "Server error." });
  }
});

module.exports = router;
