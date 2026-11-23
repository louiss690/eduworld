import type { Metadata } from "next";
import { SettingsForm } from "@/components/settings/SettingsForm";
import { getDataStore } from "@/services/data";
import { requireUser } from "@/services/auth/session";

export const metadata: Metadata = {
  title: "Account settings",
  description: "Update your EduWorld profile and preferences.",
};

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const user = await requireUser();
  const store = getDataStore();
  const [profile, countries, languages, levels, subjects] = await Promise.all([
    store.getStudentProfile(user.id),
    store.getCountries(),
    store.getLanguages(),
    store.getLevels(),
    store.getSubjects(),
  ]);

  return (
    <div className="bg-paper">
      <div className="wrap py-10">
        <div className="max-w-2xl">
          <p className="eyebrow">Account</p>
          <h1 className="mt-3 text-3xl font-bold tracking-tight text-navy-950">Settings</h1>
          <p className="mt-3 text-base text-muted">
            Keep your profile current so we can tailor your learning experience.
          </p>

          <div className="card mt-8 p-6 sm:p-8">
            <SettingsForm
              initial={{
                name: user.name,
                email: user.email,
                countryCode: profile?.countryCode ?? "",
                languageCode: profile?.languageCode ?? "en",
                educationLevelId: profile?.educationLevelId ?? "",
                bio: profile?.bio ?? "",
                subjectIds: profile?.subjectIds ?? [],
              }}
              countries={countries}
              languages={languages}
              levels={levels}
              subjects={subjects}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
