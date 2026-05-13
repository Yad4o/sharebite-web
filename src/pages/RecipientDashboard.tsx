import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { listRequests } from "../api";
import StatusBadge from "../components/StatusBadge";
import type { FoodRequest, RequestStatus } from "../types";

const STATUS_ORDER: RequestStatus[] = ["pending", "delivery_accepted", "picked_up", "delivered", "cancelled"];

const STEPS = [
  { status: "pending", label: "Request sent", icon: "📤" },
  { status: "delivery_accepted", label: "Delivery assigned", icon: "🚴" },
  { status: "picked_up", label: "Picked up", icon: "📦" },
  { status: "delivered", label: "Delivered", icon: "✅" },
];

function TrackingProgress({ status }: { status: RequestStatus }) {
  const idx = STATUS_ORDER.indexOf(status);
  if (status === "cancelled") {
    return <div className="text-sm text-red-500 mt-2">Request cancelled</div>;
  }
  return (
    <div className="flex items-center gap-1 mt-3">
      {STEPS.map((step, i) => {
        const stepIdx = STATUS_ORDER.indexOf(step.status as RequestStatus);
        const done = stepIdx <= idx;
        return (
          <div key={step.status} className="flex items-center gap-1 flex-1">
            <div className={`flex flex-col items-center ${i < STEPS.length - 1 ? "flex-1" : ""}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${done ? "bg-amber-500" : "bg-gray-100"}`}>
                {done ? step.icon : <span className="text-gray-300">○</span>}
              </div>
              <span className="text-xs text-gray-500 mt-1 text-center leading-tight">{step.label}</span>
            </div>
            {i < STEPS.length - 1 && (
              <div className={`flex-1 h-0.5 mb-4 ${stepIdx < idx ? "bg-amber-400" : "bg-gray-200"}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}

export default function RecipientDashboard() {
  const [requests, setRequests] = useState<FoodRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"active" | "done">("active");

  useEffect(() => {
    listRequests().then(setRequests).finally(() => setLoading(false));
  }, []);

  const active = requests.filter((r) => !["delivered", "cancelled"].includes(r.status));
  const done = requests.filter((r) => ["delivered", "cancelled"].includes(r.status));
  const shown = tab === "active" ? active : done;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">My Requests</h1>
        <p className="text-gray-500 text-sm mt-0.5">Track your food requests</p>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Total requests", value: requests.length },
          { label: "Active", value: active.length },
          { label: "Delivered", value: requests.filter((r) => r.status === "delivered").length },
        ].map((s) => (
          <div key={s.label} className="bg-white border border-gray-200 rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-gray-900">{s.value}</p>
            <p className="text-xs text-gray-500 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="flex gap-2 border-b border-gray-200">
        {(["active", "done"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 text-sm font-medium capitalize border-b-2 transition-colors ${tab === t ? "border-amber-500 text-amber-700" : "border-transparent text-gray-500"}`}
          >
            {t === "active" ? `Active (${active.length})` : `History (${done.length})`}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-center py-12 text-gray-400">Loading...</div>
      ) : shown.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-5xl mb-4">🙏</div>
          <p className="text-gray-500 mb-4">
            {tab === "active" ? "No active requests" : "No history yet"}
          </p>
          {tab === "active" && (
            <Link to="/feed" className="bg-amber-500 text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-amber-600 transition-colors">
              Browse food
            </Link>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {shown.map((req) => (
            <div key={req.id} className="bg-white border border-gray-200 rounded-2xl p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="font-semibold text-gray-900">{req.food_post?.title}</h3>
                  <p className="text-sm text-gray-500 mt-0.5">
                    from <span className="font-medium">{req.food_post?.donor?.name}</span>
                  </p>
                  <p className="text-xs text-gray-400 mt-1">{req.food_post?.address}</p>
                </div>
                <StatusBadge status={req.status} />
              </div>

              {req.delivery_partner && (
                <div className="mt-3 bg-blue-50 rounded-xl p-3 text-sm text-blue-700">
                  🚴 {req.delivery_partner.name} is your delivery partner
                  {req.delivery_partner.phone && ` · ${req.delivery_partner.phone}`}
                </div>
              )}

              <TrackingProgress status={req.status} />

              {req.delivered_at && (
                <p className="text-xs text-gray-400 mt-2">
                  Delivered {new Date(req.delivered_at).toLocaleDateString()}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
