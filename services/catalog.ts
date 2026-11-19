import type { Course, LibraryFilters, Subject } from "@/types";
import { courseTotalMinutes, lessonsForCourse, subjectById } from "@/data/demo";

export interface CourseCard {
  course: Course;
  subject: Subject | undefined;
  lessonCount: number;
  durationMinutes: number;
}

/** Decorate courses with catalog metadata for UI cards. */
export function toCourseCards(courses: Course[]): CourseCard[] {
  return courses.map((course) => ({
    course,
    subject: subjectById(course.subjectId),
    lessonCount: lessonsForCourse(course.id).length,
    durationMinutes: courseTotalMinutes(course.id),
  }));
}

/**
 * Simple facet filter used by the library page. Country / language filters
 * matter once per-national-curriculum content exists; today they are
 * accepted and recorded but content is English-first.
 */
export function filterCourses(courses: Course[], filters: LibraryFilters): Course[] {
  return courses.filter((c) => {
    if (filters.query) {
      const q = filters.query.trim().toLowerCase();
      const haystack = `${c.title} ${c.description} ${subjectById(c.subjectId)?.name ?? ""}`.toLowerCase();
      if (!haystack.includes(q)) return false;
    }
    if (filters.subjectId && c.subjectId !== filters.subjectId) return false;
    if (filters.level && c.level !== filters.level) return false;
    return true;
  });
}
