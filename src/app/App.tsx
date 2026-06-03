import { useState, useEffect, useRef } from "react";
import { ImageWithFallback } from "@/app/components/figma/ImageWithFallback";
import instructorPhoto from "@/imports/IMG_20260518_113243.jpg.jpeg";
import {
  ChevronDown,
  Star,
  Users,
  Clock,
  Award,
  Check,
  Menu,
  X,
  Shield,
  Zap,
  Database,
  Cloud,
  Play,
  TrendingUp,
  Code2,
  Layers,
  GitBranch,
  Video,
  BookOpen,
  Briefcase,
  Heart,
  ShoppingCart,
  ArrowRight,
  MonitorPlay,
  FileText,
  MessageCircle,
  Mail,
  Phone,
  User,
  Download,
  CheckCircle2,
  Copy,
  LogIn,
  LogOut,
  GraduationCap,
  Lock,
} from "lucide-react";

// ─────────────────────────────────────────────────────────────────
// CONFIG — Update these two values after setup (see guide below)
// ─────────────────────────────────────────────────────────────────
const RAZORPAY_KEY = "rzp_test_SwJJPyvHogi7ki";
const RAZORPAY_KEY_SECRET = "q87loSl5SCo2zQ419F7dm64x";

// Paste your Google Apps Script deployment URL here after setup:
const GOOGLE_SHEET_WEBHOOK_URL =
  "https://script.google.com/macros/s/AKfycbwNJMNfBQKYE4WoXJJDCSqOzJvmRYbx-VqNTYr3BdFpvwcxNiqW3puqQJHsSk30gRKj/exec";

// Paste your EmailJS credentials here after setup:
const EMAILJS_SERVICE_ID = "service_huss9yj";
const EMAILJS_TEMPLATE_ID = "template_jqy6yhj";
const EMAILJS_PUBLIC_KEY = "xC4HlrScSivWvpXtz";

