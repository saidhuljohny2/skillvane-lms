import { useState, useEffect } from "react";
import {
  ChevronDown, Star, Users, Clock, Award, Check, Menu, X,
  Shield, Zap, Database, Cloud, Play, TrendingUp, Code2,
  Layers, GitBranch, Video, BookOpen, Briefcase, Heart,
  ShoppingCart, ArrowRight, MonitorPlay, FileText, MessageCircle,
} from "lucide-react";
import CourseContentPage, { CourseContent } from "./components/CourseContentPage";
import LoginPage, { Student } from "./components/LoginPage";
import StudentDashboard from "./components/StudentDashboard";

// ─────────────────────────────────────────────────────────────────
// COURSE DATA — Add a new course here and it appears on the site
// ─────────────────────────────────────────────────────────────────
type CourseType = "live" | "recording" | "course" | "project";

interface CurriculumTopic {
  title: string;
  duration?: string;
  videoUrl?: string; // Google Drive video link — add per topic
}

interface Course {
  id: string;
  type: CourseType;
  badge: string;
  icon: React.ElementType;
  accentFrom: string;
  accentTo: string;
  title: string;
  subtitle: string;
  price: number;
  originalPrice?: number;
  duration?: string;
  timings?: string;
  highlights: string[];
  curriculum: { module: string; topics: CurriculumTopic[] }[];
  tag?: string;
}

