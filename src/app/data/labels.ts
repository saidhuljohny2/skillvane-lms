import type { CourseCategory, CourseType } from "@/app/types";

export const TYPE_LABELS: Record<CourseType, string> = {
  live: "Live Batch",
  recording: "Self-Paced",
  course: "Foundation",
  project: "Project",
};

export const CATEGORY_LABELS: Record<CourseCategory, string> = {
  all: "All",
  "live-batch": "Live Batch",
  "self-paced": "Self-paced",
};
