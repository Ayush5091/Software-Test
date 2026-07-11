import dbConnect from "@/lib/dbConnect";
import User from "@/lib/models/User";
import UserRow from "@/components/admin/UserRow";

export const dynamic = "force-dynamic";

export default async function AdminUsersPage() {
  await dbConnect();
  const users = await User.find().select("-passwordHash").sort({ createdAt: -1 }).lean();

  return (
    <div className="max-w-6xl mx-auto px-6 py-16">
      <h1 className="font-display font-bold text-3xl text-ink mb-2">Users</h1>
      <p className="text-ink-muted mb-10">{users.length} accounts across members, trainers, and admins.</p>

      <div className="card p-6 overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="text-xs text-ink-faint border-b border-base-line">
              <th className="pb-3 pr-4 font-normal">Name</th>
              <th className="pb-3 pr-4 font-normal">Email</th>
              <th className="pb-3 pr-4 font-normal">Role</th>
              <th className="pb-3 pr-4 font-normal">Points</th>
              <th className="pb-3 font-normal text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <UserRow key={u._id} user={JSON.parse(JSON.stringify(u))} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
