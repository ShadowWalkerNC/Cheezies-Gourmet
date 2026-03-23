import { useState, useEffect } from "react";
import { X, Download } from "lucide-react";

export default function InstallBanner() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [dismissed, setDismissed] = useState(
    () => !!localStorage.getItem("cheezies_install_dismissed")
  );

  useEffect(() => {
    if (window.matchMedia("(display-mode: standalone)").matches || window.navigator.standalone) {
      return;
    }
    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
    };
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    await deferredPrompt.userChoice;
    setDeferredPrompt(null);
    setDismissed(true);
    localStorage.setItem("cheezies_install_dismissed", "1");
  };

  const handleDismiss = () => {
    localStorage.setItem("cheezies_install_dismissed", "1");
    setDismissed(true);
  };

  if (!isInstallable || dismissed) return null;

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-[60] md:bottom-6 md:left-1/2 md:-translate-x-1/2 md:w-auto md:max-w-sm md:rounded-2xl"
      style={{
        background: "rgba(255,248,220,0.98)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        borderTop: "1px solid rgba(180,120,0,0.2)",
        paddingBottom: "calc(var(--tab-bar-h) + 8px)",
        boxShadow: "0 -4px 32px rgba(180,120,0,0.15)",
      }}
    >
      <div className="flex items-center gap-3 px-5 pt-4 pb-2">
        <div
          className="w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0 font-black text-sm"
          style={{ background: "rgba(201,148,10,0.12)", color: "#c9940a" }}
        >
          CG
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-black text-sm leading-tight" style={{ color: "#3d2200" }}>
            Add Cheezies to your home screen
          </p>
          <p className="text-xs mt-0.5" style={{ color: "rgba(80,45,0,0.55)" }}>
            Browse the menu offline — always ready!
          </p>
        </div>
        <button onClick={handleDismiss} className="p-1.5 rounded-full flex-shrink-0" style={{ WebkitTapHighlightColor: "transparent" }}>
          <X size={16} style={{ color: "rgba(80,45,0,0.4)" }} />
        </button>
      </div>
      <div className="px-5 pb-3">
        <button
          onClick={handleInstall}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-full font-bold text-sm select-none"
          style={{ background: "#c9940a", color: "#fff8e8", WebkitTapHighlightColor: "transparent", boxShadow: "0 4px 16px rgba(180,120,0,0.3)" }}
        >
          <Download size={15} />
          Install App
        </button>
      </div>
    </div>
  );
}