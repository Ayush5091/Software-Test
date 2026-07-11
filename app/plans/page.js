import dbConnect from "@/lib/dbConnect";
import MembershipPlan from "@/lib/models/MembershipPlan";
import BuyPlanButton from "@/components/BuyPlanButton";
import { getSessionUser } from "@/lib/auth";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function PlansPage() {
  await dbConnect();
  const session = getSessionUser();
  const plans = await MembershipPlan.find({ active: true }).sort({ price: 1 }).lean();

  return (
    <div className="max-w-6xl mx-auto px-6 py-16">
      <h1 className="font-display font-bold text-3xl text-ink mb-2">Membership plans</h1>
      <p className="text-ink-muted mb-10">Pick the plan that fits how often you train.</p>

      {plans.length === 0 ? (
        <p className="text-ink-muted">No plans available yet — check back soon.</p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {plans.map((p, i) => (
            <div key={p._id} className={`card p-6 flex flex-col ${i === 1 ? "border-signal" : ""}`}>
              {i === 1 && (
                <span className="text-[11px] font-mono tracking-widest text-signal-bright mb-2">MOST POPULAR</span>
              )}
              <h3 className="font-display font-semibold text-xl text-ink">{p.name}</h3>
              <p className="text-sm text-ink-muted mt-1 mb-4">{p.description}</p>
              <p className="font-mono text-3xl text-ink mb-1">
                ${p.price}
                <span className="text-sm text-ink-faint"> / {p.durationDays} days</span>
              </p>
              <ul className="text-sm text-ink-muted space-y-2 my-5 flex-1">
                {p.perks?.map((perk) => (
                  <li key={perk} className="flex gap-2">
                    <span className="text-sage">✓</span> {perk}
                  </li>
                ))}
              </ul>
              {session ? (
                session.role === "member" ? (
                  <BuyPlanButton planId={p._id.toString()} price={p.price} />
                ) : (
                  <p className="text-xs text-ink-faint text-center">Member accounts can purchase plans.</p>
                )
              ) : (
                <Link
                  href="/login"
                  className="focus-ring w-full py-2.5 rounded-md bg-signal hover:bg-signal-bright text-white font-medium transition-colors text-center block"
                >
                  Log in to buy
                </Link>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