const COURSES: Course[] = [
  // ── Course 1 ────────────────────────────────────────────────────
  {
    id: "gcp-live",
    type: "live",
    badge: "LIVE BATCH",
    icon: MonitorPlay,
    accentFrom: "#4361ee",
    accentTo: "#3bc9db",
    title: "GCP Data Engineering",
    subtitle: "Full Course — Live Batch",
    price: 12000,
    originalPrice: 20000,
    duration: "3 Months",
    timings: "7:30 AM – 8:30 AM (Mon – Fri)",
    tag: "Most Popular",
    highlights: [
      "Daily live sessions (Mon–Fri, 7:30–8:30 AM)",
      "Same-day recordings shared after every class",
      "Structured notes for every module",
      "Resume assistance & career guidance",
      "Live doubt-clearing in every session",
      "Private student community access",
    ],
    curriculum: [
      // ── PASTE YOUR CURRICULUM HERE ──
      // Format: { module: "Module Name", topics: [{ title: "Topic", duration: "45m", videoUrl: "https://drive.google.com/file/d/YOUR_FILE_ID/view" }] }
      {
        module: "Module 1 — GCP Fundamentals",
        topics: [
          { title: "GCP Console, IAM & Resource Hierarchy", duration: "52m", videoUrl: "https://drive.google.com/file/d/REPLACE_WITH_YOUR_FILE_ID/view" },
          { title: "Compute Engine, Cloud Storage, Networking", duration: "48m", videoUrl: "https://drive.google.com/file/d/REPLACE_WITH_YOUR_FILE_ID/view" },
          { title: "Billing, Cost Optimization & Quotas", duration: "35m", videoUrl: "https://drive.google.com/file/d/REPLACE_WITH_YOUR_FILE_ID/view" },
        ],
      },
      {
        module: "Module 2 — BigQuery",
        topics: [
          { title: "BigQuery Architecture & Columnar Storage", duration: "55m", videoUrl: "https://drive.google.com/file/d/REPLACE_WITH_YOUR_FILE_ID/view" },
          { title: "Advanced SQL, Window Functions, Arrays", duration: "60m", videoUrl: "https://drive.google.com/file/d/REPLACE_WITH_YOUR_FILE_ID/view" },
          { title: "Partitioning, Clustering & Query Optimization", duration: "58m", videoUrl: "https://drive.google.com/file/d/REPLACE_WITH_YOUR_FILE_ID/view" },
          { title: "BigQuery ML & BI Engine", duration: "45m", videoUrl: "https://drive.google.com/file/d/REPLACE_WITH_YOUR_FILE_ID/view" },
        ],
      },
      {
        module: "Module 3 — Cloud Dataflow",
        topics: [
          { title: "Apache Beam Programming Model", duration: "50m", videoUrl: "https://drive.google.com/file/d/REPLACE_WITH_YOUR_FILE_ID/view" },
          { title: "Batch & Streaming Pipeline Design", duration: "55m", videoUrl: "https://drive.google.com/file/d/REPLACE_WITH_YOUR_FILE_ID/view" },
          { title: "Windowing, Triggers & Watermarks", duration: "48m", videoUrl: "https://drive.google.com/file/d/REPLACE_WITH_YOUR_FILE_ID/view" },
          { title: "Dataflow Templates & Autoscaling", duration: "42m", videoUrl: "https://drive.google.com/file/d/REPLACE_WITH_YOUR_FILE_ID/view" },
        ],
      },
      {
        module: "Module 4 — Dataproc",
        topics: [
          { title: "Managed Spark & Hadoop on GCP", duration: "52m", videoUrl: "https://drive.google.com/file/d/REPLACE_WITH_YOUR_FILE_ID/view" },
          { title: "PySpark for Large-Scale Transformations", duration: "65m", videoUrl: "https://drive.google.com/file/d/REPLACE_WITH_YOUR_FILE_ID/view" },
          { title: "Hive Metastore & BigQuery Integration", duration: "44m", videoUrl: "https://drive.google.com/file/d/REPLACE_WITH_YOUR_FILE_ID/view" },
          { title: "Dataproc Serverless & Cost Strategies", duration: "38m", videoUrl: "https://drive.google.com/file/d/REPLACE_WITH_YOUR_FILE_ID/view" },
        ],
      },
      {
        module: "Module 5 — Cloud Composer / Airflow",
        topics: [
          { title: "DAGs, Operators, XComs & Sensors", duration: "58m", videoUrl: "https://drive.google.com/file/d/REPLACE_WITH_YOUR_FILE_ID/view" },
          { title: "Production-Grade Pipeline Orchestration", duration: "62m", videoUrl: "https://drive.google.com/file/d/REPLACE_WITH_YOUR_FILE_ID/view" },
          { title: "Scheduling, Alerting & SLA Monitoring", duration: "40m", videoUrl: "https://drive.google.com/file/d/REPLACE_WITH_YOUR_FILE_ID/view" },
        ],
      },
      {
        module: "Module 6 — Pub/Sub",
        topics: [
          { title: "Topics, Subscriptions & Delivery Guarantees", duration: "45m", videoUrl: "https://drive.google.com/file/d/REPLACE_WITH_YOUR_FILE_ID/view" },
          { title: "Push vs Pull & Ordering Semantics", duration: "38m", videoUrl: "https://drive.google.com/file/d/REPLACE_WITH_YOUR_FILE_ID/view" },
          { title: "Dead Letter Queues & Error Handling", duration: "35m", videoUrl: "https://drive.google.com/file/d/REPLACE_WITH_YOUR_FILE_ID/view" },
        ],
      },
      {
        module: "Module 7 — Real-Time Pipelines",
        topics: [
          { title: "End-to-End Streaming Architecture on GCP", duration: "55m", videoUrl: "https://drive.google.com/file/d/REPLACE_WITH_YOUR_FILE_ID/view" },
          { title: "Pub/Sub → Dataflow → BigQuery Pipeline", duration: "70m", videoUrl: "https://drive.google.com/file/d/REPLACE_WITH_YOUR_FILE_ID/view" },
          { title: "Looker Studio Real-Time Dashboards", duration: "42m", videoUrl: "https://drive.google.com/file/d/REPLACE_WITH_YOUR_FILE_ID/view" },
        ],
      },
      {
        module: "Module 8 — Capstone & Career Prep",
        topics: [
          { title: "End-to-End Project Design & Review", duration: "75m", videoUrl: "https://drive.google.com/file/d/REPLACE_WITH_YOUR_FILE_ID/view" },
          { title: "Resume Building & Portfolio Prep", duration: "45m", videoUrl: "https://drive.google.com/file/d/REPLACE_WITH_YOUR_FILE_ID/view" },
          { title: "Mock Interviews & GCP DE Exam Guidance", duration: "60m", videoUrl: "https://drive.google.com/file/d/REPLACE_WITH_YOUR_FILE_ID/view" },
        ],
      },
    ],
  },

  // ── Course 2 ────────────────────────────────────────────────────
  {
    id: "gcp-recordings",
    type: "recording",
    badge: "SELF-PACED",
    icon: Video,
    accentFrom: "#7c3aed",
    accentTo: "#a855f7",
    title: "GCP Data Engineering",
    subtitle: "Course — Recordings",
    price: 6000,
    originalPrice: 12000,
    highlights: [
      "Latest batch recordings (full course)",
      "Watch at your own pace, anytime",
      "Same curriculum as the live batch",
      "Lifetime access to all recordings",
      "Notes included with every module",
      "Community access for doubt resolution",
    ],
    curriculum: [
      // ── PASTE YOUR CURRICULUM HERE ──
      {
        module: "Module 1 — GCP Fundamentals",
        topics: [
          { title: "GCP Console, IAM & Resource Hierarchy", duration: "52m", videoUrl: "https://drive.google.com/file/d/REPLACE_WITH_YOUR_FILE_ID/view" },
          { title: "Compute Engine, Cloud Storage, Networking", duration: "48m", videoUrl: "https://drive.google.com/file/d/REPLACE_WITH_YOUR_FILE_ID/view" },
          { title: "Billing, Cost Optimization & Quotas", duration: "35m", videoUrl: "https://drive.google.com/file/d/REPLACE_WITH_YOUR_FILE_ID/view" },
        ],
      },
      {
        module: "Module 2 — BigQuery",
        topics: [
          { title: "BigQuery Architecture & Columnar Storage", duration: "55m", videoUrl: "https://drive.google.com/file/d/REPLACE_WITH_YOUR_FILE_ID/view" },
          { title: "Advanced SQL, Window Functions, Arrays", duration: "60m", videoUrl: "https://drive.google.com/file/d/REPLACE_WITH_YOUR_FILE_ID/view" },
          { title: "Partitioning, Clustering & Query Optimization", duration: "58m", videoUrl: "https://drive.google.com/file/d/REPLACE_WITH_YOUR_FILE_ID/view" },
        ],
      },
      {
        module: "Module 3 — Cloud Dataflow",
        topics: [
          { title: "Apache Beam Programming Model", duration: "50m", videoUrl: "https://drive.google.com/file/d/REPLACE_WITH_YOUR_FILE_ID/view" },
          { title: "Batch & Streaming Pipeline Design", duration: "55m", videoUrl: "https://drive.google.com/file/d/REPLACE_WITH_YOUR_FILE_ID/view" },
          { title: "Dataflow Templates & Autoscaling", duration: "42m", videoUrl: "https://drive.google.com/file/d/REPLACE_WITH_YOUR_FILE_ID/view" },
        ],
      },
      {
        module: "Module 4 — Dataproc",
        topics: [
          { title: "Managed Spark & Hadoop on GCP", duration: "52m", videoUrl: "https://drive.google.com/file/d/REPLACE_WITH_YOUR_FILE_ID/view" },
          { title: "PySpark for Large-Scale Transformations", duration: "65m", videoUrl: "https://drive.google.com/file/d/REPLACE_WITH_YOUR_FILE_ID/view" },
        ],
      },
      {
        module: "Module 5 — Cloud Composer / Airflow",
        topics: [
          { title: "DAGs, Operators & Sensors", duration: "58m", videoUrl: "https://drive.google.com/file/d/REPLACE_WITH_YOUR_FILE_ID/view" },
          { title: "Production Pipeline Orchestration", duration: "62m", videoUrl: "https://drive.google.com/file/d/REPLACE_WITH_YOUR_FILE_ID/view" },
        ],
      },
      {
        module: "Module 6 — Pub/Sub & Real-Time",
        topics: [
          { title: "Pub/Sub Topics & Subscriptions", duration: "45m", videoUrl: "https://drive.google.com/file/d/REPLACE_WITH_YOUR_FILE_ID/view" },
          { title: "End-to-End Streaming Architecture", duration: "55m", videoUrl: "https://drive.google.com/file/d/REPLACE_WITH_YOUR_FILE_ID/view" },
        ],
      },
    ],
  },

  // ── Course 3 ────────────────────────────────────────────────────
  {
    id: "python-de",
    type: "course",
    badge: "FOUNDATION",
    icon: Code2,
    accentFrom: "#059669",
    accentTo: "#10b981",
    title: "Python for Data Engineering",
    subtitle: "Hands-On Foundation Course",
    price: 599,
    originalPrice: 2000,
    highlights: [
      "Python fundamentals for data engineers",
      "File handling, APIs & automation scripts",
      "Pandas, NumPy & data manipulation",
      "Working with JSON, CSV & Parquet",
      "Connecting Python with GCP services",
      "Beginner-friendly, no prior coding needed",
    ],
    curriculum: [
      {
        module: "Module 1 — Python Basics",
        topics: [
          { title: "Variables, Data Types & Control Flow", duration: "40m", videoUrl: "https://drive.google.com/file/d/REPLACE_WITH_YOUR_FILE_ID/view" },
          { title: "Functions, Modules & Packages", duration: "38m", videoUrl: "https://drive.google.com/file/d/REPLACE_WITH_YOUR_FILE_ID/view" },
          { title: "Error Handling & Debugging", duration: "32m", videoUrl: "https://drive.google.com/file/d/REPLACE_WITH_YOUR_FILE_ID/view" },
        ],
      },
      {
        module: "Module 2 — Data Handling",
        topics: [
          { title: "File I/O: CSV, JSON, Parquet", duration: "42m", videoUrl: "https://drive.google.com/file/d/REPLACE_WITH_YOUR_FILE_ID/view" },
          { title: "Pandas for Data Manipulation", duration: "55m", videoUrl: "https://drive.google.com/file/d/REPLACE_WITH_YOUR_FILE_ID/view" },
          { title: "NumPy for Numerical Computing", duration: "45m", videoUrl: "https://drive.google.com/file/d/REPLACE_WITH_YOUR_FILE_ID/view" },
        ],
      },
      {
        module: "Module 3 — Python for Engineering",
        topics: [
          { title: "REST APIs & HTTP Requests", duration: "38m", videoUrl: "https://drive.google.com/file/d/REPLACE_WITH_YOUR_FILE_ID/view" },
          { title: "Automation Scripts & Scheduling", duration: "35m", videoUrl: "https://drive.google.com/file/d/REPLACE_WITH_YOUR_FILE_ID/view" },
          { title: "Connecting Python with GCP (BigQuery, GCS)", duration: "50m", videoUrl: "https://drive.google.com/file/d/REPLACE_WITH_YOUR_FILE_ID/view" },
        ],
      },
    ],
  },

  // ── Course 4 ────────────────────────────────────────────────────
  {
    id: "project-healthcare",
    type: "project",
    badge: "REAL PROJECT",
    icon: Heart,
    accentFrom: "#dc2626",
    accentTo: "#f87171",
    title: "Health Care GCP",
    subtitle: "Data Engineering Project",
    price: 1499,
    originalPrice: 3000,
    highlights: [
      "End-to-end real-world healthcare dataset",
      "Ingest, transform & serve patient data pipelines",
      "BigQuery + Dataflow + Composer stack",
      "HIPAA-aware data design patterns",
      "Portfolio-ready project with full code",
      "Architecture walkthrough & code review",
    ],
    curriculum: [
      {
        module: "Project Overview & Architecture",
        topics: [
          { title: "Healthcare Data Landscape on GCP", duration: "45m", videoUrl: "https://drive.google.com/file/d/REPLACE_WITH_YOUR_FILE_ID/view" },
          { title: "Solution Architecture Design", duration: "50m", videoUrl: "https://drive.google.com/file/d/REPLACE_WITH_YOUR_FILE_ID/view" },
          { title: "GCP Services Selection & Setup", duration: "38m", videoUrl: "https://drive.google.com/file/d/REPLACE_WITH_YOUR_FILE_ID/view" },
        ],
      },
      {
        module: "Data Ingestion Pipeline",
        topics: [
          { title: "Ingesting HL7/FHIR Healthcare Records", duration: "55m", videoUrl: "https://drive.google.com/file/d/REPLACE_WITH_YOUR_FILE_ID/view" },
          { title: "Pub/Sub → Dataflow Streaming Ingestion", duration: "60m", videoUrl: "https://drive.google.com/file/d/REPLACE_WITH_YOUR_FILE_ID/view" },
          { title: "Raw Layer Design in Cloud Storage", duration: "42m", videoUrl: "https://drive.google.com/file/d/REPLACE_WITH_YOUR_FILE_ID/view" },
        ],
      },
      {
        module: "Transformation & Serving",
        topics: [
          { title: "Data Cleansing & Transformation with Dataflow", duration: "58m", videoUrl: "https://drive.google.com/file/d/REPLACE_WITH_YOUR_FILE_ID/view" },
          { title: "BigQuery Schema Design for Healthcare", duration: "52m", videoUrl: "https://drive.google.com/file/d/REPLACE_WITH_YOUR_FILE_ID/view" },
          { title: "Looker Studio Dashboard for Analytics", duration: "45m", videoUrl: "https://drive.google.com/file/d/REPLACE_WITH_YOUR_FILE_ID/view" },
        ],
      },
      {
        module: "Orchestration & Monitoring",
        topics: [
          { title: "Airflow DAG for End-to-End Orchestration", duration: "62m", videoUrl: "https://drive.google.com/file/d/REPLACE_WITH_YOUR_FILE_ID/view" },
          { title: "Cloud Monitoring & Alerting Setup", duration: "40m", videoUrl: "https://drive.google.com/file/d/REPLACE_WITH_YOUR_FILE_ID/view" },
          { title: "Final Code Review & Portfolio Prep", duration: "55m", videoUrl: "https://drive.google.com/file/d/REPLACE_WITH_YOUR_FILE_ID/view" },
        ],
      },
    ],
  },

  // ── Course 5 ────────────────────────────────────────────────────
  {
    id: "project-retail",
    type: "project",
    badge: "REAL PROJECT",
    icon: ShoppingCart,
    accentFrom: "#d97706",
    accentTo: "#f59e0b",
    title: "Retailer GCP",
    subtitle: "Data Engineering Project",
    price: 1499,
    originalPrice: 3000,
    highlights: [
      "End-to-end real-world retail/e-commerce dataset",
      "Sales, inventory & customer analytics pipelines",
      "BigQuery + Dataflow + Composer stack",
      "Near-real-time dashboard with Looker Studio",
      "Portfolio-ready project with full code",
      "Architecture walkthrough & code review",
    ],
    curriculum: [
      {
        module: "Project Overview & Architecture",
        topics: [
          { title: "Retail Data Engineering Challenges", duration: "42m", videoUrl: "https://drive.google.com/file/d/REPLACE_WITH_YOUR_FILE_ID/view" },
          { title: "Solution Architecture on GCP", duration: "48m", videoUrl: "https://drive.google.com/file/d/REPLACE_WITH_YOUR_FILE_ID/view" },
          { title: "Dataset Walkthrough: Orders, Inventory, Customers", duration: "38m", videoUrl: "https://drive.google.com/file/d/REPLACE_WITH_YOUR_FILE_ID/view" },
        ],
      },
      {
        module: "Batch Ingestion Pipeline",
        topics: [
          { title: "Loading Retail Data from GCS to BigQuery", duration: "52m", videoUrl: "https://drive.google.com/file/d/REPLACE_WITH_YOUR_FILE_ID/view" },
          { title: "Dataproc Spark Transformations", duration: "60m", videoUrl: "https://drive.google.com/file/d/REPLACE_WITH_YOUR_FILE_ID/view" },
          { title: "Slowly Changing Dimensions (SCD) Design", duration: "45m", videoUrl: "https://drive.google.com/file/d/REPLACE_WITH_YOUR_FILE_ID/view" },
        ],
      },
      {
        module: "Streaming & Real-Time Analytics",
        topics: [
          { title: "Pub/Sub → Dataflow for Live Order Events", duration: "58m", videoUrl: "https://drive.google.com/file/d/REPLACE_WITH_YOUR_FILE_ID/view" },
          { title: "Real-Time Sales Dashboard in Looker Studio", duration: "50m", videoUrl: "https://drive.google.com/file/d/REPLACE_WITH_YOUR_FILE_ID/view" },
          { title: "Alerting on Inventory Threshold Breaches", duration: "35m", videoUrl: "https://drive.google.com/file/d/REPLACE_WITH_YOUR_FILE_ID/view" },
        ],
      },
      {
        module: "Orchestration & Delivery",
        topics: [
          { title: "Airflow DAG for Full Pipeline Orchestration", duration: "62m", videoUrl: "https://drive.google.com/file/d/REPLACE_WITH_YOUR_FILE_ID/view" },
          { title: "Data Quality Checks & Validation", duration: "40m", videoUrl: "https://drive.google.com/file/d/REPLACE_WITH_YOUR_FILE_ID/view" },
          { title: "Final Code Review & Portfolio Prep", duration: "55m", videoUrl: "https://drive.google.com/file/d/REPLACE_WITH_YOUR_FILE_ID/view" },
        ],
      },
    ],
  },

  // ── ADD A NEW COURSE HERE ────────────────────────────────────────
  // Copy any block above, change the id, content, price, and colors.
  // The card will appear automatically on the site.
];

