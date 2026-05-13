import { useEffect, useState } from "react";
import { listRequests, myDeliveries, updateRequestStatus } from "../api";
import StatusBadge from "../components/StatusBadge";
import { toast, ToastContainer } from "../components/Toast";
import type { FoodRequest } from "../types";

const NEXT_STATUS: Record<string, { label: string; status: string; color: string }> = {
  pending: { label: "Accept delivery", status: "delivery_accepted", color: "bg-blue-500 hover:bg-blue-600" },
  delivery_accepted: { label: "Mark picked up", status: "picked_up", color: "bg-purple-500 hover:bg-purple-600" },
  picked_up: { label: "Mark delivered", status: "delivered", color: "bg-green-600 hover:bg-green-700" },
};

function RequestCard({ req, onUpdate }: { req: FoodRequest; onUpdate: () => void }) {
  const [loading, setLoading] = useState(false);
  const next = NEXT_STATUS[req.status];

  async function handleAction() {
    if (!next) return;
    setLoading(true);
    try {
      await updateRequestStatus(req.id, next.status as any);
      toast(`Status updated to ${next.status.replace("_", " ")}`, "success");
      onUpdate();
    } catch (err) {
      toast(err instanceof Error ? err.message : "Update failed", "error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-5 space-y-3">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900">{req.food_post?.title}</h3>
          <p className="text-sm text-gray-500 mt-0.5 capitalize">{req.food_post?.category}</p>
        </div>
        <StatusBadge status={req.status} />
      </div>

      <div className="grid grid-cols-2 gap-2 text-sm">
        <div className="bg-gray-50 rounded-xl p-3">
          <p className="text-xs text-gray-400 mb-0.5">Pickup from</p>
          <p className="font-medium text-gray-700 text-xs">{req.food_post?.address}</p>
          {req.food_post?.donor && (
            <p className="text-xs text-gray-500 mt-0.5">{req.food_post.donor.name} · {req.food_post.donor.phone}</p>
          )}
        </div>
        <div className="bg-gray-50 rounded-xl p-3">
          <p className="text-xs text-gray-400 mb-0.5">Deliver to</p>
          <p className="font-medium text-gray-700 text-xs">{req.delivery_address || req.recipient?.address || "—"}</p>
          {req.recipient && (
            <p className="text-xs text-gray-500 mt-0.5">{req.recipient.name} · {req.recipient.phone}</p>
          )}
        </div>
      </div>

      {req.note && (
        <div className="bg-amber-50 rounded-xl p-3 text-sm text-amber-700">
          Note: {req.note}
        </div>
      )}

      {next && (
        <button
          onClick={handleAction}
          disabled={loading}
          className={`w-full text-white font-semibold py-2.5 rounded-xl transition-colors disabled:opacity-60 text-sm ${next.color}`}
        >
          {loading ? "Updating..." : next.label}
        </button>
      )}

      {req.status === "delivered" && (
        <div className="text-center text-sm text-green-600 font-medium py-1">
          ✅ Delivered {req.delivered_at ? new Date(req.delivered_at).toLocaleDateString() : ""}
        </div>
      )}
    </div>
  );
}

export default function DeliveryDashboard() {
  const [available, setAvailable] = useState<FoodRequest[]>([]);
  const [mine, setMine] = useState<FoodRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"available" | "mine">("available");

  async function load() {
    setLoading(true);
    try {
      const [a, m] = await Promise.all([listRequests(), myDeliveries()]);
      setAvailable(a);
      setMine(m);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  const activeDeliveries = mine.filter((r) => !["delivered", "cancelled"].includes(r.status));
  const shown = tab === "available" ? available : mine;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Delivery Dashboard</h1>
        <p className="text-gray-500 text-sm mt-0.5">Accept and manage food deliveries</p>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Available", value: available.length },
          { label: "Active deliveries", value: activeDeliveries.length },
          { label: "Completed", value: mine.filter((r) => r.status === "delivered").length },
        ].map((s) => (
          <div key={s.label} className="bg-white border border-gray-200 rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-gray-900">{s.value}</p>
            <p className="text-xs text-gray-500 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between border-b border-gray-200 pb-0">
        <div className="flex gap-2">
          {(["available", "mine"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${tab === t ? "border-amber-500 text-amber-700" : "border-transparent text-gray-500"}`}
            >
              {t === "available" ? `Available (${available.length})` : `My Deliveries (${mine.length})`}
            </button>
          ))}
        </div>
        <button onClick={load} className="text-xs text-gray-400 hover:text-gray-600 pb-2">Refresh</button>
      </div>

      {loading ? (
        <div className="text-center py-12 text-gray-400">Loading...</div>
      ) : shown.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-5xl mb-4">🚴</div>
          <p className="text-gray-500">
            {tab === "available" ? "No pending deliveries right now" : "No deliveries yet"}
          </p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          {shown.map((req) => (
            <RequestCard key={req.id} req={req} onUpdate={load} />
          ))}
        </div>
      )}

      <ToastContainer />
    </div>
  );
}
