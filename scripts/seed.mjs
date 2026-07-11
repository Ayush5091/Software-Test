// Run with: npm run seed
// Populates an admin account, a few trainers, and starter membership plans.
import "dotenv/config";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  console.error("Set MONGODB_URI in .env.local before seeding.");
  process.exit(1);
}

const UserSchema = new mongoose.Schema({}, { strict: false, timestamps: true });
const TrainerSchema = new mongoose.Schema({}, { strict: false, timestamps: true });
const PlanSchema = new mongoose.Schema({}, { strict: false, timestamps: true });

const User = mongoose.models.User || mongoose.model("User", UserSchema);
const Trainer = mongoose.models.Trainer || mongoose.model("Trainer", TrainerSchema);
const MembershipPlan =
  mongoose.models.MembershipPlan || mongoose.model("MembershipPlan", PlanSchema);

async function run() {
  await mongoose.connect(MONGODB_URI);
  console.log("Connected to MongoDB");

  const adminEmail = process.env.SEED_ADMIN_EMAIL || "admin@fitbook.com";
  const adminPassword = process.env.SEED_ADMIN_PASSWORD || "Admin@1234";

  let admin = await User.findOne({ email: adminEmail });
  if (!admin) {
    const passwordHash = await bcrypt.hash(adminPassword, 10);
    admin = await User.create({
      name: "FitBook Admin",
      email: adminEmail,
      passwordHash,
      role: "admin"
    });
    console.log(`Created admin: ${adminEmail} / ${adminPassword}`);
  } else {
    console.log("Admin already exists, skipping.");
  }

  const trainerSeed = [
    { name: "Ariana Cole", specialties: ["Strength", "Powerlifting"], rate: 35 },
    { name: "Marcus Reid", specialties: ["HIIT", "Weight Loss"], rate: 30 },
    { name: "Priya Nair", specialties: ["Yoga", "Mobility"], rate: 25 }
  ];

  for (const t of trainerSeed) {
    const email = t.name.toLowerCase().replace(/\s+/g, ".") + "@fitbook.com";
    let user = await User.findOne({ email });
    if (!user) {
      const passwordHash = await bcrypt.hash("Trainer@123", 10);
      user = await User.create({ name: t.name, email, passwordHash, role: "trainer" });
    }
    const existingTrainer = await Trainer.findOne({ user: user._id });
    if (!existingTrainer) {
      await Trainer.create({
        user: user._id,
        specialties: t.specialties,
        bio: `${t.name} specializes in ${t.specialties.join(" & ")}.`,
        ratePerSession: t.rate,
        availability: [
          { dayOfWeek: 1, slots: ["07:00", "09:00", "17:00", "18:00"] },
          { dayOfWeek: 3, slots: ["07:00", "09:00", "17:00", "18:00"] },
          { dayOfWeek: 5, slots: ["07:00", "09:00", "17:00"] }
        ]
      });
      console.log(`Created trainer: ${email} / Trainer@123`);
    }
  }

  const plans = [
    {
      name: "Starter",
      description: "Great for getting into a routine.",
      durationDays: 30,
      price: 29,
      perks: ["Gym floor access", "1 free trainer session", "Locker access"]
    },
    {
      name: "Pro",
      description: "For regulars who want structure and support.",
      durationDays: 90,
      price: 79,
      perks: ["Everything in Starter", "4 trainer sessions/month", "Progress dashboard"]
    },
    {
      name: "Elite",
      description: "Full access with unlimited coaching.",
      durationDays: 365,
      price: 299,
      perks: ["Everything in Pro", "Unlimited trainer sessions", "Priority booking", "Diet plan reviews"]
    }
  ];

  for (const p of plans) {
    const existing = await MembershipPlan.findOne({ name: p.name });
    if (!existing) {
      await MembershipPlan.create(p);
      console.log(`Created plan: ${p.name}`);
    }
  }

  console.log("Seeding complete.");
  await mongoose.disconnect();
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
