import dbConnect from "@/lib/dbConnect";
import Trainer from "@/lib/models/Trainer";
import AddTrainerForm from "@/components/admin/AddTrainerForm";
import TrainerRow from "@/components/admin/TrainerRow";

export const dynamic = "force-dynamic";

export default async function AdminTrainersPage() {
  await dbConnect();
  const trainers = await Trainer.find().populate("user", "name email").lean();

  return (
    <div className="max-w-6xl mx-auto px-6 py-16">
      <h1 className="font-display font-bold text-3xl text-ink mb-2">Trainers</h1>
      <p className="text-ink-muted mb-8">Add trainer accounts and manage the roster.</p>

      <AddTrainerForm />

      <div className="card p-6 overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="text-xs text-ink-faint border-b border-base-line">
              <th className="pb-3 pr-4 font-normal">Name</th>
              <th className="pb-3 pr-4 font-normal">Email</th>
              <th className="pb-3 pr-4 font-normal">Specialties</th>
              <th className="pb-3 pr-4 font-normal">Rate</th>
              <th className="pb-3 font-normal text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {trainers.map((t) => (
              <TrainerRow key={t._id} trainer={JSON.parse(JSON.stringify(t))} />
            ))}
          </tbody>
        </table>
        {trainers.length === 0 && <p className="text-sm text-ink-muted mt-4">No trainers yet.</p>}
      </div>
    </div>
  );
}
