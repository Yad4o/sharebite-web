import { useEffect, useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getUnreadCount } from "../api";

export default function Layout() {
  const { user, logout } = useAuth();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [unread, setUnread] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    getUnreadCount().then(setUnread).catch(() => {});
    const t = setInterval(() => getUnreadCount().then(setUnread).catch(() => {}), 30000);
    return () => clearInterval(t);
  }, []);

  function handleLogout() {
    logout();
    navigate("/");
  }

  const roleLinks: Record<string, { to: string; label: string }[]> = {
    donor: [
      { to: "/feed", label: "Browse" },
      { to: "/donor", label: "My Posts" },
      { to: "/donor/upload", label: "+ Share Food" },
    ],
    recipient: [
      { to: "/feed", label: "Browse Food" },
      { to: "/recipient", label: "My Requests" },
    ],
    delivery: [
      { to: "/feed", label: "Browse" },
      { to: "/delivery", label: "Deliveries" },
    ],
    admin: [
      { to: "/feed", label: "Feed" },
    ],
  };

  const links = user ? (roleLinks[user.role] ?? [{ to: "/feed", label: "Feed" }]) : [];

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link to="/feed" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-amber-500 rounded-xl flex items-center justify-center text-white font-bold text-sm">
              SB
            </div>
            <span className="font-bold text-gray-900 hidden sm:block">ShareBite</span>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {links.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  pathname === l.to
                    ? "bg-amber-50 text-amber-700"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                }`}
              >
                {l.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <Link
              to="/notifications"
              className="relative p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              {unread > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  {unread > 9 ? "9+" : unread}
                </span>
              )}
            </Link>

            <div className="relative">
              <button
                onClick={() => setMenuOpen((v) => !v)}
                className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="w-7 h-7 bg-amber-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                  {user?.name[0].toUpperCase()}
                </div>
                <span className="hidden sm:block text-sm font-medium text-gray-700">{user?.name}</span>
              </button>

              {menuOpen && (
                <div className="absolute right-0 mt-1 w-44 bg-white border border-gray-200 rounded-xl shadow-lg py-1 z-50">
                  <div className="px-3 py-2 border-b border-gray-100">
                    <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
                    <p className="text-sm font-medium truncate">{user?.email}</p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                  >
                    Sign out
                  </button>
                </div>
              )}
            </div>

            <button
              onClick={() => setMenuOpen(false) || setMenuOpen((v) => !v)}
              className="md:hidden p-2 text-gray-500 hover:bg-gray-100 rounded-lg"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {menuOpen && (
          <div className="md:hidden border-t border-gray-100 bg-white px-4 py-2 space-y-1">
            {links.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                onClick={() => setMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100"
              >
                {l.label}
              </Link>
            ))}
          </div>
        )}
      </header>

      <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-6">
        <Outlet />
      </main>

      <footer className="border-t border-gray-200 bg-white mt-8">
        <div className="max-w-6xl mx-auto px-4 py-4 text-center text-xs text-gray-400">
          ShareBite — Reduce food waste, spread kindness
        </div>
      </footer>
    </div>
  );
}
