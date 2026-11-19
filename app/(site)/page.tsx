import type { Metadata } from "next";
import { Hero } from "@/components/home/Hero";
import { SubjectsSection } from "@/components/home/SubjectsSection";
import { FeaturedCourses } from "@/components/home/FeaturedCourses";
import { HowItWorks } from "@/components/home/HowItWorks";
import { AITutorSection } from "@/components/home/AITutorSection";
import { AccessibilitySection } from "@/components/home/AccessibilitySection";
import { GlobalLearners } from "@/components/home/GlobalLearners";
import { Testimonials } from "@/components/home/Testimonials";
import { FinalCTA } from "@/components/home/FinalCTA";
import { getDataStore } from "@/services/data";
import { toCourseCards } from "@/services/catalog";

export const metadata: Metadata = {
  title: "EduWorld — Education Without Borders",
  description:
    "Discover quality educational resources, develop new skills and receive personalized learning support with EduWorld.",
};

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const store = getDataStore();
  const [subjects, courses] = await Promise.all([
    store.getSubjects(),
    store.getCourses(),
  ]);
  const featured = toCourseCards(courses.filter((c) => c.featured));

  return (
    <>
      <Hero />
      <SubjectsSection subjects={subjects} />
      <FeaturedCourses cards={featured} />
      <HowItWorks />
      <AITutorSection />
      <AccessibilitySection />
      <GlobalLearners />
      <Testimonials />
      <FinalCTA />
    </>
  );
}
