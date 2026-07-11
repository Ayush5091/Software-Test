import dbConnect from "@/lib/dbConnect";
import Payment from "@/lib/models/Payment";

export const dynamic = "force-dynamic";

export default async function AdminPaymentsPage() {
  await dbConnect();
  const payments = await Payment.find().populate("user", "name email").sort({ createdAt: -1 }).limit(200).lean();
  const total = payments.filter((p) => p.status === "success").reduce((sum, p) => sum + p.amount, 0);

  return (
    <div className="max-w-6xl mx-auto px-6 py-16">
      <h1 className="font-display font-bold text-3xl text-ink mb-2">Payments</h1>
      <p className="text-ink-muted mb-6">Demo checkout ledger — memberships and trainer sessions.</p>

      <div className="card p-6 mb-10 inline-block">
        <p className="text-xs text-ink-faint mb-1">Total collected</p>
        <p className="font-mono text-3xl text-sage">${total.toFixed(2)}</p>
      </div>

      <div className="card overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="text-xs text-ink-faint border-b border-base-line">
              <th className="p-4 font-normal">User</th>
              <th className="p-4 font-normal">Purpose</th>
              <th className="p-4 font-normal">Method</th>
              <th className="p-4 font-normal">Amount</th>
              <th className="p-4 font-normal">Status</th>
              <th className="p-4 font-normal">Date</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((p) => (
              <tr key={p._id} className="border-b border-base-line last:border-0">
                <td className="p-4 text-sm text-ink">{p.user?.name}</td>
                <td className="p-4 text-xs uppercase text-ink-faint">{p.purpose.replace("_", " ")}</td>
                <td className="p-4 text-xs text-ink-muted">{p.method.replace("demo_", "")}</td>
                <td className="p-4 font-mono text-sm text-ink">${p.amount}</td>
                <td className="p-4">
                  <span className={`text-xs font-mono uppercase ${p.status === "success" ? "text-sage" : "text-ember"}`}>
                    {p.status}
                  </span>
                </td>
                <td className="p-4 text-xs text-ink-faint font-mono">
                  {new Date(p.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {payments.length === 0 && <p className="text-sm text-ink-muted p-4">No payments yet.</p>}
      </div>
    </div>
  );
}
