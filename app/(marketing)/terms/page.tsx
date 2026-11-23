import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description: "The terms governing use of the EduWorld platform.",
};

export default function TermsPage() {
  return (
    <div className="wrap py-14 lg:py-20">
      <article className="mx-auto max-w-3xl">
        <p className="eyebrow">Legal</p>
        <h1 className="mt-3 text-3xl font-bold tracking-tight text-navy-950">Terms & Conditions</h1>
        <p className="mt-2 text-sm text-muted">Last updated: November 2026</p>

        <div className="prose-edu mt-8">
          <h3>1. Using EduWorld</h3>
          <p>
            EduWorld provides educational content, tools and AI-assisted support.
            By creating an account you agree to use the platform for learning
            and teaching, and not to misuse it, upload harmful content, or
            attempt to impair the service.
          </p>
          <h3>2. Accounts</h3>
          <p>
            You are responsible for keeping your credentials confidential.
            Accounts may not be shared, impersonated, or used to deceive other
            users. Duplicate or automated registrations may be removed.
          </p>
          <h3>3. Content</h3>
          <p>
            Course content is provided for personal, non-commercial learning.
            Educators retain ownership of the courses they create; EduWorld
            provides the platform. Starter "demo" content is clearly labelled.
          </p>
          <h3>4. AI tutor</h3>
          <p>
            The AI tutor is a learning aid, not a substitute for professional
            advice. It may make mistakes. Do not rely on it for medical, legal,
            financial or safety-critical decisions. The tutor refuses harmful
            requests and never supports cheating on graded exams.
          </p>
          <h3>5. Acceptable use</h3>
          <ul>
            <li>No harassment, hate speech or discrimination.</li>
            <li>No attempts to access other users' data.</li>
            <li>No reselling of content without permission.</li>
            <li>No circumvention of safety or anti-abuse systems.</li>
          </ul>
          <h3>6. Termination</h3>
          <p>
            We may suspend accounts that violate these terms. You may delete
            your account at any time from Settings or by contacting support.
          </p>
          <h3>7. Changes</h3>
          <p>
            We may update these terms as the platform evolves; significant
            changes will be highlighted in-app or by email.
          </p>
        </div>
      </article>
    </div>
  );
}
