import type { Metadata } from "next";
import { Mail, MessageCircle, ShieldCheck } from "lucide-react";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with the EduWorld team.",
};

export default function ContactPage() {
  return (
    <div className="wrap py-14 lg:py-20">
      <div className="max-w-2xl">
        <p className="eyebrow">Contact</p>
        <h1 className="mt-3 text-3xl font-bold tracking-tight text-navy-950 sm:text-4xl">
          We'd love to hear from you
        </h1>
        <p className="mt-4 text-base text-muted">
          Questions about courses, partnerships, teaching on EduWorld, or
          bringing EduWorld to your country? Reach out.
        </p>
      </div>

      <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="card p-6">
          <span className="grid size-10 place-items-center rounded-lg bg-brand-50 text-brand-700">
            <Mail className="size-5" />
          </span>
          <h2 className="mt-4 font-semibold text-navy-950">Email</h2>
          <p className="mt-1.5 text-sm text-muted">hello@edu.world</p>
          <p className="mt-1 text-[13px] text-muted">We reply within 2 business days.</p>
        </div>
        <div className="card p-6">
          <span className="grid size-10 place-items-center rounded-lg bg-brand-50 text-brand-700">
            <MessageCircle className="size-5" />
          </span>
          <h2 className="mt-4 font-semibold text-navy-950">Help Centre</h2>
          <p className="mt-1.5 text-sm text-muted">Account, billing and technical help.</p>
          <a href="/help" className="mt-2 inline-block text-sm font-semibold text-brand-700 hover:text-brand-800">
            Visit the Help Centre →
          </a>
        </div>
        <div className="card p-6">
          <span className="grid size-10 place-items-center rounded-lg bg-brand-50 text-brand-700">
            <ShieldCheck className="size-5" />
          </span>
          <h2 className="mt-4 font-semibold text-navy-950">Safeguarding</h2>
          <p className="mt-1.5 text-sm text-muted">Safeguarding and data-protection questions.</p>
          <p className="mt-2 text-sm font-semibold text-navy-900">safety@edu.world</p>
        </div>
      </div>
    </div>
  );
}
