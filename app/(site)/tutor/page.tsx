import type { Metadata } from "next";
import { TutorChat } from "@/components/tutor/TutorChat";
import { getDataStore } from "@/services/data";
import { requireUser } from "@/services/auth/session";
import { getTutorStatus } from "@/services/ai";

export const metadata: Metadata = {
  title: "AI Tutor",
  description: "Your personal AI learning companion on EduWorld.",
};

export const dynamic = "force-dynamic";

export default async function TutorPage() {
  const user = await requireUser();
  const store = getDataStore();
  const [conversations, profile] = await Promise.all([
    store.listConversations(user.id),
    store.getStudentProfile(user.id),
  ]);

  return (
    <div className="bg-paper">
      <div className="wrap py-8">
        <div className="mb-6 flex flex-col gap-1">
          <p className="eyebrow">AI Tutor</p>
          <h1 className="text-2xl font-bold tracking-tight text-navy-950">Your personal learning companion</h1>
          <p className="mt-1 text-sm text-muted">
            Explain a topic, ask a question or practise — the tutor coaches you step by step.
          </p>
        </div>

        <TutorChat
          initialConversations={conversations.map((c) => ({
            id: c.id,
            title: c.title,
            updatedAt: c.updatedAt,
          }))}
          status={getTutorStatus()}
        />
      </div>
    </div>
  );
}
