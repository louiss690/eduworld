import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How EduWorld collects, uses and protects your data.",
};

export default function PrivacyPage() {
  return (
    <div className="wrap py-14 lg:py-20">
      <article className="mx-auto max-w-3xl">
        <p className="eyebrow">Legal</p>
        <h1 className="mt-3 text-3xl font-bold tracking-tight text-navy-950">Privacy Policy</h1>
        <p className="mt-2 text-sm text-muted">Last updated: November 2026</p>

        <div className="prose-edu mt-8">
          <p>
            EduWorld is designed for learners worldwide, including minors. We
            take privacy seriously and collect as little personal information as
            possible.
          </p>
          <h3>What we collect</h3>
          <ul>
            <li>Account basics: name, email, country, preferred language and educational level.</li>
            <li>Learning activity: enrollments, progress, quiz results and AI-tutor conversations.</li>
            <li>Technical data: standard server logs (IP, user agent, pages visited).</li>
          </ul>
          <h3>How we use it</h3>
          <ul>
            <li>To provide and personalise the learning experience.</li>
            <li>To improve content and identify gaps in coverage.</li>
            <li>To protect the platform and comply with legal obligations.</li>
          </ul>
          <h3>What we don't do</h3>
          <ul>
            <li>We don't sell personal data or use it for third-party advertising.</li>
            <li>We don't require photo ID, payment details or addresses for core learning.</li>
            <li>We don't share student records publicly, dashboards are private.</li>
          </ul>
          <h3>Minors and parental controls</h3>
          <p>
            Where legally required, accounts for younger learners are subject to
            parental/guardian consent. Forums or public profiles are not part of
            the core product, so students cannot accidentally broadcast their
            information. Parental or teacher controls can be requested through
            support.
          </p>
          <h3>Data storage</h3>
          <p>
            Data is stored with trusted infrastructure providers (such as
            Supabase/PostgreSQL). We retain account data while the account is
            active and delete it on request. You may contact us at any time to
            export or delete your data.
          </p>
          <h3>Contact</h3>
          <p>Privacy questions: privacy@edu.world</p>
        </div>
      </article>
    </div>
  );
}