// ─────────────────────────────────────────────────────────────────
// Static data
// ─────────────────────────────────────────────────────────────────
const TICKER = [
  "Rohan from Mumbai just enrolled",
  "Divya from Bangalore just enrolled",
  "Karthik from Chennai just enrolled",
  "Pooja from Hyderabad just enrolled",
  "Ankit from Delhi just enrolled",
  "Meena from Pune just enrolled",
  "Vijay from Kolkata just enrolled",
];

const TESTIMONIALS = [
  {
    name: "Arjun Sharma",
    role: "Data Engineer at Infosys",
    initials: "AS",
    color: "from-blue-500 to-indigo-600",
    text: "The live batch format is incredible. Getting to ask questions in real time saved me weeks of confusion. Landed a Data Engineering role within 2 months of completing the course.",
  },
  {
    name: "Priya Nair",
    role: "Cloud Architect at TCS",
    initials: "PN",
    color: "from-violet-500 to-purple-600",
    text: "I started with the Python course and then upgraded to the GCP live batch. The progression was seamless and very well structured. The instructor explains complex concepts with remarkable clarity.",
  },
  {
    name: "Rahul Verma",
    role: "Senior Analyst at Wipro",
    initials: "RV",
    color: "from-cyan-500 to-blue-600",
    text: "Cleared the Google Professional Data Engineer exam on my first attempt. The Healthcare project gave me a standout portfolio piece that every interviewer asks about.",
  },
  {
    name: "Sneha Patil",
    role: "ML Engineer at Flipkart",
    initials: "SP",
    color: "from-emerald-500 to-teal-600",
    text: "The Retailer project course was worth every rupee. It bridged the gap between theory and production-grade engineering. I used the exact architecture in my current job.",
  },
];

