import mongoose from "mongoose";

const PaymentSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    purpose: { type: String, enum: ["membership", "trainer_session"], required: true },
    referenceId: { type: mongoose.Schema.Types.ObjectId, default: null }, // plan or booking id
    amount: { type: Number, required: true },
    method: { type: String, enum: ["demo_card", "demo_upi"], default: "demo_card" },
    status: { type: String, enum: ["success", "failed"], default: "success" }
  },
  { timestamps: true }
);

export default mongoose.models.Payment || mongoose.model("Payment", PaymentSchema);
