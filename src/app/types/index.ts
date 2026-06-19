import type { ElementType } from "react";

export type CourseType = "live" | "recording" | "course" | "project";
export type CourseCategory = "all" | "live-batch" | "self-paced";

export interface Course {
  id: string;
  type: CourseType;
  badge: string;
  icon: ElementType;
  accentFrom: string;
  accentTo: string;
  title: string;
  subtitle: string;
  price: number;
  originalPrice?: number;
  duration?: string;
  timings?: string;
  highlights: string[];
  curriculum: { module: string; topics: string[] }[];
  curriculumDownload?: string;
  tag?: string;
  zoomLink?: string;
  driveLink?: string;
  notesLink?: string;
}

export interface StudentDetails {
  name: string;
  email: string;
  phone: string;
  password: string;
}

export interface LoggedInStudent {
  email: string;
  name: string;
  enrolledCourses: string[];
}

export interface StoredStudent extends LoggedInStudent {
  phone: string;
  password: string;
  createdAt?: string;
}

export interface EnrollmentRecord {
  invoiceNo: string;
  paymentId: string;
  student: StudentDetails;
  course: Course;
  paidAt: Date;
}

export interface Testimonial {
  name: string;
  role: string;
  initials: string;
  color: string;
  text: string;
}
