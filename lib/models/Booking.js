import mongoose from "mongoose";

const BookingSchema = new mongoose.Schema(
  {
    member: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    type: { type: String, enum: ["session", "trainer", "equipment"], required: true },
    trainer: { type: mongoose.Schema.Types.ObjectId, ref: "Trainer", default: null },
    title: { type: String, required: true }, // e.g. "Yoga Flow" or "1:1 Strength Coaching"
    date: { type: Date, required: true },
    timeSlot: { type: String, required: true }, // "07:00"
    status: {
      type: String,
      enum: ["pending", "confirmed", "rejected", "cancelled", "completed"],
      default: "pending"
    },
    notes: { type: String, default: "" }
  },
  { timestamps: true }
);

export default mongoose.models.Booking || mongoose.model("Booking", BookingSchema);
