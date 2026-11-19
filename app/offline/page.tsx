import type { Metadata } from "next";
import Link from "next/link";
import { WifiOff } from "lucide-react";

export const metadata: Metadata = {
  title: "Offline",
};

export default function OfflinePage() {
  return (
    <div className="grid min-h-[70vh] place-items-center bg-paper px-4">
      <div className="max-w-md text-center">
        <span className="mx-auto grid size-14 place-items-center rounded-2xl bg-navy-50 text-navy-800">
          <WifiOff className="size-7" />
        </span>
        <h1 className="mt-5 text-2xl font-bold text-navy-950">You're offline</h1>
        <p className="mt-3 text-sm leading-relaxed text-muted">
          Pages you've visited are still available offline. Reconnect to browse
          new content and sync your progress.
        </p>
        <Link href="/" className="btn-primary mt-7">Try the homepage</Link>
      </div>
    </div>
  );
}
