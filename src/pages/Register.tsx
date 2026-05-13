import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { register } from "../api";
import { useAuth } from "../context/AuthContext";
import type { UserRole } from "../types";

const ROLES: { value: UserRole; label: string; emoji: string; desc: string }[] = [
  { value: "donor", label: "Food Donor", emoji: "🍲", desc: "I have food to share" },
  { value: "recipient", label: "Recipient", emoji: "🙏", desc: "I need food" },
  { value: "delivery", label: "Delivery Partner", emoji: "🚴", desc: "I'll deliver food" },
];

export default function Register() {
  const [params] = useSearchParams();
  const { login: authLogin } = useAuth();
  const navigate = useNavigate();
  const [role, setRole] = useState<UserRole>((params.get("role") as UserRole) || "recipient");
  const [form, setForm] = useState({ name: "", email: "", password: "", address: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const data = await register({ ...form, role });
      authLogin(data.access_token, data.user);
      navigate("/feed");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-sm">
        <div className="text-center mb-6">
          <div className="w-12 h-12 bg-amber-500 rounded-2xl flex items-center justify-center text-white font-bold text-xl mx-auto mb-4">SB</div>
          <h1 className="text-2xl font-bold text-gray-900">Join ShareBite</h1>
          <p className="text-gray-500 text-sm mt-1">Create your account</p>
        </div>

        {/* Role selector */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          {ROLES.map((r) => (
            <button
              key={r.value}
              type="button"
              onClick={() => setRole(r.value)}
              className={`p-3 rounded-xl border text-center transition-colors ${
                role === r.value
                  ? "border-amber-400 bg-amber-50 text-amber-700"
                  : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
              }`}
            >
              <div className="text-xl mb-1">{r.emoji}</div>
              <div className="text-xs font-medium">{r.label}</div>
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-200 p-6 space-y-4 shadow-sm">
          {[
            { key: "name", label: "Full name", type: "text", placeholder: "Your name" },
            { key: "email", label: "Email", type: "email", placeholder: "you@example.com" },
            { key: "password", label: "Password", type: "password", placeholder: "Min 6 characters" },
            { key: "address", label: "Address", type: "text", placeholder: "Your address (optional)" },
          ].map((f) => (
            <div key={f.key}>
              <label className="block text-sm font-medium text-gray-700 mb-1">{f.label}</label>
              <input
                type={f.type}
                required={f.key !== "address"}
                value={form[f.key as keyof typeof form]}
                onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
                className="w-full border border-gray-300 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-amber-400 transition-colors"
                placeholder={f.placeholder}
              />
            </div>
          ))}

          {error && <p className="text-red-600 text-sm bg-red-50 px-3 py-2 rounded-lg">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-amber-500 hover:bg-amber-600 disabled:opacity-60 text-white font-semibold py-2.5 rounded-xl transition-colors"
          >
            {loading ? "Creating account..." : "Create account"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-4">
          Already have an account?{" "}
          <Link to="/login" className="text-amber-600 font-medium hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
