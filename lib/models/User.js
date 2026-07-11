import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ["member", "trainer", "admin"], default: "member" },
    phone: { type: String, default: "" },
    goal: {
      type: String,
      enum: ["lose_weight", "build_muscle", "endurance", "general_fitness"],
      default: "general_fitness"
    },
    heightCm: { type: Number, default: null },
    weightKg: { type: Number, default: null },
    loyaltyPoints: { type: Number, default: 0 },
    activeMembership: {
      plan: { type: mongoose.Schema.Types.ObjectId, ref: "MembershipPlan", default: null },
      startDate: { type: Date, default: null },
      endDate: { type: Date, default: null }
    },
    attendance: [
      {
        date: { type: Date, default: Date.now },
        checkedInVia: { type: String, enum: ["qr", "manual"], default: "qr" }
      }
    ],
    progressLogs: [
      {
        date: { type: Date, default: Date.now },
        weightKg: Number,
        note: String
      }
    ]
  },
  { timestamps: true }
);

export default mongoose.models.User || mongoose.model("User", UserSchema);
