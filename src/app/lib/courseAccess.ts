import { MonitorPlay } from "lucide-react";
import type { Course, LoggedInStudent } from "@/app/types";

export function getDemoAccess(course: Course) {
  if (course.type === "live" && course.zoomLink) {
    return {
      href: course.zoomLink,
      label: "Join Demo",
      longLabel: "Join Demo Class",
      icon: MonitorPlay,
    };
  }
  return null;
}

export function getEnrolledCourseAccess(course: Course) {
  if (course.type === "live" && course.zoomLink) {
    return {
      href: course.zoomLink,
      label: "Join Live Class",
      icon: MonitorPlay,
    };
  }
  return null;
}

export function getDriveAccessRequestHref(student: LoggedInStudent, course: Course) {
  const message = [
    "Hi Admin, please provide Google Drive access for my course.",
    `Course: ${course.title}`,
    `Student Name: ${student.name}`,
    `Access Email: ${student.email}`,
    "I understand access will be provided to my mail inbox within 24 hours.",
  ].join("\n");

  return `https://wa.me/917305101711?text=${encodeURIComponent(message)}`;
}
