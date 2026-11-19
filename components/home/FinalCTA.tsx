import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";

export function FinalCTA() {
  return (
    <section className="py-20 lg:py-24">
      <div className="wrap">
        <Reveal>
          <div className="relative overflow-hidden rounded-2xl bg-navy-950 px-6 py-16 text-center sm:px-12 lg:py-20">
            <div className="pointer-events-none absolute -top-24 left-1/2 h-64 w-[40rem] -translate-x-1/2 rounded-full bg-brand-600/20 blur-3xl" />
            <div className="relative">
              <h2 className="mx-auto max-w-2xl text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Your future starts with what you learn today.
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-base text-navy-300">
                Join learners around the world. Free to start, always at your own pace.
              </p>
              <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <Link href="/signup" className="btn-primary btn-lg lift">
                  Start Learning <ArrowRight className="size-4" />
                </Link>
                <Link href="/library" className="btn-lg lift border border-white/20 text-white hover:bg-white/10">
                  Explore the library
                </Link>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