// ─────────────────────────────────────────────────────────────────
// COURSE DATA — Add a new course here and it appears on the site
// ─────────────────────────────────────────────────────────────────
type CourseType = "live" | "recording" | "course" | "project";

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
  curriculum: { module: string; topics: string[] }[];
  tag?: string;
  zoomLink?: string; // For live batch courses
  driveLink?: string; // For recording courses
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
      "Recordings Shared Daily",
      "Comprehensive Material",
      "Resume assistance & career guidance",
      "Live doubt-clearing in every session",
      "Private student community access",
    ],
    curriculum: [
      // ── PASTE YOUR CURRICULUM HERE ──
      // Format: { module: "Module Name", topics: ["Topic 1", "Topic 2"] }
      {
        module: "GCP Cloud Basics",
        topics: [
          "GCP Introduction",
          "GCP Interfaces",
          "GCP Locations",
          "GCP IAM & Admin",
          "Linux Basics on Cloud Shell",
          "Python for Data Engineer",
        ],
      },
      {
        module: "Google Cloud Storage",
        topics: [
          "Cloud Storage Overview",
          "Buckets and Objects",
          "Bucket Management",
          "Data Transfer and Lifecycle Management",
          "Versioning and Object Versioning",
          "Integration with GCP Services",
          "Security and Access Controls",
          "Monitoring and Logging",
        ],
      },
      {
        module: "Cloud SQL",
        topics: [
          "Introduction to Cloud SQL",
          "Creating and Managing Cloud SQL Instances",
          "Database Configuration and Access Control",
          "Connecting using SQL Studio and Workbenches",
          "Import and Export Operations",
          "Backups and High Availability",
          "Database Migration Service (DMS)",
          "End-to-End Database Migration Project",
        ],
      },
      {
        module: "BigQuery (SQL Development)",
        topics: [
          "Introduction to BigQuery",
          "BigQuery Architecture",
          "BigQuery Tables and File Formats",
          "Native and External Tables",
          "SQL Query Optimization",
          "Partitioning and Clustering",
          "Data Loading and Export",
          "Real-time Streaming",
          "BigQuery Views",
          "Integration with GCP Services",
          "Spotify Case Study",
          "Social Media Case Study",
        ],
      },
      {
        module: "DataProc (PySpark Development)",
        topics: [
          "Introduction to Hadoop and Spark",
          "Spark vs MapReduce",
          "PySpark Fundamentals",
          "DataProc Overview",
          "Cluster Creation and Configuration",
          "Running Spark and Hadoop Jobs",
          "Integration with GCS and BigQuery",
          "Job Scheduling and Automation",
          "Employee Travel Records Case Study",
          "End-to-End Batch Pipeline",
        ],
      },
      {
        module: "Databricks on GCP",
        topics: [
          "Lakehouse Platform Overview",
          "Databricks Architecture",
          "Workspace Administration",
          "Delta Lake",
          "Unity Catalog",
          "Notebooks and Clusters",
          "Spark SQL and Python",
          "Performance Optimization",
          "Incremental Data Processing",
          "Delta Live Tables",
          "End-to-End Workflow Case Study",
        ],
      },
      {
        module: "DataFlow (Apache Beam Development)",
        topics: [
          "Introduction to DataFlow",
          "Spark vs Apache Beam",
          "DataFlow vs DataProc",
          "Building Apache Beam Pipelines",
          "Batch and Stream Processing",
          "Windowing Concepts",
          "Integration with GCP Services",
          "Streaming Pipeline Project",
          "Template-based Pipelines",
        ],
      },
      {
        module: "Cloud Pub/Sub",
        topics: [
          "Introduction to Pub/Sub",
          "Topics and Subscriptions",
          "Publishing and Consuming Messages",
          "Message Retention and Acknowledgements",
          "Integration with Cloud Functions",
          "Integration with Dataflow",
          "Streaming Use Cases",
        ],
      },
      {
        module: "Cloud Composer (Airflow DAG Creation)",
        topics: [
          "Introduction to Composer and Airflow",
          "Airflow Architecture",
          "Workflow Creation and Scheduling",
          "Workflow Monitoring",
          "Integration with BigQuery and DataFlow",
          "Error Handling and Troubleshooting",
          "BigQuery DAGs",
          "DataProc DAGs",
          "DataFlow DAGs",
          "CI/CD with Cloud Build and GitHub",
        ],
      },
      {
        module: "Data Fusion",
        topics: [
          "Introduction to Data Fusion",
          "Building ETL Pipelines",
          "Visual Pipeline Design",
          "Transformations and Sinks",
          "Pre-built Templates",
          "Integration with BigQuery and GCS",
          "End-to-End Data Fusion Pipeline",
        ],
      },
      {
        module: "Cloud Functions",
        topics: [
          "Cloud Functions Introduction",
          "Event-driven Architecture",
          "Deploying Cloud Functions",
          "HTTP Triggers",
          "Pub/Sub Triggers",
          "Cloud Storage Triggers",
          "Monitoring and Logging",
          "GCS to BigQuery Automation Use Case",
        ],
      },
      {
        module: "Terraform",
        topics: [
          "Terraform Introduction",
          "Terraform Installation and Setup",
          "Infrastructure Provisioning",
          "Terraform Commands",
          "Creating GCP Resources",
          "Provisioning GCS Buckets",
          "Provisioning Dataproc Clusters",
          "Provisioning BigQuery Resources",
        ],
      },
    ],
    zoomLink: "https://meet.google.com/tvb-vzfp-qpm", // Add your Zoom meeting link here
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
    price: 1,
    originalPrice: 12000,
    highlights: [
      "Latest batch recordings (full course)",
      "Watch at your own pace, anytime",
      "Same curriculum as the live batch",
      "1 year access to all recordings",
      "Notes included with every module",
      "Community access for doubt resolution",
    ],
    curriculum: [
      // ── PASTE YOUR CURRICULUM HERE ──
      {
        module: "GCP Cloud Basics",
        topics: [
          "GCP Introduction",
          "GCP Interfaces",
          "GCP Locations",
          "GCP IAM & Admin",
          "Linux Basics on Cloud Shell",
          "Python for Data Engineer",
        ],
      },
      {
        module: "Google Cloud Storage",
        topics: [
          "Cloud Storage Overview",
          "Buckets and Objects",
          "Bucket Management",
          "Data Transfer and Lifecycle Management",
          "Versioning and Object Versioning",
          "Integration with GCP Services",
          "Security and Access Controls",
          "Monitoring and Logging",
        ],
      },
      {
        module: "Cloud SQL",
        topics: [
          "Introduction to Cloud SQL",
          "Creating and Managing Cloud SQL Instances",
          "Database Configuration and Access Control",
          "Connecting using SQL Studio and Workbenches",
          "Import and Export Operations",
          "Backups and High Availability",
          "Database Migration Service (DMS)",
          "End-to-End Database Migration Project",
        ],
      },
      {
        module: "BigQuery (SQL Development)",
        topics: [
          "Introduction to BigQuery",
          "BigQuery Architecture",
          "BigQuery Tables and File Formats",
          "Native and External Tables",
          "SQL Query Optimization",
          "Partitioning and Clustering",
          "Data Loading and Export",
          "Real-time Streaming",
          "BigQuery Views",
          "Integration with GCP Services",
          "Spotify Case Study",
          "Social Media Case Study",
        ],
      },
      {
        module: "DataProc (PySpark Development)",
        topics: [
          "Introduction to Hadoop and Spark",
          "Spark vs MapReduce",
          "PySpark Fundamentals",
          "DataProc Overview",
          "Cluster Creation and Configuration",
          "Running Spark and Hadoop Jobs",
          "Integration with GCS and BigQuery",
          "Job Scheduling and Automation",
          "Employee Travel Records Case Study",
          "End-to-End Batch Pipeline",
        ],
      },
      {
        module: "Databricks on GCP",
        topics: [
          "Lakehouse Platform Overview",
          "Databricks Architecture",
          "Workspace Administration",
          "Delta Lake",
          "Unity Catalog",
          "Notebooks and Clusters",
          "Spark SQL and Python",
          "Performance Optimization",
          "Incremental Data Processing",
          "Delta Live Tables",
          "End-to-End Workflow Case Study",
        ],
      },
      {
        module: "DataFlow (Apache Beam Development)",
        topics: [
          "Introduction to DataFlow",
          "Spark vs Apache Beam",
          "DataFlow vs DataProc",
          "Building Apache Beam Pipelines",
          "Batch and Stream Processing",
          "Windowing Concepts",
          "Integration with GCP Services",
          "Streaming Pipeline Project",
          "Template-based Pipelines",
        ],
      },
      {
        module: "Cloud Pub/Sub",
        topics: [
          "Introduction to Pub/Sub",
          "Topics and Subscriptions",
          "Publishing and Consuming Messages",
          "Message Retention and Acknowledgements",
          "Integration with Cloud Functions",
          "Integration with Dataflow",
          "Streaming Use Cases",
        ],
      },
      {
        module: "Cloud Composer (Airflow DAG Creation)",
        topics: [
          "Introduction to Composer and Airflow",
          "Airflow Architecture",
          "Workflow Creation and Scheduling",
          "Workflow Monitoring",
          "Integration with BigQuery and DataFlow",
          "Error Handling and Troubleshooting",
          "BigQuery DAGs",
          "DataProc DAGs",
          "DataFlow DAGs",
          "CI/CD with Cloud Build and GitHub",
        ],
      },
      {
        module: "Data Fusion",
        topics: [
          "Introduction to Data Fusion",
          "Building ETL Pipelines",
          "Visual Pipeline Design",
          "Transformations and Sinks",
          "Pre-built Templates",
          "Integration with BigQuery and GCS",
          "End-to-End Data Fusion Pipeline",
        ],
      },
      {
        module: "Cloud Functions",
        topics: [
          "Cloud Functions Introduction",
          "Event-driven Architecture",
          "Deploying Cloud Functions",
          "HTTP Triggers",
          "Pub/Sub Triggers",
          "Cloud Storage Triggers",
          "Monitoring and Logging",
          "GCS to BigQuery Automation Use Case",
        ],
      },
      {
        module: "Terraform",
        topics: [
          "Terraform Introduction",
          "Terraform Installation and Setup",
          "Infrastructure Provisioning",
          "Terraform Commands",
          "Creating GCP Resources",
          "Provisioning GCS Buckets",
          "Provisioning Dataproc Clusters",
          "Provisioning BigQuery Resources",
        ],
      },
    ],
    driveLink:
      "https://drive.google.com/drive/folders/1VsxvQYeTeCd1WuDxeDHJ3iQ-HUd9wS-h?usp=drive_link", // Add your Google Drive folder link here
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
      "File handling, I/O operations",
      "Exceptional Handling",
      "Beginner-friendly, no prior coding needed",
    ],
    curriculum: [
      {
        module: "Module 1: Data Types",
        topics: [
          "Strings",
          "Operators",
          "Numbers (Int, Float)",
          "Booleans",
          "None",
        ],
      },
      {
        module: "Module 2: Data Structures",
        topics: ["Lists", "Tuples", "Dictionaries", "Sets"],
      },
      {
        module: "Module 3: Python Programming Constructs",
        topics: [
          "if, elif, else statements",
          "for loops and while loops",
          "Exception Handling",
          "File I/O Operations",
        ],
      },
      {
        module: "Module 4: Modular Programming in Python",
        topics: [
          "Functions",
          "Lambda Functions",
          "Classes",
          "Modules and Packages",
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
      // ── PASTE YOUR CURRICULUM HERE ──
      {
        module: "Project Overview & Architecture",
        topics: [
          "Healthcare Data Landscape on GCP",
          "Solution Architecture Design",
          "GCP Services Selection & Setup",
        ],
      },
      {
        module: "Data Ingestion Pipeline",
        topics: [
          "Ingesting HL7/FHIR Healthcare Records",
          "Pub/Sub → Dataflow Streaming Ingestion",
          "Raw Layer Design in Cloud Storage",
        ],
      },
      {
        module: "Transformation & Serving",
        topics: [
          "Data Cleansing & Transformation with Dataflow",
          "BigQuery Schema Design for Healthcare",
          "Looker Studio Dashboard for Analytics",
        ],
      },
      {
        module: "Orchestration & Monitoring",
        topics: [
          "Airflow DAG for End-to-End Orchestration",
          "Cloud Monitoring & Alerting Setup",
          "Final Code Review & Portfolio Prep",
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
      // ── PASTE YOUR CURRICULUM HERE ──
      {
        module: "Project Overview & Architecture",
        topics: [
          "Retail Data Engineering Challenges",
          "Solution Architecture on GCP",
          "Dataset Walkthrough: Orders, Inventory, Customers",
        ],
      },
      {
        module: "Batch Ingestion Pipeline",
        topics: [
          "Loading Retail Data from GCS to BigQuery",
          "Dataproc Spark Transformations",
          "Slowly Changing Dimensions (SCD) Design",
        ],
      },
      {
        module: "Streaming & Real-Time Analytics",
        topics: [
          "Pub/Sub → Dataflow for Live Order Events",
          "Real-Time Sales Dashboard in Looker Studio",
          "Alerting on Inventory Threshold Breaches",
        ],
      },
      {
        module: "Orchestration & Delivery",
        topics: [
          "Airflow DAG for Full Pipeline Orchestration",
          "Data Quality Checks & Validation",
          "Final Code Review & Portfolio Prep",
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
  const [openModule, setOpenModule] = useState<number | null>(
    0,
  );
  const Icon = course.icon;

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handler);
    return () =>
      document.removeEventListener("keydown", handler);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

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
                style={{
                  fontFamily: "'Outfit', system-ui, sans-serif",
                }}
              >
                {course.title}
              </h2>
              <p className="text-xs text-white/50">
                {course.subtitle}
              </p>
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
                  style={{
                    fontFamily:
                      "'Outfit', system-ui, sans-serif",
                  }}
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
                  Save{" "}
                  {formatINR(
                    course.originalPrice - course.price,
                  )}
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
              style={{
                fontFamily: "'Outfit', system-ui, sans-serif",
              }}
            >
              What&apos;s Included
            </h3>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {course.highlights.map((h) => (
                <li
                  key={h}
                  className="flex items-start gap-2.5 text-sm text-white/70"
                >
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
              style={{
                fontFamily: "'Outfit', system-ui, sans-serif",
              }}
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
                    onClick={() =>
                      setOpenModule(openModule === i ? null : i)
                    }
                  >
                    <span className="text-sm font-semibold text-white/90">
                      {mod.module}
                    </span>
                    <ChevronDown
                      className={`w-4 h-4 text-white/40 flex-shrink-0 transition-transform duration-200 ${
                        openModule === i ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  {openModule === i && (
                    <ul className="px-4 pb-3 border-t border-white/5 space-y-2 pt-3">
                      {mod.topics.map((t) => (
                        <li
                          key={t}
                          className="flex items-start gap-2.5 text-sm text-white/55"
                        >
                          <Check className="w-3.5 h-3.5 text-emerald-400 mt-0.5 flex-shrink-0" />
                          {t}
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
        <div className="flex-shrink-0 px-5 sm:px-6 py-4 border-t border-white/8 bg-[#080d1a] space-y-3">
          {/* Access Link - Zoom for Live, Drive for Recordings */}
          {(course.zoomLink || course.driveLink) && (
            <a
              href={course.zoomLink || course.driveLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl text-sm font-semibold bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-500/30 text-emerald-400 hover:from-emerald-500/20 hover:to-teal-500/20 hover:border-emerald-500/50 transition-all"
            >
              {course.type === "live" ? (
                <>
                  <Video className="w-4 h-4" />
                  Join Zoom Class
                </>
              ) : (
                <>
                  <Play className="w-4 h-4" />
                  Access Course Recordings
                </>
              )}
            </a>
          )}

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
            Secure payment via Razorpay · UPI · Net Banking ·
            Cards · EMI
          </p>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────
interface StudentDetails {
  name: string;
  email: string;
  phone: string;
}

interface LoggedInStudent {
  email: string;
  name: string;
  enrolledCourses: string[]; // Array of course IDs
}

interface EnrollmentRecord {
  invoiceNo: string;
  paymentId: string;
  student: StudentDetails;
  course: Course;
  paidAt: Date;
}

// ─────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────
function generateInvoiceNo() {
  const d = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  return `SV-${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}-${Math.floor(1000 + Math.random() * 9000)}`;
}

async function loadRazorpay(): Promise<void> {
  return new Promise((resolve, reject) => {
    if ((window as any).Razorpay) {
      resolve();
      return;
    }
    const s = document.createElement("script");
    s.src = "https://checkout.razorpay.com/v1/checkout.js";
    s.async = true;
    s.onload = () => {
      if ((window as any).Razorpay) {
        resolve();
      } else {
        reject(new Error("Razorpay SDK failed to initialize"));
      }
    };
    s.onerror = () =>
      reject(new Error("Failed to load Razorpay SDK"));
    document.head.appendChild(s);
  });
}

async function loadEmailJs(): Promise<void> {
  return new Promise((resolve, reject) => {
    if ((window as any).emailjs) {
      resolve();
      return;
    }
    const s = document.createElement("script");
    s.src =
      "https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js";
    s.onload = () => resolve();
    s.onerror = () => reject(new Error("EmailJS not loaded"));
    document.body.appendChild(s);
  });
}

async function saveToGoogleSheet(record: EnrollmentRecord) {
  if (
    GOOGLE_SHEET_WEBHOOK_URL === "YOUR_GOOGLE_APPS_SCRIPT_URL"
  )
    return;
  await fetch(GOOGLE_SHEET_WEBHOOK_URL, {
    method: "POST",
    mode: "no-cors",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      invoice_no: record.invoiceNo,
      payment_id: record.paymentId,
      name: record.student.name,
      email: record.student.email,
      phone: record.student.phone,
      course: record.course.title,
      course_type: record.course.subtitle,
      amount: record.course.price,
      paid_at: record.paidAt.toISOString(),
    }),
  });
}

async function sendInvoiceEmail(record: EnrollmentRecord) {
  if (EMAILJS_SERVICE_ID === "YOUR_EMAILJS_SERVICE_ID") return;
  await loadEmailJs();
  const ejs = (window as any).emailjs;
  ejs.init({ publicKey: EMAILJS_PUBLIC_KEY });
  await ejs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
    to_name: record.student.name,
    to_email: record.student.email,
    invoice_no: record.invoiceNo,
    payment_id: record.paymentId,
    course_name: `${record.course.title} — ${record.course.subtitle}`,
    amount: `₹${record.course.price.toLocaleString("en-IN")}`,
    paid_at: record.paidAt.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }),
    academy_name: "SkillVane IT Academy",
  });
}

// ─────────────────────────────────────────────────────────────────
// Login/Signup Modal
// ─────────────────────────────────────────────────────────────────
function LoginModal({
  onClose,
  onLogin,
}: {
  onClose: () => void;
  onLogin: (student: LoggedInStudent) => void;
}) {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [form, setForm] = useState({
    email: "",
    password: "",
    name: "",
    phone: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>(
    {},
  );
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const e: Record<string, string> = {};
    if (
      !form.email ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)
    )
      e.email = "Valid email is required";
    if (!form.password || form.password.length < 6)
      e.password = "Password must be at least 6 characters";
    if (mode === "signup") {
      if (!form.name.trim()) e.name = "Name is required";
      if (!form.phone || !/^[6-9]\d{9}$/.test(form.phone))
        e.phone = "Valid 10-digit mobile number required";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Get existing students from localStorage
      const studentsData = localStorage.getItem(
        "skillvane_students",
      );
      const students: Record<string, any> = studentsData
        ? JSON.parse(studentsData)
        : {};

      if (mode === "signup") {
        // Check if user already exists
        if (students[form.email]) {
          setErrors({
            email: "Email already registered. Please login.",
          });
          setLoading(false);
          return;
        }

        // Create new student account
        students[form.email] = {
          email: form.email,
          name: form.name,
          phone: form.phone,
          password: form.password, // In production, hash this!
          enrolledCourses: [],
          createdAt: new Date().toISOString(),
        };
        localStorage.setItem(
          "skillvane_students",
          JSON.stringify(students),
        );

        // Auto-login after signup
        const loggedStudent: LoggedInStudent = {
          email: form.email,
          name: form.name,
          enrolledCourses: [],
        };
        localStorage.setItem(
          "skillvane_current_student",
          JSON.stringify(loggedStudent),
        );
        onLogin(loggedStudent);
      } else {
        // Login
        const student = students[form.email];
        if (!student || student.password !== form.password) {
          setErrors({ password: "Invalid email or password" });
          setLoading(false);
          return;
        }

        const loggedStudent: LoggedInStudent = {
          email: student.email,
          name: student.name,
          enrolledCourses: student.enrolledCourses || [],
        };
        localStorage.setItem(
          "skillvane_current_student",
          JSON.stringify(loggedStudent),
        );
        onLogin(loggedStudent);
      }
    } catch (error) {
      setErrors({
        general: "Something went wrong. Please try again.",
      });
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative w-full sm:max-w-md bg-card rounded-t-2xl sm:rounded-2xl border border-border shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 flex items-center justify-between border-b border-border bg-gradient-to-r from-primary/10 to-secondary/10">
          <div>
            <h2
              className="font-bold text-white text-lg"
              style={{
                fontFamily:
                  "'Space Grotesk', system-ui, sans-serif",
              }}
            >
              {mode === "login"
                ? "Welcome Back"
                : "Create Account"}
            </h2>
            <p className="text-xs text-muted-foreground">
              {mode === "login"
                ? "Login to access your courses"
                : "Sign up to get started"}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-white/10 text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="px-6 py-6 space-y-4"
        >
          {errors.general && (
            <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/30 text-destructive text-sm">
              {errors.general}
            </div>
          )}

          {mode === "signup" && (
            <div>
              <label className="block text-sm font-semibold text-foreground mb-1.5">
                Full Name
              </label>
              <input
                value={form.name}
                onChange={(e) =>
                  setForm({ ...form, name: e.target.value })
                }
                placeholder="Enter your full name"
                className="w-full bg-muted border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary/60 transition-all"
              />
              {errors.name && (
                <p className="text-xs text-destructive mt-1">
                  {errors.name}
                </p>
              )}
            </div>
          )}

          <div>
            <label className="block text-sm font-semibold text-foreground mb-1.5">
              Email
            </label>
            <input
              type="email"
              value={form.email}
              onChange={(e) =>
                setForm({ ...form, email: e.target.value })
              }
              placeholder="your.email@example.com"
              className="w-full bg-muted border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary/60 transition-all"
            />
            {errors.email && (
              <p className="text-xs text-destructive mt-1">
                {errors.email}
              </p>
            )}
          </div>

          {mode === "signup" && (
            <div>
              <label className="block text-sm font-semibold text-foreground mb-1.5">
                Phone
              </label>
              <input
                type="tel"
                value={form.phone}
                onChange={(e) =>
                  setForm({ ...form, phone: e.target.value })
                }
                placeholder="10-digit mobile number"
                className="w-full bg-muted border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary/60 transition-all"
              />
              {errors.phone && (
                <p className="text-xs text-destructive mt-1">
                  {errors.phone}
                </p>
              )}
            </div>
          )}

          <div>
            <label className="block text-sm font-semibold text-foreground mb-1.5">
              Password
            </label>
            <input
              type="password"
              value={form.password}
              onChange={(e) =>
                setForm({ ...form, password: e.target.value })
              }
              placeholder={
                mode === "login"
                  ? "Enter your password"
                  : "Create a password (min 6 chars)"
              }
              className="w-full bg-muted border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary/60 transition-all"
            />
            {errors.password && (
              <p className="text-xs text-destructive mt-1">
                {errors.password}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-primary to-secondary text-white font-bold text-sm hover:shadow-xl hover:shadow-primary/40 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {loading
              ? "Please wait..."
              : mode === "login"
                ? "Login"
                : "Sign Up"}
          </button>

          <div className="text-center">
            <button
              type="button"
              onClick={() => {
                setMode(mode === "login" ? "signup" : "login");
                setErrors({});
              }}
              className="text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              {mode === "login"
                ? "Don't have an account? Sign up"
                : "Already have an account? Login"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
// Student Dashboard
// ─────────────────────────────────────────────────────────────────
function StudentDashboard({
  student,
  courses,
  onLogout,
  onClose,
}: {
  student: LoggedInStudent;
  courses: Course[];
  onLogout: () => void;
  onClose: () => void;
}) {
  const enrolledCourses = courses.filter((c) =>
    student.enrolledCourses.includes(c.id),
  );

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative w-full sm:max-w-4xl max-h-[92dvh] sm:max-h-[85vh] flex flex-col bg-card rounded-t-2xl sm:rounded-2xl border border-border shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-6 py-5 flex items-center justify-between border-b border-border bg-gradient-to-r from-primary/10 to-secondary/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2
                className="font-bold text-white text-lg"
                style={{
                  fontFamily:
                    "'Space Grotesk', system-ui, sans-serif",
                }}
              >
                My Dashboard
              </h2>
              <p className="text-xs text-muted-foreground">
                Welcome back, {student.name}!
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onLogout}
              className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border text-muted-foreground hover:text-foreground hover:border-primary/30 transition-all text-sm font-semibold"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-white/10 text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="overflow-y-auto flex-1 px-6 py-6">
          <div className="mb-6">
            <h3
              className="text-xl font-bold text-foreground mb-2"
              style={{
                fontFamily:
                  "'Space Grotesk', system-ui, sans-serif",
              }}
            >
              Your Enrolled Courses
            </h3>
            <p className="text-sm text-muted-foreground">
              {enrolledCourses.length > 0
                ? `You have access to ${enrolledCourses.length} course${enrolledCourses.length > 1 ? "s" : ""}`
                : "You haven't enrolled in any courses yet"}
            </p>
          </div>

          {enrolledCourses.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                <BookOpen className="w-8 h-8 text-muted-foreground" />
              </div>
              <p className="text-foreground font-semibold mb-2">
                No courses yet
              </p>
              <p className="text-sm text-muted-foreground mb-4">
                Enroll in a course to get started
              </p>
              <button
                onClick={onClose}
                className="px-6 py-2 rounded-lg bg-gradient-to-r from-primary to-secondary text-white font-semibold text-sm hover:shadow-lg transition-all"
              >
                Browse Courses
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {enrolledCourses.map((course) => {
                const Icon = course.icon;
                return (
                  <div
                    key={course.id}
                    className="group relative p-5 rounded-2xl border border-border bg-gradient-to-br from-card to-muted/30 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/10 transition-all"
                  >
                    {/* Course Header */}
                    <div className="flex items-start gap-3 mb-4">
                      <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                        style={{
                          background: `linear-gradient(135deg, ${course.accentFrom}25 0%, ${course.accentTo}15 100%)`,
                          border: `1.5px solid ${course.accentFrom}50`,
                        }}
                      >
                        <Icon
                          className="w-6 h-6"
                          style={{ color: course.accentFrom }}
                        />
                      </div>
                      <div className="flex-1">
                        <span
                          className="text-[10px] font-mono font-bold tracking-widest px-2 py-0.5 rounded-full border"
                          style={{
                            color: course.accentFrom,
                            borderColor: `${course.accentFrom}50`,
                            background: `${course.accentFrom}15`,
                          }}
                        >
                          {course.badge}
                        </span>
                        <h4
                          className="text-lg font-bold text-foreground mt-2"
                          style={{
                            fontFamily:
                              "'Space Grotesk', system-ui, sans-serif",
                          }}
                        >
                          {course.title}
                        </h4>
                        <p className="text-xs text-muted-foreground">
                          {course.subtitle}
                        </p>
                      </div>
                    </div>

                    {/* Access Links */}
                    {(course.zoomLink || course.driveLink) && (
                      <div className="space-y-2 mb-4">
                        <a
                          href={
                            course.zoomLink || course.driveLink
                          }
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl text-sm font-semibold bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-500/30 text-emerald-400 hover:from-emerald-500/20 hover:to-teal-500/20 hover:border-emerald-500/50 transition-all"
                        >
                          {course.type === "live" ? (
                            <>
                              <Video className="w-4 h-4" />
                              Join Zoom Class
                            </>
                          ) : (
                            <>
                              <Play className="w-4 h-4" />
                              Access Recordings
                            </>
                          )}
                        </a>
                      </div>
                    )}

                    {/* Course Info */}
                    <div className="flex flex-wrap gap-2">
                      {course.duration && (
                        <span className="flex items-center gap-1 text-xs text-muted-foreground bg-muted/50 px-2 py-1 rounded-full">
                          <Clock className="w-3 h-3" />
                          {course.duration}
                        </span>
                      )}
                      {course.timings && (
                        <span className="flex items-center gap-1 text-xs text-muted-foreground bg-muted/50 px-2 py-1 rounded-full">
                          <MonitorPlay className="w-3 h-3" />
                          Live
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
// Enrollment Form Modal
// ─────────────────────────────────────────────────────────────────
function EnrollmentFormModal({
  course,
  onClose,
  onSubmit,
}: {
  course: Course;
  onClose: () => void;
  onSubmit: (student: StudentDetails) => void;
}) {
  const [form, setForm] = useState<StudentDetails>({
    name: "",
    email: "",
    phone: "",
  });
  const [errors, setErrors] = useState<Partial<StudentDetails>>(
    {},
  );
  const nameRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    nameRef.current?.focus();
  }, []);

  const validate = () => {
    const e: Partial<StudentDetails> = {};
    if (!form.name.trim()) e.name = "Full name is required";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      e.email = "Valid email is required";
    if (!/^[6-9]\d{9}$/.test(form.phone))
      e.phone = "Valid 10-digit mobile number required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) onSubmit(form);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative w-full sm:max-w-md bg-[#0f1526] rounded-t-2xl sm:rounded-2xl border border-white/10 shadow-2xl overflow-hidden">
        {/* Header */}
        <div
          className="px-6 py-4 flex items-center justify-between border-b border-white/8"
          style={{
            background: `linear-gradient(135deg, ${course.accentFrom}22, ${course.accentTo}11)`,
          }}
        >
          <div>
            <p
              className="text-xs font-mono uppercase tracking-widest mb-0.5"
              style={{ color: course.accentFrom }}
            >
              Step 1 of 2 — Your Details
            </p>
            <h2
              className="font-bold text-white text-base"
              style={{
                fontFamily: "'Outfit', system-ui, sans-serif",
              }}
            >
              {course.title}
            </h2>
            <p className="text-xs text-white/40">
              {course.subtitle} · ₹
              {course.price.toLocaleString("en-IN")}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-white/10 text-white/50 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="px-6 py-6 space-y-4"
        >
          {/* Name */}
          <div>
            <label className="block text-xs font-semibold text-white/70 mb-1.5">
              Full Name *
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
              <input
                ref={nameRef}
                value={form.name}
                onChange={(e) =>
                  setForm({ ...form, name: e.target.value })
                }
                placeholder="Enter your full name"
                className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-white/25 focus:outline-none focus:border-[#4361ee]/60 focus:bg-white/8 transition-all"
              />
            </div>
            {errors.name && (
              <p className="text-xs text-red-400 mt-1">
                {errors.name}
              </p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-xs font-semibold text-white/70 mb-1.5">
              Email Address *{" "}
              <span className="text-white/30 font-normal">
                (invoice will be sent here)
              </span>
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
              <input
                type="email"
                value={form.email}
                onChange={(e) =>
                  setForm({ ...form, email: e.target.value })
                }
                placeholder="you@example.com"
                className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-white/25 focus:outline-none focus:border-[#4361ee]/60 focus:bg-white/8 transition-all"
              />
            </div>
            {errors.email && (
              <p className="text-xs text-red-400 mt-1">
                {errors.email}
              </p>
            )}
          </div>

          {/* Phone */}
          <div>
            <label className="block text-xs font-semibold text-white/70 mb-1.5">
              Mobile Number *{" "}
              <span className="text-white/30 font-normal">
                (10 digits, Indian)
              </span>
            </label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
              <div className="absolute left-9 top-1/2 -translate-y-1/2 text-sm text-white/40 border-r border-white/10 pr-2.5">
                +91
              </div>
              <input
                type="tel"
                value={form.phone}
                onChange={(e) =>
                  setForm({
                    ...form,
                    phone: e.target.value
                      .replace(/\D/g, "")
                      .slice(0, 10),
                  })
                }
                placeholder="9876543210"
                className="w-full bg-white/5 border border-white/10 rounded-xl pl-20 pr-4 py-3 text-sm text-white placeholder-white/25 focus:outline-none focus:border-[#4361ee]/60 focus:bg-white/8 transition-all"
              />
            </div>
            {errors.phone && (
              <p className="text-xs text-red-400 mt-1">
                {errors.phone}
              </p>
            )}
          </div>

          <p className="text-xs text-white/30 leading-relaxed">
            Your details are used only for sending your course
            access and invoice. We do not share your
            information.
          </p>

          <button
            type="submit"
            className="w-full py-3.5 rounded-xl font-bold text-sm text-white hover:opacity-90 transition-all shadow-lg"
            style={{
              background: `linear-gradient(135deg, ${course.accentFrom}, ${course.accentTo})`,
              boxShadow: `0 8px 24px ${course.accentFrom}40`,
            }}
          >
            Continue to Payment →
          </button>
        </form>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
// Invoice Modal
// ─────────────────────────────────────────────────────────────────
function InvoiceModal({
  record,
  onClose,
}: {
  record: EnrollmentRecord;
  onClose: () => void;
}) {
  const [copied, setCopied] = useState(false);
  const [emailSent, setEmailSent] = useState<boolean | null>(
    null,
  );

  useEffect(() => {
    (async () => {
      try {
        await Promise.all([
          saveToGoogleSheet(record),
          sendInvoiceEmail(record),
        ]);
        setEmailSent(true);
      } catch {
        setEmailSent(false);
      }
    })();
  }, [record]);

  const copyPaymentId = () => {
    navigator.clipboard.writeText(record.paymentId).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative w-full sm:max-w-lg bg-[#0f1526] rounded-t-2xl sm:rounded-2xl border border-emerald-500/30 shadow-2xl overflow-hidden">
        {/* Success header */}
        <div className="px-6 pt-8 pb-6 text-center border-b border-white/8 bg-emerald-500/5">
          <div className="w-14 h-14 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-8 h-8 text-emerald-400" />
          </div>
          <h2
            className="text-xl font-bold text-white mb-1"
            style={{
              fontFamily: "'Outfit', system-ui, sans-serif",
            }}
          >
            Enrollment Successful!
          </h2>
          <p className="text-sm text-white/50">
            Welcome to SkillVane IT Academy,{" "}
            {record.student.name.split(" ")[0]}!
          </p>
          {emailSent === true && (
            <div className="mt-3 inline-flex items-center gap-1.5 text-xs text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-full">
              <Mail className="w-3.5 h-3.5" /> Invoice sent to{" "}
              {record.student.email}
            </div>
          )}
          {emailSent === false && (
            <div className="mt-3 inline-flex items-center gap-1.5 text-xs text-yellow-400 bg-yellow-500/10 px-3 py-1.5 rounded-full">
              Invoice email setup pending — see guide below
            </div>
          )}
        </div>

        {/* Invoice body */}
        <div className="px-6 py-5 space-y-4">
          {/* Invoice number */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-white/4 border border-white/8">
            <div>
              <p className="text-xs text-white/40 mb-0.5">
                Invoice Number
              </p>
              <p className="font-mono font-bold text-white text-sm">
                {record.invoiceNo}
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs text-white/40 mb-0.5">
                Date & Time
              </p>
              <p className="text-xs text-white/70">
                {record.paidAt.toLocaleDateString("en-IN", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })}
                ,{" "}
                {record.paidAt.toLocaleTimeString("en-IN", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
          </div>

          {/* Student + Course */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 rounded-xl bg-white/4 border border-white/8">
              <p className="text-xs text-white/40 mb-1">
                Student
              </p>
              <p className="text-sm font-semibold text-white">
                {record.student.name}
              </p>
              <p className="text-xs text-white/50 mt-0.5">
                {record.student.email}
              </p>
              <p className="text-xs text-white/50">
                +91 {record.student.phone}
              </p>
            </div>
            <div className="p-3 rounded-xl bg-white/4 border border-white/8">
              <p className="text-xs text-white/40 mb-1">
                Course Enrolled
              </p>
              <p className="text-sm font-semibold text-white">
                {record.course.title}
              </p>
              <p className="text-xs text-white/50 mt-0.5">
                {record.course.subtitle}
              </p>
              <p className="text-xs font-bold text-emerald-400 mt-1">
                ₹{record.course.price.toLocaleString("en-IN")}{" "}
                paid
              </p>
            </div>
          </div>

          {/* Payment ID */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-white/4 border border-white/8">
            <div>
              <p className="text-xs text-white/40 mb-0.5">
                Razorpay Payment ID
              </p>
              <p className="font-mono text-xs text-white/80">
                {record.paymentId}
              </p>
            </div>
            <button
              onClick={copyPaymentId}
              className="flex items-center gap-1.5 text-xs text-white/50 hover:text-white px-2.5 py-1.5 rounded-lg hover:bg-white/8 transition-all"
            >
              {copied ? (
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              ) : (
                <Copy className="w-3.5 h-3.5" />
              )}
              {copied ? "Copied!" : "Copy"}
            </button>
          </div>

          <p className="text-xs text-white/30 text-center">
            Please save your Payment ID for any refund or
            support requests.
          </p>
        </div>

        <div className="px-6 pb-6">
          <button
            onClick={onClose}
            className="w-full py-3 rounded-xl border border-white/15 text-white/70 hover:bg-white/5 hover:text-white font-semibold text-sm transition-all"
          >
            Close
          </button>
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
    <div className="group relative flex flex-col rounded-2xl border border-border bg-card overflow-hidden hover:border-primary/40 hover:shadow-2xl hover:shadow-primary/20 hover:-translate-y-2 transition-all duration-300">
      {/* Accent top bar */}
      <div
        className="h-1.5 w-full"
        style={{
          background: `linear-gradient(90deg, ${course.accentFrom} 0%, ${course.accentTo} 100%)`,
        }}
      />

      {/* Hover gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      {/* Tag */}
      {course.tag && (
        <div
          className="absolute top-5 right-5 text-[10px] font-bold px-3 py-1.5 rounded-full text-white shadow-lg z-10"
          style={{
            background: `linear-gradient(135deg, ${course.accentFrom}, ${course.accentTo})`,
          }}
        >
          {course.tag}
        </div>
      )}

      <div className="p-5 sm:p-6 flex flex-col flex-1">
        {/* Icon + badge */}
        <div className="flex items-center gap-3 mb-4 relative z-10">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md group-hover:scale-110 transition-transform duration-300"
            style={{
              background: `linear-gradient(135deg, ${course.accentFrom}25 0%, ${course.accentTo}15 100%)`,
              border: `1.5px solid ${course.accentFrom}50`,
            }}
          >
            <Icon
              className="w-6 h-6"
              style={{ color: course.accentFrom }}
            />
          </div>
          <span
            className="text-[10px] font-mono font-bold tracking-widest px-2.5 py-1 rounded-full border"
            style={{
              color: course.accentFrom,
              borderColor: `${course.accentFrom}50`,
              background: `${course.accentFrom}15`,
            }}
          >
            {course.badge}
          </span>
        </div>

        {/* Title */}
        <h3
          className="text-xl font-bold text-foreground leading-tight mb-1 relative z-10 group-hover:text-primary transition-colors duration-300"
          style={{
            fontFamily:
              "'Space Grotesk', system-ui, sans-serif",
          }}
        >
          {course.title}
        </h3>
        <p className="text-sm text-muted-foreground mb-5 relative z-10">
          {course.subtitle}
        </p>

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
            <li
              key={h}
              className="flex items-start gap-2.5 text-xs text-white/60"
            >
              <Check className="w-3.5 h-3.5 text-emerald-400 mt-0.5 flex-shrink-0" />
              {h}
            </li>
          ))}
        </ul>

        {/* Price */}
        <div className="flex items-baseline gap-2 mb-5 relative z-10">
          <span
            className="text-3xl font-extrabold text-foreground"
            style={{
              fontFamily:
                "'Space Grotesk', system-ui, sans-serif",
            }}
          >
            {formatINR(course.price)}
          </span>
          {course.originalPrice && (
            <span className="text-muted-foreground line-through text-base">
              {formatINR(course.originalPrice)}
            </span>
          )}
          {course.originalPrice && (
            <span className="text-xs text-emerald-400 font-bold px-2 py-1 bg-emerald-400/10 rounded-md">
              {Math.round(
                ((course.originalPrice - course.price) /
                  course.originalPrice) *
                  100,
              )}
              % off
            </span>
          )}
        </div>

        {/* Buttons */}
        <div className="flex gap-3 relative z-10">
          <button
            onClick={() => onEnroll(course)}
            className="flex-1 py-3 rounded-xl text-sm font-bold text-white hover:shadow-xl hover:scale-105 active:scale-[0.99] transition-all shadow-lg"
            style={{
              background: `linear-gradient(135deg, ${course.accentFrom} 0%, ${course.accentTo} 100%)`,
            }}
          >
            Enroll Now
          </button>
          <button
            onClick={() => onViewDetails(course)}
            className="px-5 py-3 rounded-xl text-sm font-semibold border-2 border-border text-foreground/80 hover:bg-muted hover:text-foreground hover:border-primary/30 transition-all"
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
export default function App() {
  const [ticker, setTicker] = useState(0);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState<
    "all" | CourseType
  >("all");
  const [modalCourse, setModalCourse] = useState<Course | null>(
    null,
  );
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [payLoading, setPayLoading] = useState<string | null>(
    null,
  );
  const [payError, setPayError] = useState<string | null>(null);
  const [formCourse, setFormCourse] = useState<Course | null>(
    null,
  );
  const [invoice, setInvoice] =
    useState<EnrollmentRecord | null>(null);

  // Authentication state
  const [currentStudent, setCurrentStudent] =
    useState<LoggedInStudent | null>(null);
  const [showLogin, setShowLogin] = useState(false);
  const [showDashboard, setShowDashboard] = useState(false);

  // Check if user is logged in on mount
  useEffect(() => {
    const studentData = localStorage.getItem(
      "skillvane_current_student",
    );
    if (studentData) {
      try {
        setCurrentStudent(JSON.parse(studentData));
      } catch (e) {
        localStorage.removeItem("skillvane_current_student");
      }
    }
  }, []);

  useEffect(() => {
    const t = setInterval(
      () => setTicker((i) => (i + 1) % TICKER.length),
      2800,
    );
    return () => clearInterval(t);
  }, []);

  // Lock body scroll when any modal is open
  useEffect(() => {
    const anyOpen = !!(
      modalCourse ||
      formCourse ||
      invoice ||
      showLogin ||
      showDashboard
    );
    document.body.style.overflow = anyOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [
    modalCourse,
    formCourse,
    invoice,
    showLogin,
    showDashboard,
  ]);

  const scrollTo = (id: string) => {
    document
      .getElementById(id)
      ?.scrollIntoView({ behavior: "smooth" });
    setMobileOpen(false);
  };

  // Authentication handlers
  const handleLogin = (student: LoggedInStudent) => {
    setCurrentStudent(student);
    setShowLogin(false);
    setShowDashboard(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("skillvane_current_student");
    setCurrentStudent(null);
    setShowDashboard(false);
  };

  // Step 1: Enroll button → show student details form
  const handleEnroll = (course: Course) => {
    setModalCourse(null);
    setFormCourse(course);
  };

  // Step 2: Form submitted → open Razorpay
  const handleFormSubmit = async (student: StudentDetails) => {
    if (!formCourse) return;
    const course = formCourse;
    setFormCourse(null);
    setPayLoading(course.id);
    setPayError(null);

    try {
      // Load Razorpay SDK
      await loadRazorpay();

      // Validate Razorpay key
      if (
        !RAZORPAY_KEY ||
        RAZORPAY_KEY === "YOUR_RAZORPAY_KEY"
      ) {
        throw new Error(
          "Razorpay key not configured. Please add your key at the top of App.tsx",
        );
      }

      const options = {
        key: RAZORPAY_KEY,
        amount: course.price * 100, // Amount in paise
        currency: "INR",
        name: "SkillVane IT Academy",
        description: `${course.title} — ${course.subtitle}`,
        image: "", // Optional: Add your logo URL
        handler: (response: any) => {
          setPayLoading(null);

          // Validate payment response
          if (!response.razorpay_payment_id) {
            setPayError(
              "Payment verification failed. Please contact support.",
            );
            setTimeout(() => setPayError(null), 6000);
            return;
          }

          const record: EnrollmentRecord = {
            invoiceNo: generateInvoiceNo(),
            paymentId: response.razorpay_payment_id,
            student,
            course,
            paidAt: new Date(),
          };

          // Auto-create/update student account and enroll in course
          try {
            const studentsData = localStorage.getItem(
              "skillvane_students",
            );
            const students: Record<string, any> = studentsData
              ? JSON.parse(studentsData)
              : {};

            if (!students[student.email]) {
              // Create new student account
              students[student.email] = {
                email: student.email,
                name: student.name,
                phone: student.phone,
                password: Math.random().toString(36).slice(-8),
                enrolledCourses: [course.id],
                createdAt: new Date().toISOString(),
              };
            } else {
              // Add course to existing student
              if (!students[student.email].enrolledCourses) {
                students[student.email].enrolledCourses = [];
              }
              if (
                !students[
                  student.email
                ].enrolledCourses.includes(course.id)
              ) {
                students[student.email].enrolledCourses.push(
                  course.id,
                );
              }
            }

            localStorage.setItem(
              "skillvane_students",
              JSON.stringify(students),
            );

            // Auto-login the student
            const loggedStudent: LoggedInStudent = {
              email: student.email,
              name: student.name,
              enrolledCourses:
                students[student.email].enrolledCourses,
            };
            localStorage.setItem(
              "skillvane_current_student",
              JSON.stringify(loggedStudent),
            );
            setCurrentStudent(loggedStudent);

            setInvoice(record);
          } catch (err) {
            console.error("Error saving enrollment:", err);
            setPayError(
              "Payment successful but enrollment failed. Please contact support with payment ID: " +
                response.razorpay_payment_id,
            );
            setTimeout(() => setPayError(null), 10000);
          }
        },
        prefill: {
          name: student.name,
          email: student.email,
          contact: "+91" + student.phone,
        },
        notes: {
          course_id: course.id,
          course_title: course.title,
          student_email: student.email,
          student_name: student.name,
        },
        theme: {
          color: course.accentFrom,
          backdrop_color: "rgba(0, 0, 0, 0.8)",
        },
        modal: {
          ondismiss: () => {
            setPayLoading(null);
            setPayError(
              "Payment cancelled. You can try again anytime.",
            );
            setTimeout(() => setPayError(null), 4000);
          },
          confirm_close: true,
          escape: false,
        },
        retry: {
          enabled: true,
          max_count: 3,
        },
      };

      const rzp = new (window as any).Razorpay(options);

      // Handle payment failures
      rzp.on("payment.failed", (resp: any) => {
        setPayLoading(null);
        const errorMsg =
          resp.error?.description ||
          resp.error?.reason ||
          "Payment failed";
        setPayError(
          `Payment failed: ${errorMsg}. Please try again.`,
        );
        setTimeout(() => setPayError(null), 8000);
      });

      rzp.open();
    } catch (err: any) {
      setPayLoading(null);
      const errorMsg =
        err.message || "Could not load payment gateway";
      setPayError(
        errorMsg +
          ". Please check your internet connection and try again.",
      );
      setTimeout(() => setPayError(null), 8000);
      console.error("Razorpay error:", err);
    }
  };

  const FILTERS: {
    label: string;
    value: "all" | CourseType;
  }[] = [
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

  return (
    <div
      className="min-h-screen bg-background text-foreground overflow-x-hidden"
      style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}
    >
      {/* ── Navbar ──────────────────────────────────────────────── */}
      <nav className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg shadow-primary/40">
              <Cloud className="w-5 h-5 text-white" />
            </div>
            <span
              className="font-bold text-base tracking-tight"
              style={{
                fontFamily:
                  "'Space Grotesk', system-ui, sans-serif",
              }}
            >
              SkillVane{" "}
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                IT Academy
              </span>
            </span>
          </div>

          <div className="hidden md:flex items-center gap-7 text-sm text-muted-foreground">
            <button
              onClick={() => scrollTo("courses")}
              className="hover:text-foreground transition-colors"
            >
              Courses
            </button>
            <button
              onClick={() => scrollTo("instructor")}
              className="hover:text-foreground transition-colors"
            >
              Instructor
            </button>
            <button
              onClick={() => scrollTo("testimonials")}
              className="hover:text-foreground transition-colors"
            >
              Reviews
            </button>
            <button
              onClick={() => scrollTo("faq")}
              className="hover:text-foreground transition-colors"
            >
              FAQ
            </button>
          </div>

          <div className="hidden md:flex items-center gap-3">
            {currentStudent ? (
              <button
                onClick={() => setShowDashboard(true)}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-primary to-secondary text-white text-sm font-semibold hover:shadow-xl hover:shadow-primary/40 hover:scale-105 transition-all shadow-lg shadow-primary/30"
              >
                <GraduationCap className="w-4 h-4" />
                My Dashboard
              </button>
            ) : (
              <>
                <button
                  onClick={() => setShowLogin(true)}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border text-muted-foreground hover:text-foreground hover:border-primary/30 transition-all text-sm font-semibold"
                >
                  <LogIn className="w-4 h-4" />
                  Login
                </button>
                <button
                  onClick={() => scrollTo("courses")}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-primary to-secondary text-white text-sm font-semibold hover:shadow-xl hover:shadow-primary/40 hover:scale-105 transition-all shadow-lg shadow-primary/30"
                >
                  View Courses →
                </button>
              </>
            )}
          </div>

          <button
            className="md:hidden p-2 text-muted-foreground"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>

        {mobileOpen && (
          <div className="md:hidden bg-card border-t border-border px-4 py-4 flex flex-col gap-1">
            {[
              "courses",
              "instructor",
              "testimonials",
              "faq",
            ].map((s) => (
              <button
                key={s}
                onClick={() => scrollTo(s)}
                className="capitalize text-sm text-muted-foreground hover:text-foreground py-2.5 text-left border-b border-border/40 last:border-0"
              >
                {s === "faq"
                  ? "FAQ"
                  : s.charAt(0).toUpperCase() + s.slice(1)}
              </button>
            ))}
            {currentStudent ? (
              <button
                onClick={() => {
                  setShowDashboard(true);
                  setMobileOpen(false);
                }}
                className="mt-3 w-full py-3 rounded-xl bg-gradient-to-r from-primary to-secondary text-white text-sm font-semibold shadow-lg shadow-primary/30 flex items-center justify-center gap-2"
              >
                <GraduationCap className="w-4 h-4" />
                My Dashboard
              </button>
            ) : (
              <>
                <button
                  onClick={() => {
                    setShowLogin(true);
                    setMobileOpen(false);
                  }}
                  className="mt-3 w-full py-3 rounded-xl border border-border text-foreground text-sm font-semibold flex items-center justify-center gap-2"
                >
                  <LogIn className="w-4 h-4" />
                  Login
                </button>
                <button
                  onClick={() => scrollTo("courses")}
                  className="mt-2 w-full py-3 rounded-xl bg-gradient-to-r from-primary to-secondary text-white text-sm font-semibold shadow-lg shadow-primary/30"
                >
                  View Courses →
                </button>
              </>
            )}
          </div>
        )}
      </nav>

      {/* ── Floating Contact Buttons ─────────────────────────────── */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3">
        {/* WhatsApp Button */}
        <a
          href="https://chat.whatsapp.com/J7vV8uKF8hSE5Zsx6ltoD1"
          target="_blank"
          rel="noopener noreferrer"
          className="group w-14 h-14 rounded-full bg-[#25D366] flex items-center justify-center shadow-xl hover:shadow-2xl hover:scale-110 transition-all duration-300 hover:bg-[#20BA5A]"
          aria-label="Join WhatsApp Group"
        >
          <MessageCircle className="w-7 h-7 text-white group-hover:scale-110 transition-transform" />
        </a>

        {/* Call Button */}
        <a
          href="tel:+917305101711"
          className="group w-14 h-14 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center shadow-xl hover:shadow-2xl hover:scale-110 transition-all duration-300"
          aria-label="Call us"
        >
          <Phone className="w-6 h-6 text-white group-hover:scale-110 transition-transform" />
        </a>
      </div>

      {/* ── Hero ────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden pt-20 sm:pt-32 pb-24 sm:pb-32">
        {/* Animated Background Elements */}
        <div className="pointer-events-none absolute inset-0">
          {/* Grid Pattern */}
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(99,102,241,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.5) 1px, transparent 1px)",
              backgroundSize: "50px 50px",
            }}
          />

          {/* Gradient Orbs with Animation */}
          <div className="absolute top-0 left-1/4 w-[600px] h-[600px] rounded-full bg-gradient-to-br from-primary/30 to-secondary/20 blur-[140px] animate-pulse-glow" />
          <div
            className="absolute top-1/3 right-1/4 w-[500px] h-[500px] rounded-full bg-gradient-to-bl from-accent/20 to-primary/15 blur-[120px]"
            style={{
              animation:
                "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
            }}
          />
          <div className="absolute bottom-0 left-1/3 w-[450px] h-[450px] rounded-full bg-gradient-to-tr from-secondary/25 to-accent/15 blur-[100px]" />

          {/* Floating Shapes */}
          <div
            className="absolute top-20 left-10 w-20 h-20 rounded-2xl bg-primary/10 backdrop-blur-sm rotate-12 border border-primary/20"
            style={{
              animation: "float 6s ease-in-out infinite",
            }}
          />
          <div
            className="absolute top-40 right-20 w-16 h-16 rounded-full bg-accent/10 backdrop-blur-sm border border-accent/20"
            style={{
              animation: "float 5s ease-in-out infinite 1s",
            }}
          />
          <div
            className="absolute bottom-40 right-32 w-24 h-24 rounded-3xl bg-secondary/10 backdrop-blur-sm -rotate-6 border border-secondary/20"
            style={{
              animation: "float 7s ease-in-out infinite 2s",
            }}
          />
        </div>

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6">
          {/* Announcement Badge */}
          <div className="flex justify-center mb-8 animate-fade-in">
            <div className="group relative inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full border border-primary/40 bg-gradient-to-r from-primary/15 via-secondary/10 to-primary/15 text-sm font-medium text-primary shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all cursor-pointer backdrop-blur-sm">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-accent"></span>
              </span>
              <span className="font-mono text-xs tracking-wide">
                New Batch Starting From 1st July 2026 at 7:30 AM
                IST
              </span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          <div className="text-center">
            {/* Main Headline */}
            <h1
              className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-extrabold tracking-tight leading-[1.05] mb-8 animate-fade-in"
              style={{
                fontFamily:
                  "'Space Grotesk', system-ui, sans-serif",
                animationDelay: "0.1s",
              }}
            >
              <span className="block mb-2">Master</span>
              <span className="relative inline-block">
                <span className="absolute -inset-1 bg-gradient-to-r from-primary via-secondary to-accent opacity-30 blur-2xl"></span>
                <span className="relative bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                  GCP Data Engineering
                </span>
              </span>
              <span className="block mt-4 text-3xl sm:text-4xl lg:text-5xl text-muted-foreground font-semibold">
                with{" "}
                <span className="text-foreground">
                  Shaik Saidhul
                </span>
              </span>
            </h1>

            {/* Subheadline */}
            <p
              className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed mb-12 animate-fade-in"
              style={{ animationDelay: "0.2s" }}
            >
              From zero to job-ready in 3 months. Live classes,
              real projects, and hands-on experience with Google
              Cloud Platform's most powerful data tools.
            </p>

            {/* CTA Buttons */}
            <div
              className="flex flex-col sm:flex-row gap-4 justify-center mb-16 animate-fade-in"
              style={{ animationDelay: "0.3s" }}
            >
              <button
                onClick={() => scrollTo("courses")}
                className="group relative px-10 py-5 rounded-2xl bg-gradient-to-r from-primary via-secondary to-primary text-white font-bold text-lg hover:shadow-2xl hover:shadow-primary/50 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-primary/40 overflow-hidden"
              >
                <span className="relative z-10 flex items-center gap-2 justify-center">
                  Browse All Courses
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-secondary via-primary to-secondary opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>
              <button
                onClick={() => scrollTo("instructor")}
                className="group px-10 py-5 rounded-2xl border-2 border-primary/40 text-foreground font-bold text-lg hover:bg-gradient-to-r hover:from-primary/10 hover:to-secondary/10 hover:border-primary/60 transition-all flex items-center gap-3 justify-center backdrop-blur-sm"
              >
                <div className="p-2 rounded-full bg-primary/20 group-hover:bg-primary/30 transition-colors">
                  <Play className="w-4 h-4 text-primary" />
                </div>
                Meet Your Instructor
              </button>
            </div>

            {/* Stats Cards */}
            <div
              className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 max-w-5xl mx-auto mb-12 animate-fade-in"
              style={{ animationDelay: "0.4s" }}
            >
              {[
                {
                  icon: Users,
                  color: "from-primary to-primary/80",
                  iconColor: "text-primary",
                  val: "1500+",
                  sub: "Students Enrolled",
                },
                {
                  icon: Star,
                  color: "from-yellow-500 to-orange-500",
                  iconColor: "text-yellow-400",
                  val: "4.9/5",
                  sub: "Average Rating",
                },
                {
                  icon: Award,
                  color: "from-emerald-500 to-teal-500",
                  iconColor: "text-emerald-400",
                  val: "GCP Certified",
                  sub: "Expert Instructor",
                },
                {
                  icon: BookOpen,
                  color: "from-accent to-blue-500",
                  iconColor: "text-accent",
                  val: "5 Courses",
                  sub: "Available Now",
                },
              ].map(
                ({ icon: Ic, color, iconColor, val, sub }) => (
                  <div
                    key={val}
                    className="group relative p-6 rounded-2xl bg-gradient-to-br from-card/80 to-card/40 border border-border/50 backdrop-blur-xl hover:border-primary/30 hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-1 transition-all"
                  >
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="relative">
                      <div
                        className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${color} bg-opacity-10 mb-4`}
                      >
                        <Ic
                          className={`w-6 h-6 ${iconColor}`}
                        />
                      </div>
                      <div
                        className="text-3xl font-extrabold text-foreground mb-1"
                        style={{
                          fontFamily:
                            "'Space Grotesk', system-ui, sans-serif",
                        }}
                      >
                        {val}
                      </div>
                      <div className="text-sm text-muted-foreground font-medium">
                        {sub}
                      </div>
                    </div>
                  </div>
                ),
              )}
            </div>

            {/* Ticker */}
            <div
              className="flex items-center justify-center gap-6 animate-fade-in"
              style={{ animationDelay: "0.5s" }}
            >
              <div className="h-px w-20 bg-gradient-to-r from-transparent to-primary/50" />
              <div className="flex items-center gap-3 px-6 py-3 rounded-full bg-gradient-to-r from-card/80 to-card/40 border border-primary/20 text-sm text-foreground min-w-[240px] justify-center backdrop-blur-sm shadow-lg">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-400"></span>
                </span>
                <span className="font-medium">
                  {TICKER[ticker]}
                </span>
              </div>
              <div className="h-px w-20 bg-gradient-to-l from-transparent to-secondary/50" />
            </div>
          </div>
        </div>
      </section>

      {/* ── Courses ─────────────────────────────────────────────── */}
      <section
        id="courses"
        className="relative py-20 sm:py-28 bg-gradient-to-b from-background via-card/30 to-background overflow-hidden"
      >
        {/* Background decoration */}
        <div className="pointer-events-none absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
        <div className="pointer-events-none absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-secondary/50 to-transparent" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-xs font-mono text-primary tracking-widest uppercase mb-6">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              All Courses
            </div>
            <h2
              className="text-4xl sm:text-5xl lg:text-6xl font-extrabold mb-6"
              style={{
                fontFamily:
                  "'Space Grotesk', system-ui, sans-serif",
              }}
            >
              Choose Your{" "}
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Learning Path
              </span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              From live instructor-led batches to self-paced
              recordings and hands-on project courses — pick
              what fits your schedule and career goals.
            </p>
          </div>

          {/* Filter tabs */}
          <div className="inline-flex flex-wrap justify-center gap-3 mb-12 p-2 rounded-2xl bg-card/50 border border-border/50 backdrop-blur-sm mx-auto">
            {FILTERS.map(({ label, value }) => (
              <button
                key={value}
                onClick={() => setActiveFilter(value)}
                className={`relative px-6 py-3 rounded-xl text-sm font-bold transition-all ${
                  activeFilter === value
                    ? "bg-gradient-to-r from-primary to-secondary text-white shadow-lg shadow-primary/40"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                }`}
              >
                {activeFilter === value && (
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary to-secondary opacity-100" />
                )}
                <span className="relative z-10">{label}</span>
              </button>
            ))}
          </div>

          {/* Payment error banner */}
          {payError && (
            <div className="mb-6 p-4 rounded-xl border border-red-500/30 bg-red-500/10 text-red-400 text-sm text-center font-semibold">
              ❌ {payError}
            </div>
          )}

          {/* Course grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {visibleCourses.map((course, index) => (
              <div
                key={course.id}
                className="animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CourseCard
                  course={course}
                  onViewDetails={setModalCourse}
                  onEnroll={handleEnroll}
                />
              </div>
            ))}
          </div>

          <p className="text-center text-xs text-muted-foreground mt-8">
            More courses coming soon · All prices in INR
            inclusive of taxes
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
              style={{
                fontFamily: "'Outfit', system-ui, sans-serif",
              }}
            >
              Learn From a Working Professional
            </h2>
          </div>

          <div className="flex flex-col md:flex-row gap-8 md:gap-12 items-center md:items-start">
            <div className="flex-shrink-0 flex flex-col items-center gap-3">
              <div className="relative w-36 h-44 sm:w-44 sm:h-56 rounded-2xl overflow-hidden shadow-2xl shadow-[#4361ee]/30 ring-2 ring-[#4361ee]/30">
                <ImageWithFallback
                  src={instructorPhoto}
                  alt="SkillVane IT Academy — GCP Data Engineering Instructor"
                  className="w-full h-full object-cover object-top"
                />
              </div>
              <div className="flex gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-4 h-4 text-yellow-400 fill-yellow-400"
                  />
                ))}
              </div>
            </div>

            <div className="flex-1 text-center md:text-left">
              <h3
                className="text-xl sm:text-2xl font-bold mb-1"
                style={{
                  fontFamily: "'Outfit', system-ui, sans-serif",
                }}
              >
                Shaik Saidhul
              </h3>
              <p className="text-[#4361ee] font-semibold text-sm mb-5">
                Solution Architect · SkillVane IT Academy
              </p>
              <p className="text-muted-foreground text-sm leading-relaxed mb-8 max-w-xl">
                With over 9+ years of hands-on experience
                designing large-scale data pipelines on Google
                Cloud Platform, your instructor has architected
                solutions for Fortune 500 enterprises across
                BFSI, e-commerce, and logistics. As a Google
                Certified Professional Data Engineer and Cloud
                Architect, they bring real-world war stories,
                battle-tested patterns, and current industry
                practices into every lesson — no filler, no
                theory-only slides.
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
                      style={{
                        fontFamily:
                          "'Outfit', system-ui, sans-serif",
                      }}
                    >
                      {value}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Testimonials ────────────────────────────────────────── */}
      <section
        id="testimonials"
        className="py-16 sm:py-20 bg-card border-y border-border"
      >
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <span className="text-xs font-mono text-[#4361ee] tracking-widest uppercase">
              Reviews
            </span>
            <h2
              className="text-2xl sm:text-3xl font-bold mt-2 mb-3"
              style={{
                fontFamily: "'Outfit', system-ui, sans-serif",
              }}
            >
              Trusted by Professionals Across India
            </h2>
            <div className="flex items-center justify-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className="w-5 h-5 text-yellow-400 fill-yellow-400"
                />
              ))}
              <span className="ml-2 text-muted-foreground text-sm">
                4.9 / 5 · 500+ ratings
              </span>
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
                    <Star
                      key={i}
                      className="w-4 h-4 text-yellow-400 fill-yellow-400"
                    />
                  ))}
                </div>
                <p className="text-muted-foreground text-sm leading-relaxed mb-5">
                  "{t.text}"
                </p>
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-xl bg-gradient-to-br ${t.color} flex items-center justify-center text-white text-xs font-bold flex-shrink-0`}
                  >
                    {t.initials}
                  </div>
                  <div>
                    <div
                      className="font-semibold text-sm"
                      style={{
                        fontFamily:
                          "'Outfit', system-ui, sans-serif",
                      }}
                    >
                      {t.name}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {t.role}
                    </div>
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
            <span className="text-xs font-mono text-[#4361ee] tracking-widest uppercase">
              FAQ
            </span>
            <h2
              className="text-2xl sm:text-3xl font-bold mt-2"
              style={{
                fontFamily: "'Outfit', system-ui, sans-serif",
              }}
            >
              Common Questions
            </h2>
          </div>

          <div className="space-y-2">
            {faqs.map((faq, i) => (
              <div
                key={i}
                className="border border-border rounded-xl overflow-hidden"
              >
                <button
                  className="w-full flex items-center justify-between p-5 text-left hover:bg-accent/60 transition-colors"
                  onClick={() =>
                    setOpenFaq(openFaq === i ? null : i)
                  }
                >
                  <span className="font-semibold text-sm pr-4">
                    {faq.q}
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-muted-foreground flex-shrink-0 transition-transform duration-200 ${
                      openFaq === i ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {openFaq === i && (
                  <div className="px-5 pb-5 border-t border-border/40 bg-card/60">
                    <p className="text-sm text-muted-foreground pt-4 leading-relaxed">
                      {faq.a}
                    </p>
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
            style={{
              fontFamily: "'Outfit', system-ui, sans-serif",
            }}
          >
            Start your GCP journey today
          </h2>
          <p className="text-muted-foreground text-sm mb-8">
            5 courses. Live batch, recordings, foundation &
            projects. One academy, trusted by 500+
            professionals.
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
              style={{
                fontFamily: "'Outfit', system-ui, sans-serif",
              }}
            >
              SkillVane IT Academy
            </span>
          </div>
          <span>
            © {new Date().getFullYear()} SkillVane IT Academy.
            All rights reserved.
          </span>
          <div className="flex gap-5">
            <a
              href="#"
              className="hover:text-foreground transition-colors"
            >
              Privacy Policy
            </a>
            <a
              href="#"
              className="hover:text-foreground transition-colors"
            >
              Terms
            </a>
            <a
              href="#"
              className="hover:text-foreground transition-colors"
            >
              Contact
            </a>
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

      {/* ── Enrollment Form Modal ────────────────────────────────── */}
      {formCourse && (
        <EnrollmentFormModal
          course={formCourse}
          onClose={() => setFormCourse(null)}
          onSubmit={handleFormSubmit}
        />
      )}

      {/* ── Invoice / Success Modal ──────────────────────────────── */}
      {invoice && (
        <InvoiceModal
          record={invoice}
          onClose={() => setInvoice(null)}
        />
      )}

      {/* ── Login Modal ──────────────────────────────────────────── */}
      {showLogin && (
        <LoginModal
          onClose={() => setShowLogin(false)}
          onLogin={handleLogin}
        />
      )}

      {/* ── Student Dashboard ────────────────────────────────────── */}
      {showDashboard && currentStudent && (
        <StudentDashboard
          student={currentStudent}
          courses={COURSES}
          onLogout={handleLogout}
          onClose={() => setShowDashboard(false)}
        />
      )}
    </div>
  );
}