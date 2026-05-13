import { Link } from "react-router-dom";

const steps = [
  { emoji: "📸", title: "Donors share food", desc: "Upload a photo of your leftover food, add details and location." },
  { emoji: "🙋", title: "Recipients request", desc: "Browse nearby food and request what you need with one tap." },
  { emoji: "🚴", title: "Delivery partners deliver", desc: "Delivery volunteers pick up food and bring it to the recipient." },
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-white">
      {/* Nav */}
      <nav className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-amber-500 rounded-xl flex items-center justify-center text-white font-bold text-sm">SB</div>
          <span className="font-bold text-gray-900">ShareBite</span>
        </div>
        <div className="flex gap-3">
          <Link to="/login" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors px-3 py-2">
            Sign in
          </Link>
          <Link to="/register" className="text-sm font-medium bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-xl transition-colors">
            Get started
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-4xl mx-auto px-4 pt-16 pb-20 text-center">
        <div className="inline-flex items-center gap-2 bg-amber-50 border border-amber-200 text-amber-700 text-sm rounded-full px-4 py-1.5 mb-6">
          Fighting food waste, one meal at a time
        </div>
        <h1 className="text-5xl sm:text-6xl font-bold text-gray-900 leading-tight mb-6">
          Share leftover food<br />
          <span className="text-amber-500">feed someone today</span>
        </h1>
        <p className="text-xl text-gray-500 max-w-2xl mx-auto mb-10">
          ShareBite connects people who have surplus food with those who need it,
          delivered by community volunteers.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            to="/register?role=donor"
            className="bg-amber-500 hover:bg-amber-600 text-white font-semibold px-8 py-3.5 rounded-xl transition-colors text-lg"
          >
            Share food
          </Link>
          <Link
            to="/register?role=recipient"
            className="bg-gray-900 hover:bg-gray-800 text-white font-semibold px-8 py-3.5 rounded-xl transition-colors text-lg"
          >
            Find food
          </Link>
        </div>
      </section>

      {/* How it works */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">How it works</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {steps.map((s, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 text-center border border-gray-100 shadow-sm">
                <div className="text-4xl mb-4">{s.emoji}</div>
                <h3 className="font-semibold text-gray-900 mb-2">{s.title}</h3>
                <p className="text-sm text-gray-500">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Roles CTA */}
      <section className="max-w-4xl mx-auto px-4 py-16">
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { role: "donor", emoji: "🍲", title: "I have food to share", color: "bg-amber-500", hover: "hover:bg-amber-600" },
            { role: "recipient", emoji: "🙏", title: "I need food", color: "bg-gray-900", hover: "hover:bg-gray-800" },
            { role: "delivery", emoji: "🚴", title: "I want to deliver", color: "bg-green-600", hover: "hover:bg-green-700" },
          ].map((r) => (
            <Link
              key={r.role}
              to={`/register?role=${r.role}`}
              className={`${r.color} ${r.hover} text-white rounded-2xl p-6 flex flex-col items-center gap-3 transition-colors`}
            >
              <span className="text-4xl">{r.emoji}</span>
              <span className="font-semibold text-lg text-center">{r.title}</span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
