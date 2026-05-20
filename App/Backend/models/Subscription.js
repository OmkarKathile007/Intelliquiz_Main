const mongoose = require("mongoose");

const subscriptionSchema = new mongoose.Schema({
  userId:           { type: String, required: true, unique: true },
  plan:             { type: String, enum: ["free", "pro", "premium"], default: "free" },
  razorpayOrderId:  { type: String },
  razorpayPaymentId:{ type: String },
  expiresAt:        { type: Date },
  createdAt:        { type: Date, default: Date.now },
  updatedAt:        { type: Date, default: Date.now },
});

subscriptionSchema.pre("save", function (next) {
  this.updatedAt = new Date();
  next();
});

module.exports = mongoose.model("Subscription", subscriptionSchema);
