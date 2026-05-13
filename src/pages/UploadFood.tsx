import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDropzone } from "react-dropzone";
import { createPost } from "../api";
import { toast, ToastContainer } from "../components/Toast";

const CATEGORIES = ["cooked", "raw", "bakery", "fruits", "vegetables", "dairy", "other"];

export default function UploadFood() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: "", description: "", category: "cooked", quantity: "",
    serves: "", address: "", is_vegetarian: false, is_vegan: false, allergens: "",
  });
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onDrop = useCallback((files: File[]) => {
    if (files[0]) {
      setImage(files[0]);
      setPreview(URL.createObjectURL(files[0]));
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop, accept: { "image/jpeg": [], "image/png": [], "image/webp": [] }, maxFiles: 1,
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => {
        if (v !== "") fd.append(k, String(v));
      });
      if (image) fd.append("image", image);
      await createPost(fd);
      toast("Food posted successfully!", "success");
      navigate("/donor");
    } catch (err) {
      toast(err instanceof Error ? err.message : "Upload failed", "error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Share leftover food</h1>
        <p className="text-gray-500 text-sm mt-1">Add a photo and details about your food</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Image upload */}
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-2xl cursor-pointer transition-colors ${isDragActive ? "border-amber-400 bg-amber-50" : "border-gray-200 hover:border-gray-300"}`}
        >
          <input {...getInputProps()} />
          {preview ? (
            <img src={preview} alt="preview" className="w-full h-56 object-cover rounded-2xl" />
          ) : (
            <div className="h-56 flex flex-col items-center justify-center text-gray-400">
              <span className="text-4xl mb-2">📷</span>
              <p className="text-sm">Drop a photo or click to upload</p>
              <p className="text-xs text-gray-300 mt-1">JPEG · PNG · WebP</p>
            </div>
          )}
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl p-5 space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
              <input
                required
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-amber-400"
                placeholder="e.g. Leftover biryani, 3 portions"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-amber-400 bg-white capitalize"
              >
                {CATEGORIES.map((c) => <option key={c} value={c} className="capitalize">{c}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Quantity *</label>
              <input
                required
                value={form.quantity}
                onChange={(e) => setForm({ ...form, quantity: e.target.value })}
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-amber-400"
                placeholder="e.g. 3 plates"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Serves (people)</label>
              <input
                type="number"
                min={1}
                value={form.serves}
                onChange={(e) => setForm({ ...form, serves: e.target.value })}
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-amber-400"
                placeholder="e.g. 3"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Pickup address *</label>
              <input
                required
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-amber-400"
                placeholder="Your address"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                rows={2}
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-amber-400 resize-none"
                placeholder="What's in the food, ingredients, freshness..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Allergens</label>
              <input
                value={form.allergens}
                onChange={(e) => setForm({ ...form, allergens: e.target.value })}
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-amber-400"
                placeholder="e.g. nuts, dairy"
              />
            </div>

            <div className="flex items-end gap-4">
              <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                <input type="checkbox" checked={form.is_vegetarian} onChange={(e) => setForm({ ...form, is_vegetarian: e.target.checked })} className="accent-amber-500" />
                Vegetarian
              </label>
              <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                <input type="checkbox" checked={form.is_vegan} onChange={(e) => setForm({ ...form, is_vegan: e.target.checked })} className="accent-amber-500" />
                Vegan
              </label>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-amber-500 hover:bg-amber-600 disabled:opacity-60 text-white font-semibold py-3 rounded-xl transition-colors"
          >
            {loading ? "Posting..." : "Post food"}
          </button>
        </div>
      </form>

      <ToastContainer />
    </div>
  );
}