const TYPE_LABELS: Record<CourseType, string> = {
  live: "Live Batch",
  recording: "Self-Paced",
  course: "Foundation",
  project: "Project",
};

// ─────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────
function formatINR(n: number) {
  return `₹${n.toLocaleString("en-IN")}`;
}

function GradientText({
  from,
  to,
  children,
  className = "",
}: {
  from: string;
  to: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={className}
      style={{
        background: `linear-gradient(135deg, ${from} 0%, ${to} 100%)`,
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        backgroundClip: "text",
      }}
    >
      {children}
    </span>
  );
}

// ─────────────────────────────────────────────────────────────────
// Course Modal
// ─────────────────────────────────────────────────────────────────
function CourseModal({
  course,
  onClose,
  onEnroll,
}: {
  course: Course;
  onClose: () => void;
  onEnroll: (course: Course) => void;
}) {
  const [openModule, setOpenModule] = useState<number | null>(0);
  const Icon = course.icon;

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full sm:max-w-2xl max-h-[92dvh] sm:max-h-[85vh] flex flex-col bg-[#0f1526] rounded-t-2xl sm:rounded-2xl border border-white/10 shadow-2xl overflow-hidden">
        {/* Header */}
        <div
          className="px-5 sm:px-6 py-5 flex items-start justify-between gap-4 flex-shrink-0"
          style={{
            background: `linear-gradient(135deg, ${course.accentFrom}22 0%, ${course.accentTo}11 100%)`,
            borderBottom: `1px solid ${course.accentFrom}30`,
          }}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{
                background: `linear-gradient(135deg, ${course.accentFrom} 0%, ${course.accentTo} 100%)`,
              }}
            >
              <Icon className="w-5 h-5 text-white" />
            </div>
            <div>
              <p
                className="text-xs font-mono uppercase tracking-widest mb-0.5"
                style={{ color: course.accentFrom }}
              >
                {course.badge}
              </p>
              <h2
                className="text-base sm:text-lg font-bold leading-tight text-white"
                style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
              >
                {course.title}
              </h2>
              <p className="text-xs text-white/50">{course.subtitle}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-white/10 transition-colors text-white/60 hover:text-white flex-shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable body */}
        <div className="overflow-y-auto flex-1 px-5 sm:px-6 py-5 space-y-6">
          {/* Price + meta */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="flex items-baseline gap-2">
                <span
                  className="text-3xl font-extrabold text-white"
                  style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                >
                  {formatINR(course.price)}
                </span>
                {course.originalPrice && (
                  <span className="text-white/40 line-through text-base">
                    {formatINR(course.originalPrice)}
                  </span>
                )}
              </div>
              {course.originalPrice && (
                <p className="text-xs text-emerald-400 font-semibold mt-0.5">
                  Save {formatINR(course.originalPrice - course.price)}
                </p>
              )}
            </div>
            <div className="flex flex-wrap gap-3 text-xs text-white/50">
              {course.duration && (
                <span className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" />
                  {course.duration}
                </span>
              )}
              {course.timings && (
                <span className="flex items-center gap-1.5">
                  <MonitorPlay className="w-3.5 h-3.5" />
                  {course.timings}
                </span>
              )}
            </div>
          </div>

          {/* Highlights */}
          <div>
            <h3
              className="text-sm font-bold text-white mb-3"
              style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
            >
              What&apos;s Included
            </h3>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {course.highlights.map((h) => (
                <li key={h} className="flex items-start gap-2.5 text-sm text-white/70">
                  <Check className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                  {h}
                </li>
              ))}
            </ul>
          </div>

          {/* Curriculum */}
          <div>
            <h3
              className="text-sm font-bold text-white mb-3"
              style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
            >
              Curriculum
            </h3>
            <div className="space-y-1.5">
              {course.curriculum.map((mod, i) => (
                <div
                  key={i}
                  className="border border-white/8 rounded-xl overflow-hidden"
                >
                  <button
                    className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-white/5 transition-colors"
                    onClick={() => setOpenModule(openModule === i ? null : i)}
                  >
                    <span className="text-sm font-semibold text-white/90">{mod.module}</span>
                    <ChevronDown
                      className={`w-4 h-4 text-white/40 flex-shrink-0 transition-transform duration-200 ${
                        openModule === i ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  {openModule === i && (
                    <ul className="px-4 pb-3 border-t border-white/5 space-y-2 pt-3">
                      {mod.topics.map((t) => (
                        <li key={t.title} className="flex items-start gap-2.5 text-sm text-white/55">
                          <Check className="w-3.5 h-3.5 text-emerald-400 mt-0.5 flex-shrink-0" />
                          {t.title}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer CTA */}
        <div className="flex-shrink-0 px-5 sm:px-6 py-4 border-t border-white/8 bg-[#080d1a]">
          <button
            onClick={() => onEnroll(course)}
            className="w-full py-3.5 rounded-xl font-bold text-sm text-white hover:opacity-90 active:scale-[0.99] transition-all shadow-lg"
            style={{
              background: `linear-gradient(135deg, ${course.accentFrom} 0%, ${course.accentTo} 100%)`,
              boxShadow: `0 8px 30px ${course.accentFrom}40`,
            }}
          >
            Enroll Now · {formatINR(course.price)}
          </button>
          <p className="text-center text-xs text-white/30 mt-2.5">
            Secure payment via Razorpay · UPI · Net Banking · Cards · EMI
          </p>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
// Course Card
// ─────────────────────────────────────────────────────────────────
function CourseCard({
  course,
  onViewDetails,
  onEnroll,
}: {
  course: Course;
  onViewDetails: (c: Course) => void;
  onEnroll: (c: Course) => void;
}) {
  const Icon = course.icon;

  return (
    <div className="group relative flex flex-col rounded-2xl border border-white/8 bg-card overflow-hidden hover:border-white/20 transition-all duration-300">
      {/* Accent top bar */}
      <div
        className="h-1 w-full"
        style={{
          background: `linear-gradient(90deg, ${course.accentFrom} 0%, ${course.accentTo} 100%)`,
        }}
      />

      {/* Tag */}
      {course.tag && (
        <div
          className="absolute top-4 right-4 text-[10px] font-bold px-2.5 py-1 rounded-full text-white"
          style={{ background: `linear-gradient(135deg, ${course.accentFrom}, ${course.accentTo})` }}
        >
          {course.tag}
        </div>
      )}

      <div className="p-5 sm:p-6 flex flex-col flex-1">
        {/* Icon + badge */}
        <div className="flex items-center gap-3 mb-4">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{
              background: `linear-gradient(135deg, ${course.accentFrom}22 0%, ${course.accentTo}11 100%)`,
              border: `1px solid ${course.accentFrom}40`,
            }}
          >
            <Icon className="w-5 h-5" style={{ color: course.accentFrom }} />
          </div>
          <span
            className="text-[10px] font-mono font-bold tracking-widest px-2 py-0.5 rounded-full border"
            style={{
              color: course.accentFrom,
              borderColor: `${course.accentFrom}40`,
              background: `${course.accentFrom}12`,
            }}
          >
            {course.badge}
          </span>
        </div>

        {/* Title */}
        <h3
          className="text-lg font-bold text-white leading-tight mb-0.5"
          style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
        >
          {course.title}
        </h3>
        <p className="text-xs text-white/40 mb-4">{course.subtitle}</p>

        {/* Meta pills */}
        <div className="flex flex-wrap gap-2 mb-5">
          {course.duration && (
            <span className="flex items-center gap-1 text-xs text-white/50 bg-white/5 px-2.5 py-1 rounded-full">
              <Clock className="w-3 h-3" />
              {course.duration}
            </span>
          )}
          {course.timings && (
            <span className="flex items-center gap-1 text-xs text-white/50 bg-white/5 px-2.5 py-1 rounded-full">
              <MonitorPlay className="w-3 h-3" />
              Live
            </span>
          )}
          <span className="flex items-center gap-1 text-xs text-white/50 bg-white/5 px-2.5 py-1 rounded-full">
            <BookOpen className="w-3 h-3" />
            {TYPE_LABELS[course.type]}
          </span>
        </div>

        {/* Highlights (top 4) */}
        <ul className="space-y-2 mb-6 flex-1">
          {course.highlights.slice(0, 4).map((h) => (
            <li key={h} className="flex items-start gap-2.5 text-xs text-white/60">
              <Check className="w-3.5 h-3.5 text-emerald-400 mt-0.5 flex-shrink-0" />
              {h}
            </li>
          ))}
        </ul>

        {/* Price */}
        <div className="flex items-baseline gap-2 mb-4">
          <span
            className="text-2xl font-extrabold text-white"
            style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
          >
            {formatINR(course.price)}
          </span>
          {course.originalPrice && (
            <span className="text-white/30 line-through text-sm">
              {formatINR(course.originalPrice)}
            </span>
          )}
          {course.originalPrice && (
            <span className="text-xs text-emerald-400 font-semibold">
              {Math.round(((course.originalPrice - course.price) / course.originalPrice) * 100)}% off
            </span>
          )}
        </div>

        {/* Buttons */}
        <div className="flex gap-2">
          <button
            onClick={() => onEnroll(course)}
            className="flex-1 py-2.5 rounded-xl text-sm font-bold text-white hover:opacity-90 active:scale-[0.99] transition-all"
            style={{
              background: `linear-gradient(135deg, ${course.accentFrom} 0%, ${course.accentTo} 100%)`,
            }}
          >
            Enroll Now
          </button>
          <button
            onClick={() => onViewDetails(course)}
            className="px-4 py-2.5 rounded-xl text-sm font-semibold border border-white/15 text-white/70 hover:bg-white/5 hover:text-white transition-all"
          >
            Details
          </button>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
// Main App
// ─────────────────────────────────────────────────────────────────
// ─── Build CourseContent from a Course ────────────────────────────────────
function buildCourseContent(course: Course): CourseContent {
  return {
    id: course.id,
    title: course.title,
    subtitle: course.subtitle,
    accentFrom: course.accentFrom,
    accentTo: course.accentTo,
    modules: course.curriculum.map((mod) => ({
      module: mod.module,
      topics: mod.topics.map((t) => ({
        title: t.title,
        duration: t.duration,
        videoUrl: t.videoUrl,
      })),
    })),
  };
}

// ─── Total lessons & duration helpers ─────────────────────────────────────
function courseTotalLessons(course: Course) {
  return course.curriculum.reduce((s, m) => s + m.topics.length, 0);
}

function courseTotalDuration(course: Course) {
  let mins = 0;
  course.curriculum.forEach((m) =>
    m.topics.forEach((t) => {
      if (t.duration) mins += parseInt(t.duration) || 0;
    })
  );
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
}

// ─────────────────────────────────────────────────────────────────
// Main App
// ─────────────────────────────────────────────────────────────────
export default function App() {
  const [ticker, setTicker] = useState(0);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState<"all" | CourseType>("all");
  const [modalCourse, setModalCourse] = useState<Course | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [payLoading, setPayLoading] = useState<string | null>(null);
  const [payDone, setPayDone] = useState<string | null>(null);

  // ── Auth state ──
  const [currentStudent, setCurrentStudent] = useState<Student | null>(null);
  const [showLogin, setShowLogin] = useState(false);
  const [watchingCourse, setWatchingCourse] = useState<CourseContent | null>(null);

  useEffect(() => {
    const t = setInterval(() => setTicker((i) => (i + 1) % TICKER.length), 2800);
    return () => clearInterval(t);
  }, []);

  // Lock body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = modalCourse ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [modalCourse]);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMobileOpen(false);
  };

  const handleEnroll = (course: Course) => {
    // If not logged in, show login page instead
    if (!currentStudent) {
      setModalCourse(null);
      setShowLogin(true);
      return;
    }
    setModalCourse(null);
    setPayLoading(course.id);
    setTimeout(() => {
      setPayLoading(null);
      setPayDone(course.id);
      setTimeout(() => setPayDone(null), 4000);
    }, 900);
  };

  const FILTERS: { label: string; value: "all" | CourseType }[] = [
    { label: "All Courses", value: "all" },
    { label: "Live Batch", value: "live" },
    { label: "Recordings", value: "recording" },
    { label: "Foundation", value: "course" },
    { label: "Projects", value: "project" },
  ];

  const visibleCourses =
    activeFilter === "all"
      ? COURSES
      : COURSES.filter((c) => c.type === activeFilter);

  const faqs = [
    {
      q: "Do I need prior GCP experience?",
      a: "No. The GCP courses start from cloud fundamentals. For the project courses, basic GCP knowledge is helpful. The Python course has no prerequisites at all.",
    },
    {
      q: "What is the difference between the Live Batch and Recordings course?",
      a: "The Live Batch gives you real-time interaction with the instructor (Mon–Fri, 7:30–8:30 AM) plus daily recordings, notes, and resume assistance. The Recordings course gives you the full video archive of the latest batch to study at your own pace.",
    },
    {
      q: "Can I buy the project courses without the main GCP course?",
      a: "Yes. The project courses are standalone. However, they are most effective if you have some GCP fundamentals. We recommend completing the Recordings course first if you are new to GCP.",
    },
    {
      q: "Is there a refund policy?",
      a: "Yes — 7-day no-questions-asked refund if you are not satisfied after accessing up to the first two modules of any course.",
    },
    {
      q: "Is EMI or instalment payment available?",
      a: "Yes. Razorpay offers 0% EMI on most major credit cards. The option appears automatically at checkout.",
    },
  ];

  // ── Login page ──
  if (showLogin) {
    return (
      <LoginPage
        onLogin={(student) => {
          setCurrentStudent(student);
          setShowLogin(false);
        }}
        onBack={() => setShowLogin(false)}
      />
    );
  }

  // ── Student dashboard (logged in, not watching a specific course) ──
  if (currentStudent && !watchingCourse) {
    const dashboardCourses = COURSES.map((course) => ({
      id: course.id,
      title: course.title,
      subtitle: course.subtitle,
      badge: course.badge,
      accentFrom: course.accentFrom,
      accentTo: course.accentTo,
      icon: course.icon,
      totalLessons: courseTotalLessons(course),
      totalDuration: courseTotalDuration(course),
      enrolled: currentStudent.enrolledCourseIds.includes(course.id),
      content: buildCourseContent(course),
    }));

    return (
      <StudentDashboard
        student={currentStudent}
        courses={dashboardCourses}
        onWatchCourse={(content) => setWatchingCourse(content)}
        onLogout={() => { setCurrentStudent(null); setWatchingCourse(null); }}
        onBrowse={() => {}}
      />
    );
  }

  // ── Course content player (enrolled student watching a course) ──
  if (currentStudent && watchingCourse) {
    return (
      <CourseContentPage
        content={watchingCourse}
        onBack={() => setWatchingCourse(null)}
      />
    );
  }

  return (
    <div
      className="min-h-screen bg-background text-foreground overflow-x-hidden"
      style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}
    >
      {/* ── Navbar ──────────────────────────────────────────────── */}
      <nav className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#4361ee] flex items-center justify-center shadow-lg shadow-[#4361ee]/40">
              <Cloud className="w-4 h-4 text-white" />
            </div>
            <span
              className="font-bold text-sm tracking-tight"
              style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
            >
              SkillVane{" "}
              <span className="text-[#4361ee]">IT Academy</span>
            </span>
          </div>

          <div className="hidden md:flex items-center gap-7 text-sm text-muted-foreground">
            <button onClick={() => scrollTo("courses")} className="hover:text-foreground transition-colors">Courses</button>
            <button onClick={() => scrollTo("instructor")} className="hover:text-foreground transition-colors">Instructor</button>
            <button onClick={() => scrollTo("testimonials")} className="hover:text-foreground transition-colors">Reviews</button>
            <button onClick={() => scrollTo("faq")} className="hover:text-foreground transition-colors">FAQ</button>
          </div>

          <div className="hidden md:flex items-center gap-2">
            <button
              onClick={() => setShowLogin(true)}
              className="px-4 py-2 rounded-lg border border-border text-sm font-semibold text-muted-foreground hover:text-foreground hover:border-white/20 transition-all"
            >
              Student Login
            </button>
            <button
              onClick={() => scrollTo("courses")}
              className="px-5 py-2 rounded-lg bg-[#4361ee] text-white text-sm font-semibold hover:opacity-90 transition-all shadow-md shadow-[#4361ee]/30"
            >
              View Courses →
            </button>
          </div>

          <button
            className="md:hidden p-2 text-muted-foreground"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {mobileOpen && (
          <div className="md:hidden bg-card border-t border-border px-4 py-4 flex flex-col gap-1">
            {["courses", "instructor", "testimonials", "faq"].map((s) => (
              <button
                key={s}
                onClick={() => scrollTo(s)}
                className="capitalize text-sm text-muted-foreground hover:text-foreground py-2.5 text-left border-b border-border/40 last:border-0"
              >
                {s === "faq" ? "FAQ" : s.charAt(0).toUpperCase() + s.slice(1)}
              </button>
            ))}
            <button
              onClick={() => { setShowLogin(true); setMobileOpen(false); }}
              className="mt-3 w-full py-3 rounded-lg border border-border text-foreground text-sm font-semibold"
            >
              Student Login
            </button>
            <button
              onClick={() => scrollTo("courses")}
              className="mt-2 w-full py-3 rounded-lg bg-[#4361ee] text-white text-sm font-semibold"
            >
              View Courses →
            </button>
          </div>
        )}
      </nav>

      {/* ── Hero ────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden pt-16 sm:pt-24 pb-20 sm:pb-28">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.15]"
          style={{
            backgroundImage: "radial-gradient(circle, rgba(67,97,238,0.5) 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />
        <div className="pointer-events-none absolute top-20 left-1/3 w-[600px] h-[600px] rounded-full bg-[#4361ee]/15 blur-[160px]" />
        <div className="pointer-events-none absolute top-48 right-1/4 w-80 h-80 rounded-full bg-cyan-500/8 blur-[120px]" />

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[#4361ee]/30 bg-[#4361ee]/10 text-xs font-mono text-[#4361ee] mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            New Batch Starting Soon · 5 Courses Available
          </div>

          <h1
            className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.1] mb-5"
            style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
          >
            Learn{" "}
            <GradientText from="#4361ee" to="#3bc9db">
              GCP Data Engineering
            </GradientText>
            <br />
            <span className="text-muted-foreground font-semibold text-3xl sm:text-4xl lg:text-5xl">
              from a Working Architect
            </span>
          </h1>

          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed mb-10">
            Live batches, self-paced recordings, foundation courses, and real-world project
            courses — everything you need to become a job-ready GCP Data Engineer.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center mb-12">
            <button
              onClick={() => scrollTo("courses")}
              className="px-8 py-4 rounded-xl bg-[#4361ee] text-white font-bold text-base hover:opacity-90 active:scale-[0.98] transition-all shadow-xl shadow-[#4361ee]/30"
            >
              Browse All Courses
            </button>
            <button
              onClick={() => scrollTo("instructor")}
              className="px-8 py-4 rounded-xl border border-border text-foreground font-semibold text-base hover:bg-accent transition-all flex items-center gap-2 justify-center"
            >
              <Play className="w-4 h-4 text-[#4361ee]" />
              Meet the Instructor
            </button>
          </div>

          {/* Stats */}
          <div className="flex flex-wrap justify-center gap-6 sm:gap-10 text-sm text-muted-foreground mb-10">
            {[
              { icon: Users, color: "text-[#4361ee]", val: "500+", sub: "Students" },
              { icon: Star, color: "text-yellow-400", val: "4.9/5", sub: "Rating" },
              { icon: Award, color: "text-emerald-400", val: "GCP Certified", sub: "Instructor" },
              { icon: BookOpen, color: "text-cyan-400", val: "5 Courses", sub: "Available" },
            ].map(({ icon: Ic, color, val, sub }) => (
              <div key={val} className="flex items-center gap-2">
                <Ic className={`w-4 h-4 ${color}`} />
                <span>
                  <strong className="text-foreground">{val}</strong> {sub}
                </span>
              </div>
            ))}
          </div>

          {/* Ticker */}
          <div className="flex items-center justify-center gap-4">
            <div className="h-px w-16 bg-border" />
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-card border border-border text-xs text-muted-foreground min-w-[220px] justify-center">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse flex-shrink-0" />
              {TICKER[ticker]}
            </div>
            <div className="h-px w-16 bg-border" />
          </div>
        </div>
      </section>

      {/* ── Courses ─────────────────────────────────────────────── */}
      <section id="courses" className="py-16 sm:py-20 bg-card border-y border-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10">
            <span className="text-xs font-mono text-[#4361ee] tracking-widest uppercase">
              All Courses
            </span>
            <h2
              className="text-2xl sm:text-3xl font-bold mt-2 mb-3"
              style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
            >
              Choose Your Learning Path
            </h2>
            <p className="text-muted-foreground text-sm max-w-xl mx-auto">
              From live instructor-led batches to self-paced recordings and hands-on project
              courses — pick what fits your schedule and goals.
            </p>
          </div>

          {/* Filter tabs */}
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {FILTERS.map(({ label, value }) => (
              <button
                key={value}
                onClick={() => setActiveFilter(value)}
                className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all ${
                  activeFilter === value
                    ? "bg-[#4361ee] text-white shadow-lg shadow-[#4361ee]/30"
                    : "border border-border text-muted-foreground hover:text-foreground hover:border-white/20"
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Payment success banner */}
          {payDone && (
            <div className="mb-6 p-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10 flex flex-col sm:flex-row items-center justify-between gap-3">
              <p className="text-emerald-400 text-sm font-semibold">
                ✓ Enrollment confirmed! Login to access your course recordings.
              </p>
              <button
                onClick={() => { setPayDone(null); setShowLogin(true); }}
                className="px-4 py-2 rounded-lg text-xs font-bold text-white bg-emerald-500 hover:bg-emerald-400 transition-colors flex-shrink-0"
              >
                Login Now →
              </button>
            </div>
          )}

          {/* Course grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {visibleCourses.map((course) => (
              <CourseCard
                key={course.id}
                course={course}
                onViewDetails={setModalCourse}
                onEnroll={handleEnroll}
              />
            ))}
          </div>

          <p className="text-center text-xs text-muted-foreground mt-8">
            More courses coming soon · All prices in INR inclusive of taxes
          </p>
        </div>
      </section>

      {/* ── Instructor ──────────────────────────────────────────── */}
      <section id="instructor" className="py-16 sm:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <span className="text-xs font-mono text-[#4361ee] tracking-widest uppercase">
              Your Instructor
            </span>
            <h2
              className="text-2xl sm:text-3xl font-bold mt-2"
              style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
            >
              Learn From a Working Practitioner
            </h2>
          </div>

          <div className="flex flex-col md:flex-row gap-8 md:gap-12 items-center md:items-start">
            <div className="flex-shrink-0 flex flex-col items-center gap-3">
              <div
                className="w-28 h-28 sm:w-36 sm:h-36 rounded-2xl flex items-center justify-center text-white text-4xl font-bold shadow-2xl shadow-[#4361ee]/30"
                style={{ background: "linear-gradient(135deg, #4361ee 0%, #3bc9db 100%)" }}
              >
                SV
              </div>
              <div className="flex gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                ))}
              </div>
            </div>

            <div className="flex-1 text-center md:text-left">
              <h3
                className="text-xl sm:text-2xl font-bold mb-1"
                style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
              >
                GCP Data Engineering Trainer
              </h3>
              <p className="text-[#4361ee] font-semibold text-sm mb-5">
                Solution Architect · SkillVane IT Academy
              </p>
              <p className="text-muted-foreground text-sm leading-relaxed mb-8 max-w-xl">
                With over 8 years of hands-on experience designing large-scale data pipelines on
                Google Cloud Platform, your instructor has architected solutions for Fortune 500
                enterprises across BFSI, e-commerce, and logistics. As a Google Certified
                Professional Data Engineer and Cloud Architect, they bring real-world war stories,
                battle-tested patterns, and current industry practices into every lesson — no
                filler, no theory-only slides.
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { value: "8+", label: "Years on GCP" },
                  { value: "500+", label: "Students Trained" },
                  { value: "4", label: "GCP Certifications" },
                  { value: "30+", label: "Live Projects" },
                ].map(({ value, label }) => (
                  <div
                    key={label}
                    className="p-3 sm:p-4 rounded-xl bg-card border border-border text-center"
                  >
                    <div
                      className="text-xl sm:text-2xl font-bold text-[#4361ee]"
                      style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                    >
                      {value}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">{label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Testimonials ────────────────────────────────────────── */}
      <section id="testimonials" className="py-16 sm:py-20 bg-card border-y border-border">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <span className="text-xs font-mono text-[#4361ee] tracking-widest uppercase">
              Reviews
            </span>
            <h2
              className="text-2xl sm:text-3xl font-bold mt-2 mb-3"
              style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
            >
              Trusted by Professionals Across India
            </h2>
            <div className="flex items-center justify-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
              ))}
              <span className="ml-2 text-muted-foreground text-sm">4.9 / 5 · 500+ ratings</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {TESTIMONIALS.map((t) => (
              <div
                key={t.name}
                className="p-6 rounded-xl border border-border bg-background hover:border-[#4361ee]/30 transition-colors"
              >
                <div className="flex gap-0.5 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
                <p className="text-muted-foreground text-sm leading-relaxed mb-5">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-xl bg-gradient-to-br ${t.color} flex items-center justify-center text-white text-xs font-bold flex-shrink-0`}
                  >
                    {t.initials}
                  </div>
                  <div>
                    <div
                      className="font-semibold text-sm"
                      style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                    >
                      {t.name}
                    </div>
                    <div className="text-xs text-muted-foreground">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ─────────────────────────────────────────────────── */}
      <section id="faq" className="py-16 sm:py-20">
        <div className="max-w-2xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <span className="text-xs font-mono text-[#4361ee] tracking-widest uppercase">FAQ</span>
            <h2
              className="text-2xl sm:text-3xl font-bold mt-2"
              style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
            >
              Common Questions
            </h2>
          </div>

          <div className="space-y-2">
            {faqs.map((faq, i) => (
              <div key={i} className="border border-border rounded-xl overflow-hidden">
                <button
                  className="w-full flex items-center justify-between p-5 text-left hover:bg-accent/60 transition-colors"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                >
                  <span className="font-semibold text-sm pr-4">{faq.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-muted-foreground flex-shrink-0 transition-transform duration-200 ${
                      openFaq === i ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {openFaq === i && (
                  <div className="px-5 pb-5 border-t border-border/40 bg-card/60">
                    <p className="text-sm text-muted-foreground pt-4 leading-relaxed">{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Footer CTA ──────────────────────────────────────────── */}
      <section className="py-16 border-t border-border bg-card">
        <div className="max-w-xl mx-auto px-4 sm:px-6 text-center">
          <h2
            className="text-2xl sm:text-3xl font-bold mb-3"
            style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
          >
            Start your GCP journey today
          </h2>
          <p className="text-muted-foreground text-sm mb-8">
            5 courses. Live batch, recordings, foundation & projects. One academy, trusted by 500+ professionals.
          </p>
          <button
            onClick={() => scrollTo("courses")}
            className="px-10 py-4 rounded-xl bg-[#4361ee] text-white font-bold text-base hover:opacity-90 transition-all shadow-xl shadow-[#4361ee]/30"
          >
            Browse All Courses →
          </button>
        </div>
      </section>

      {/* ── Footer ──────────────────────────────────────────────── */}
      <footer className="py-8 border-t border-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-[#4361ee] flex items-center justify-center">
              <Cloud className="w-3 h-3 text-white" />
            </div>
            <span
              className="font-bold text-foreground"
              style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
            >
              SkillVane IT Academy
            </span>
          </div>
          <span>© {new Date().getFullYear()} SkillVane IT Academy. All rights reserved.</span>
          <div className="flex gap-5">
            <a href="#" className="hover:text-foreground transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-foreground transition-colors">Terms</a>
            <a href="#" className="hover:text-foreground transition-colors">Contact</a>
          </div>
        </div>
      </footer>

      {/* ── Course Detail Modal ──────────────────────────────────── */}
      {modalCourse && (
        <CourseModal
          course={modalCourse}
          onClose={() => setModalCourse(null)}
          onEnroll={handleEnroll}
        />
      )}
    </div>
  );
}
