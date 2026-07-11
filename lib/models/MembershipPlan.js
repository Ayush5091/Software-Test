import mongoose from "mongoose";

const MembershipPlanSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, default: "" },
    durationDays: { type: Number, required: true },
    price: { type: Number, required: true },
    perks: [{ type: String }],
    active: { type: Boolean, default: true }
  },
  { timestamps: true }
);

export default mongoose.models.MembershipPlan ||
  mongoose.model("MembershipPlan", MembershipPlanSchema);
