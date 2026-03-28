import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { base44 } from "@/api/base44Client";
import { useToast } from "@/components/ui/use-toast";
import { Trash2, LogOut, User, ChevronRight, AlertTriangle } from "lucide-react";
import NavBar from "../components/NavBar";
import PageTransition from "../components/PageTransition";

export default function ProfilePage() {
  const { toast } = useToast();
  const [user, setUser] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    base44.auth.me().then(setUser).catch(() => {});
  }, []);

  const handleLogout = () => {
    base44.auth.logout("/");
  };

  const handleDeleteAccount = async () => {
    setDeleting(true);
    // Send notification email then logout — actual deletion handled server-side by platform
    await base44.functions.invoke("sendNotification", { type: "account_deletion", data: {} });
    toast({ title: "Request submitted", description: "Your account deletion has been requested. You will be logged out." });
    setTimeout(() => base44.auth.logout("/"), 1800);
  };

  return (
    <div className="min-h-screen font-sans" style={{ background: "var(--color-bg)" }}>
      <NavBar />
      <PageTransition>
        <div className="max-w-lg mx-auto px-5 pt-28 pb-8">
          {/* Avatar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center mb-10"
          >
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center mb-4 text-3xl"
              style={{ background: "rgba(245,197,24,0.12)", border: "2px solid rgba(245,197,24,0.2)" }}
            >
              {user?.full_name?.[0]?.toUpperCase() || "🧀"}
            </div>
            <h1 className="text-xl font-black" style={{ color: "#fff8e8" }}>
              {user?.full_name || "Guest"}
            </h1>
            <p className="text-sm mt-1" style={{ color: "rgba(255,235,180,0.4)" }}>
              {user?.email || ""}
            </p>
          </motion.div>

          {/* Settings rows */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08 }}
            className="rounded-2xl overflow-hidden mb-4"
            style={{ border: "1px solid rgba(245,197,24,0.1)" }}
          >
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-between px-5 py-4 select-none active:opacity-60 transition-opacity"
              style={{ background: "rgba(255,200,60,0.04)", borderBottom: "1px solid rgba(245,197,24,0.08)", WebkitTapHighlightColor: "transparent" }}
            >
              <div className="flex items-center gap-3">
                <LogOut size={18} style={{ color: "#f5c518" }} />
                <span className="font-semibold text-sm" style={{ color: "#fff8e8" }}>Sign Out</span>
              </div>
              <ChevronRight size={16} style={{ color: "rgba(255,235,180,0.3)" }} />
            </button>
          </motion.div>

          {/* Danger zone */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.14 }}
            className="rounded-2xl overflow-hidden"
            style={{ border: "1px solid rgba(239,68,68,0.2)" }}
          >
            <div className="px-5 py-3" style={{ background: "rgba(239,68,68,0.04)", borderBottom: "1px solid rgba(239,68,68,0.1)" }}>
              <p className="text-xs font-bold tracking-widest uppercase" style={{ color: "rgba(239,68,68,0.6)" }}>Danger Zone</p>
            </div>
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="w-full flex items-center justify-between px-5 py-4 select-none active:opacity-60 transition-opacity"
              style={{ background: "rgba(239,68,68,0.03)", WebkitTapHighlightColor: "transparent" }}
            >
              <div className="flex items-center gap-3">
                <Trash2 size={18} style={{ color: "#ef4444" }} />
                <span className="font-semibold text-sm" style={{ color: "#ef4444" }}>Delete Account</span>
              </div>
              <ChevronRight size={16} style={{ color: "rgba(239,68,68,0.3)" }} />
            </button>
          </motion.div>

          <p className="text-center text-xs mt-6" style={{ color: "rgba(255,235,180,0.2)" }}>
            Cheezies Gourmet · Akron, Ohio
          </p>
        </div>
      </PageTransition>

      {/* Delete confirmation sheet */}
      {showDeleteConfirm && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center"
          style={{ background: "rgba(0,0,0,0.65)", backdropFilter: "blur(4px)" }}
          onClick={() => setShowDeleteConfirm(false)}
        >
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 320 }}
            onClick={e => e.stopPropagation()}
            className="w-full max-w-lg rounded-t-3xl p-6"
            style={{
              background: "#1a0e05",
              borderTop: "1px solid rgba(239,68,68,0.25)",
              paddingBottom: "calc(1.5rem + var(--safe-bottom))",
            }}
          >
            <div className="flex justify-center mb-4">
              <div style={{ width: 36, height: 4, borderRadius: 2, background: "rgba(255,255,255,0.1)" }} />
            </div>
            <div className="flex flex-col items-center text-center gap-3 mb-6">
              <div className="w-14 h-14 rounded-full flex items-center justify-center" style={{ background: "rgba(239,68,68,0.1)" }}>
                <AlertTriangle size={26} style={{ color: "#ef4444" }} />
              </div>
              <h3 className="text-xl font-black" style={{ color: "#fff8e8" }}>Delete Account?</h3>
              <p className="text-sm leading-relaxed" style={{ color: "rgba(255,235,180,0.5)" }}>
                This will submit a deletion request. You'll be signed out immediately. This action cannot be undone.
              </p>
            </div>
            <div className="flex flex-col gap-3">
              <button
                onClick={handleDeleteAccount}
                disabled={deleting}
                className="w-full py-4 rounded-2xl font-bold text-base select-none active:scale-95 transition-transform disabled:opacity-50"
                style={{ background: "#ef4444", color: "#fff", border: "none", cursor: "pointer", WebkitTapHighlightColor: "transparent" }}
              >
                {deleting ? "Submitting…" : "Yes, Delete My Account"}
              </button>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="w-full py-4 rounded-2xl font-semibold text-base select-none active:scale-95 transition-transform"
                style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,235,180,0.7)", cursor: "pointer", WebkitTapHighlightColor: "transparent" }}
              >
                Cancel
              </button>
            </div>
          </motion.div>
        </div>
      )}

      <div className="md:hidden" style={{ height: "var(--tab-bar-h)" }} />
    </div>
  );
}