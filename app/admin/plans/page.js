import dbConnect from "@/lib/dbConnect";
import MembershipPlan from "@/lib/models/MembershipPlan";
import AddPlanForm from "@/components/admin/AddPlanForm";
import PlanRow from "@/components/admin/PlanRow";

export const dynamic = "force-dynamic";

export default async function AdminPlansPage() {
  await dbConnect();
  const plans = await MembershipPlan.find({ active: true }).sort({ price: 1 }).lean();

  return (
    <div className="max-w-5xl mx-auto px-6 py-16">
      <h1 className="font-display font-bold text-3xl text-ink mb-2">Membership plans</h1>
      <p className="text-ink-muted mb-8">Create and manage the plans members can purchase.</p>

      <AddPlanForm />

      <div className="card p-6 overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="text-xs text-ink-faint border-b border-base-line">
              <th className="pb-3 pr-4 font-normal">Name</th>
              <th className="pb-3 pr-4 font-normal">Price</th>
              <th className="pb-3 pr-4 font-normal">Duration</th>
              <th className="pb-3 font-normal text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {plans.map((p) => (
              <PlanRow key={p._id} plan={JSON.parse(JSON.stringify(p))} />
            ))}
          </tbody>
        </table>
        {plans.length === 0 && <p className="text-sm text-ink-muted mt-4">No plans yet.</p>}
      </div>
    </div>
  );
}
