import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { OnboardingFlow } from "@/components/onboarding/OnboardingFlow";
import { getDataStore } from "@/services/data";
import { requireUser } from "@/services/auth/session";

export const metadata: Metadata = {
  title: "Welcome",
  description: "Set up your personalised EduWorld learning space.",
};

export const dynamic = "force-dynamic";

export default async function OnboardingPage() {
  const user = await requireUser();
  const store = getDataStore();

  const [profile, subjects, countries, languages, levels] = await Promise.all([
    store.getStudentProfile(user.id),
    store.getSubjects(),
    store.getCountries(),
    store.getLanguages(),
    store.getLevels(),
  ]);

  // Returning students who already set subject interests skip onboarding.
  if (profile?.subjectIds && profile.subjectIds.length > 0) {
    redirect("/dashboard");
  }

  return (
    <div className="bg-surface2">
      <div className="wrap py-12 lg:py-16">
        <OnboardingFlow
          user={{ name: user.name }}
          subjects={subjects}
          countries={countries}
          languages={languages}
          levels={levels}
          initial={{
            countryCode: profile?.countryCode ?? "",
            languageCode: profile?.languageCode ?? "en",
            educationLevelId: profile?.educationLevelId ?? "",
            subjectIds: [],
          }}
        />
      </div>
    </div>
  );
}
