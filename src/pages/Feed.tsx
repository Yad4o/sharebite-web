import { useEffect, useState } from "react";
import { listPosts } from "../api";
import FoodCard from "../components/FoodCard";
import { ToastContainer } from "../components/Toast";
import type { FoodCategory, FoodPost } from "../types";

const CATEGORIES: FoodCategory[] = ["cooked", "raw", "bakery", "fruits", "vegetables", "dairy", "other"];

export default function Feed() {
  const [posts, setPosts] = useState<FoodPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState<FoodCategory | "">("");
  const [vegOnly, setVegOnly] = useState(false);
  const [search, setSearch] = useState("");

  async function load() {
    setLoading(true);
    try {
      const data = await listPosts({
        category: category || undefined,
        vegetarian: vegOnly || undefined,
        limit: 50,
      });
      setPosts(data);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, [category, vegOnly]);

  const displayed = search
    ? posts.filter((p) => p.title.toLowerCase().includes(search.toLowerCase()) || p.address.toLowerCase().includes(search.toLowerCase()))
    : posts;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          placeholder="Search food or location..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-amber-400 bg-white"
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value as FoodCategory | "")}
          className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm bg-white focus:outline-none focus:border-amber-400"
        >
          <option value="">All categories</option>
          {CATEGORIES.map((c) => <option key={c} value={c} className="capitalize">{c}</option>)}
        </select>
        <label className="flex items-center gap-2 text-sm text-gray-600 bg-white border border-gray-200 rounded-xl px-3 py-2.5 cursor-pointer hover:border-gray-300 transition-colors">
          <input type="checkbox" checked={vegOnly} onChange={(e) => setVegOnly(e.target.checked)} className="accent-amber-500" />
          Veg only
        </label>
        <button onClick={load} className="bg-amber-500 hover:bg-amber-600 text-white font-medium px-4 py-2.5 rounded-xl transition-colors text-sm">
          Refresh
        </button>
      </div>

      {loading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-white rounded-2xl border border-gray-200 overflow-hidden animate-pulse">
              <div className="h-44 bg-gray-100" />
              <div className="p-4 space-y-2">
                <div className="h-4 bg-gray-100 rounded w-3/4" />
                <div className="h-3 bg-gray-100 rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      ) : displayed.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-5xl mb-4">🍱</div>
          <h3 className="font-semibold text-gray-700 mb-1">No food available right now</h3>
          <p className="text-sm text-gray-400">Check back soon or adjust your filters</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {displayed.map((post) => <FoodCard key={post.id} post={post} />)}
        </div>
      )}

      <ToastContainer />
    </div>
  );
}
