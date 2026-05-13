import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import "./index.css";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Layout from "./components/Layout";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Feed from "./pages/Feed";
import PostDetail from "./pages/PostDetail";
import DonorDashboard from "./pages/DonorDashboard";
import UploadFood from "./pages/UploadFood";
import RecipientDashboard from "./pages/RecipientDashboard";
import DeliveryDashboard from "./pages/DeliveryDashboard";
import NotificationsPage from "./pages/NotificationsPage";

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="min-h-screen flex items-center justify-center text-gray-400">Loading...</div>;
  return user ? <>{children}</> : <Navigate to="/login" replace />;
}

function PublicOnly({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  if (loading) return null;
  return user ? <Navigate to="/feed" replace /> : <>{children}</>;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<PublicOnly><Login /></PublicOnly>} />
          <Route path="/register" element={<PublicOnly><Register /></PublicOnly>} />
          <Route element={<PrivateRoute><Layout /></PrivateRoute>}>
            <Route path="/feed" element={<Feed />} />
            <Route path="/food/:id" element={<PostDetail />} />
            <Route path="/donor" element={<DonorDashboard />} />
            <Route path="/donor/upload" element={<UploadFood />} />
            <Route path="/recipient" element={<RecipientDashboard />} />
            <Route path="/delivery" element={<DeliveryDashboard />} />
            <Route path="/notifications" element={<NotificationsPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode><App /></React.StrictMode>
);
