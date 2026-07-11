"use client";
import { useEffect, useState } from "react";

export default function AdminAnnouncementsPage() {
  const [notifications, setNotifications] = useState([]);
  const [form, setForm] = useState({ title: "", message: "", audience: "all" });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");

  async function load() {
    const res = await fetch("/api/notifications");
    const data = await res.json();
    setNotifications(data.notifications || []);
  }

  useEffect(() => {
    load();
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setStatus("");
    const res = await fetch("/api/notifications", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    });
    if (res.ok) {
      setForm({ title: "", message: "", audience: "all" });
      setStatus("Announcement sent.");
      load();
    } else {
      const data = await res.json();
      setStatus(data.error || "Could not send announcement.");
    }
    setLoading(false);
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-16">
      <h1 className="font-display font-bold text-3xl text-ink mb-2">Announcements</h1>
      <p className="text-ink-muted mb-10">Send a message to members, trainers, or everyone at once.</p>

      <form onSubmit={handleSubmit} className="card p-6 space-y-4 mb-10">
        <input
          placeholder="Title"
          required
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          className="w-full bg-base-raised border border-base-line rounded-md px-3 py-2 text-ink text-sm focus-ring"
        />
        <textarea
          placeholder="Message"
          required
          rows={3}
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
          className="w-full bg-base-raised border border-base-line rounded-md px-3 py-2 text-ink text-sm focus-ring"
        />
        <select
          value={form.audience}
          onChange={(e) => setForm({ ...form, audience: e.target.value })}
          className="bg-base-raised border border-base-line rounded-md px-3 py-2 text-ink text-sm focus-ring"
        >
          <option value="all">Everyone</option>
          <option value="members">Members only</option>
          <option value="trainers">Trainers only</option>
        </select>
        <button
          disabled={loading}
          className="focus-ring px-4 py-2 rounded-md bg-signal hover:bg-signal-bright text-white text-sm font-medium disabled:opacity-60"
        >
          {loading ? "Sending…" : "Send announcement"}
        </button>
        {status && <p className="text-sm text-ink-muted">{status}</p>}
      </form>

      <h2 className="font-display font-semibold text-lg text-ink mb-4">Sent history</h2>
      {notifications.length === 0 ? (
        <p className="text-sm text-ink-muted">No announcements sent yet.</p>
      ) : (
        <div className="card divide-y divide-base-line">
          {notifications.map((n) => (
            <div key={n._id} className="p-5">
              <div className="flex items-center justify-between">
                <p className="text-ink font-medium">{n.title}</p>
                <span className="text-xs font-mono uppercase text-ink-faint">{n.audience}</span>
              </div>
              <p className="text-sm text-ink-muted mt-1">{n.message}</p>
              <p className="text-xs text-ink-faint mt-2">{new Date(n.createdAt).toLocaleString()}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
