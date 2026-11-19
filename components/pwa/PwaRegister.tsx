"use client";

import { useEffect, useState } from "react";
import { Wifi, WifiOff } from "lucide-react";

/**
 * Registers the service worker and renders a subtle offline indicator.
 * The app remains fully usable offline once pages have been visited.
 */
export function PwaRegister() {
  const [offline, setOffline] = useState(false);
  const [installed, setInstalled] = useState(false);

  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").then(() => setInstalled(true)).catch(() => {});
    }

    const onOnline = () => setOffline(false);
    const onOffline = () => setOffline(true);
    setOffline(!navigator.onLine);
    window.addEventListener("online", onOnline);
    window.addEventListener("offline", onOffline);
    return () => {
      window.removeEventListener("online", onOnline);
      window.removeEventListener("offline", onOffline);
    };
  }, []);

  if (!offline) return null;

  return (
    <div className="fixed bottom-4 left-1/2 z-50 flex -translate-x-1/2 items-center gap-2.5 rounded-full border border-navy-700 bg-navy-950 px-4 py-2.5 text-sm font-medium text-white shadow-xl">
      <WifiOff className="size-4 text-navy-300" aria-hidden />
      You're offline — previously visited pages still work.
      {installed && <span className="text-navy-300">·</span>}
      {installed && (
        <span className="inline-flex items-center gap-1 text-navy-300">
          <Wifi className="size-3.5" /> Resumes on reconnect
        </span>
      )}
    </div>
  );
}
