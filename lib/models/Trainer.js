import mongoose from "mongoose";

const TrainerSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    specialties: [{ type: String }],
    bio: { type: String, default: "" },
    photoUrl: { type: String, default: "" },
    ratePerSession: { type: Number, default: 0 },
    availability: [
      {
        dayOfWeek: { type: Number, min: 0, max: 6 }, // 0 = Sunday
        slots: [{ type: String }] // e.g. ["07:00", "08:00", "17:00"]
      }
    ]
  },
  { timestamps: true }
);

export default mongoose.models.Trainer || mongoose.model("Trainer", TrainerSchema);
