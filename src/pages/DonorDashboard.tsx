import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { deletePost, getMyPosts, listRequests } from "../api";
import FoodCard from "../components/FoodCard";
import StatusBadge from "../components/StatusBadge";
import { toast, ToastContainer } from "../components/Toast";
import type { FoodPost, FoodRequest } from "../types";

export default function DonorDashboard() {
  const [posts, setPosts] = useState<FoodPost[]>([]);
  const [requests, setRequests] = useState<FoodRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"posts" | "requests">("posts");

  async function load() {
    setLoading(true);
    try {
      const [p, r] = await Promise.all([getMyPosts(), listRequests()]);
      setPosts(p);
      setRequests(r);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  async function handleDelete(id: number) {
    try {
      await deletePost(id);
      setPosts((prev) => prev.filter((p) => p.id !== id));
      toast("Post cancelled", "success");
    } catch {
      toast("Failed to cancel", "error");
    }
  }

  const activePosts = posts.filter((p) => !["delivered", "cancelled", "expired"].includes(p.status));
  const donePosts = posts.filter((p) => ["delivered", "cancelled"].includes(p.status));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Food Posts</h1>
          <p className="text-gray-500 text-sm mt-0.5">Manage your food sharing posts</p>
        </div>
        <Link
          to="/donor/upload"
          className="bg-amber-500 hover:bg-amber-600 text-white font-medium px-4 py-2 rounded-xl transition-colors text-sm"
        >
          + Share food
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Total posts", value: posts.length },
          { label: "Active", value: activePosts.length },
          { label: "Requests", value: requests.length },
        ].map((s) => (
          <div key={s.label} className="bg-white border border-gray-200 rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-gray-900">{s.value}</p>
            <p className="text-xs text-gray-500 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-gray-200">
        {(["posts", "requests"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 text-sm font-medium capitalize border-b-2 transition-colors ${tab === t ? "border-amber-500 text-amber-700" : "border-transparent text-gray-500 hover:text-gray-700"}`}
          >
            {t === "posts" ? "My Posts" : "Incoming Requests"}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-center py-12 text-gray-400">Loading...</div>
      ) : tab === "posts" ? (
        posts.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-5xl mb-4">🍱</div>
            <p className="text-gray-500 mb-4">No posts yet</p>
            <Link to="/donor/upload" className="bg-amber-500 text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-amber-600 transition-colors">
              Share your first meal
            </Link>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {posts.map((post) => (
              <FoodCard
                key={post.id}
                post={post}
                showStatus
                actions={
                  !["delivered", "cancelled"].includes(post.status) ? (
                    <button
                      onClick={() => handleDelete(post.id)}
                      className="text-xs text-red-500 hover:text-red-700 font-medium transition-colors"
                    >
                      Cancel
                    </button>
                  ) : undefined
                }
              />
            ))}
          </div>
        )
      ) : requests.length === 0 ? (
        <div className="text-center py-16 text-gray-400">No incoming requests</div>
      ) : (
        <div className="space-y-3">
          {requests.map((req) => (
            <div key={req.id} className="bg-white border border-gray-200 rounded-xl p-4 flex items-start gap-4">
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900 truncate">{req.food_post?.title}</p>
                <p className="text-sm text-gray-500 mt-0.5">
                  Requested by <span className="font-medium">{req.recipient?.name}</span>
                </p>
                {req.note && <p className="text-sm text-gray-400 mt-1 italic">"{req.note}"</p>}
                <p className="text-xs text-gray-400 mt-1">{req.delivery_address}</p>
              </div>
              <StatusBadge status={req.status} />
            </div>
          ))}
        </div>
      )}

      <ToastContainer />
    </div>
  );
}
