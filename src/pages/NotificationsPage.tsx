import { useEffect, useState } from "react";
import { listNotifications, markAllRead } from "../api";
import type { Notification } from "../types";

const typeIcons: Record<string, string> = {
  food_requested: "🙋",
  delivery_accepted: "🚴",
  picked_up: "📦",
  delivered: "✅",
  post_expired: "⏰",
  general: "🔔",
};

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export default function NotificationsPage() {
  const [notifs, setNotifs] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    try {
      const data = await listNotifications();
      setNotifs(data);
    } finally {
      setLoading(false);
    }
  }

  async function handleMarkAll() {
    await markAllRead();
    setNotifs((prev) => prev.map((n) => ({ ...n, is_read: true })));
  }

  useEffect(() => { load(); }, []);

  const unreadCount = notifs.filter((n) => !n.is_read).length;

  return (
    <div className="max-w-2xl mx-auto space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
          {unreadCount > 0 && (
            <p className="text-sm text-gray-500 mt-0.5">{unreadCount} unread</p>
          )}
        </div>
        {unreadCount > 0 && (
          <button
            onClick={handleMarkAll}
            className="text-sm text-amber-600 hover:text-amber-700 font-medium transition-colors"
          >
            Mark all read
          </button>
        )}
      </div>

      {loading ? (
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="bg-white border border-gray-200 rounded-xl p-4 animate-pulse flex gap-3">
              <div className="w-10 h-10 bg-gray-100 rounded-full shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-3 bg-gray-100 rounded w-3/4" />
                <div className="h-3 bg-gray-100 rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      ) : notifs.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-5xl mb-4">🔔</div>
          <h3 className="font-semibold text-gray-700">No notifications yet</h3>
          <p className="text-sm text-gray-400 mt-1">You'll be notified about your food requests and deliveries here</p>
        </div>
      ) : (
        <div className="space-y-2">
          {notifs.map((n) => (
            <div
              key={n.id}
              className={`flex items-start gap-3 p-4 rounded-xl border transition-colors ${
                n.is_read
                  ? "bg-white border-gray-200 text-gray-600"
                  : "bg-amber-50 border-amber-200 text-gray-900"
              }`}
            >
              <div className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center text-lg shrink-0">
                {typeIcons[n.type] ?? "🔔"}
              </div>
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-medium ${n.is_read ? "text-gray-700" : "text-gray-900"}`}>
                  {n.title}
                </p>
                <p className="text-sm text-gray-500 mt-0.5">{n.message}</p>
                <p className="text-xs text-gray-400 mt-1">{timeAgo(n.created_at)}</p>
              </div>
              {!n.is_read && (
                <div className="w-2 h-2 bg-amber-500 rounded-full mt-1.5 shrink-0" />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
