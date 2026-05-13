import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getPost, createRequest } from "../api";
import { useAuth } from "../context/AuthContext";
import StatusBadge from "../components/StatusBadge";
import { toast, ToastContainer } from "../components/Toast";
import type { FoodPost } from "../types";

export default function PostDetail() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [post, setPost] = useState<FoodPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [requesting, setRequesting] = useState(false);
  const [note, setNote] = useState("");
  const [requested, setRequested] = useState(false);

  useEffect(() => {
    if (!id) return;
    getPost(Number(id)).then(setPost).catch(() => navigate("/feed")).finally(() => setLoading(false));
  }, [id]);

  async function handleRequest() {
    if (!post) return;
    setRequesting(true);
    try {
      await createRequest({ food_post_id: post.id, note: note || undefined });
      setRequested(true);
      toast("Request sent! The donor has been notified.", "success");
    } catch (err) {
      toast(err instanceof Error ? err.message : "Request failed", "error");
    } finally {
      setRequesting(false);
    }
  }

  if (loading) return <div className="text-center py-20 text-gray-400">Loading...</div>;
  if (!post) return null;

  const canRequest = user && user.role !== "donor" && post.status === "available" && post.donor_id !== user.id;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <button onClick={() => navigate(-1)} className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1">
        ← Back
      </button>

      {post.image_url ? (
        <img src={post.image_url} alt={post.title} className="w-full h-72 object-cover rounded-2xl" />
      ) : (
        <div className="w-full h-72 bg-amber-50 rounded-2xl flex items-center justify-center text-7xl">🍱</div>
      )}

      <div className="bg-white border border-gray-200 rounded-2xl p-6 space-y-4">
        <div className="flex items-start justify-between gap-3">
          <h1 className="text-2xl font-bold text-gray-900">{post.title}</h1>
          <StatusBadge status={post.status} />
        </div>

        {post.description && <p className="text-gray-600">{post.description}</p>}

        <div className="grid grid-cols-2 gap-3 text-sm">
          {[
            { label: "Quantity", value: post.quantity },
            { label: "Serves", value: post.serves ? `${post.serves} people` : "—" },
            { label: "Category", value: post.category },
            { label: "Allergens", value: post.allergens || "None listed" },
          ].map((s) => (
            <div key={s.label} className="bg-gray-50 rounded-xl p-3">
              <p className="text-xs text-gray-400 mb-0.5">{s.label}</p>
              <p className="font-medium capitalize">{s.value}</p>
            </div>
          ))}
        </div>

        <div className="flex gap-2 flex-wrap">
          {post.is_vegetarian && <span className="text-xs bg-green-100 text-green-700 px-2.5 py-1 rounded-full">Vegetarian</span>}
          {post.is_vegan && <span className="text-xs bg-green-100 text-green-700 px-2.5 py-1 rounded-full">Vegan</span>}
        </div>

        <div className="flex items-center gap-2 text-sm text-gray-500">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          </svg>
          {post.address}
        </div>

        {post.donor && (
          <div className="border-t border-gray-100 pt-3 flex items-center gap-3">
            <div className="w-9 h-9 bg-amber-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
              {post.donor.name[0]}
            </div>
            <div>
              <p className="text-sm font-medium">{post.donor.name}</p>
              <p className="text-xs text-gray-400">Food donor</p>
            </div>
          </div>
        )}

        {canRequest && !requested && (
          <div className="border-t border-gray-100 pt-4 space-y-3">
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Add a note to the donor (optional)..."
              rows={2}
              className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-amber-400 resize-none"
            />
            <button
              onClick={handleRequest}
              disabled={requesting}
              className="w-full bg-amber-500 hover:bg-amber-600 disabled:opacity-60 text-white font-semibold py-3 rounded-xl transition-colors"
            >
              {requesting ? "Sending request..." : "Request this food"}
            </button>
          </div>
        )}

        {requested && (
          <div className="border-t border-gray-100 pt-4 bg-green-50 rounded-xl p-4 text-center">
            <p className="text-green-700 font-medium">Request sent!</p>
            <p className="text-sm text-green-600">The donor has been notified. A delivery partner will be assigned soon.</p>
          </div>
        )}

        {post.status !== "available" && !canRequest && user?.role === "recipient" && (
          <div className="border-t border-gray-100 pt-4 bg-gray-50 rounded-xl p-4 text-center text-sm text-gray-500">
            This food is no longer available
          </div>
        )}
      </div>

      <ToastContainer />
    </div>
  );
}
