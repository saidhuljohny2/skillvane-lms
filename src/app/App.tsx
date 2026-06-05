import { useState, useEffect, useRef } from "react";
import { ImageWithFallback } from "@/app/components/figma/ImageWithFallback";
import instructorPhoto from "@/imports/IMG_20260518_113243.jpg.jpeg";
import skillVaneLogo from "@/imports/logo1.png";
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
const RAZORPAY_KEY = "rzp_live_Sx2SDk8J6c6HBk";
const RAZORPAY_KEY_SECRET = "sBIaKza4uMIkT6ehyhqwRQts";

// Paste your Google Apps Script deployment URL here after setup:
const GOOGLE_SHEET_WEBHOOK_URL =
  "https://script.google.com/macros/s/AKfycbwNJMNfBQKYE4WoXJJDCSqOzJvmRYbx-VqNTYr3BdFpvwcxNiqW3puqQJHsSk30gRKj/exec";

// Paste your EmailJS credentials here after setup:
const EMAILJS_SERVICE_ID = "service_huss9yj";
const EMAILJS_TEMPLATE_ID = "template_jqy6yhj";
const EMAILJS_PUBLIC_KEY = "xC4HlrScSivWvpXtz";
const TRAINER_WHATSAPP_LINK =
  "https://wa.me/917305101711?text=Hi%20Trainer%2C%20I%20have%20a%20question%20about%20SkillVane%20courses.%20Please%20guide%20me.";

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
  notesLink?: string; // Notes/material handout link for enrolled students
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
    notesLink:
      "https://drive.google.com/drive/folders/REPLACE_WITH_GCP_LIVE_NOTES_LINK", // Replace with GCP live batch notes link
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
    notesLink:
      "https://drive.google.com/drive/folders/REPLACE_WITH_GCP_RECORDINGS_NOTES_LINK", // Replace with GCP recordings notes link
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
    driveLink:
      "https://drive.google.com/drive/folders/1VsxvQYeTeCd1WuDxeDHJ3iQ-HUd9wS-h?usp=drive_link", // Replace with Python course Google Drive folder link
    notesLink:
      "https://drive.google.com/drive/folders/REPLACE_WITH_PYTHON_NOTES_LINK", // Replace with Python notes link
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
    driveLink:
      "https://drive.google.com/drive/folders/1QO-fMXUP3DGkyJ9SWMfEjmvFGJnnEd4E?usp=sharing", // Replace with Healthcare project Google Drive folder link
    notesLink:
      "https://drive.google.com/drive/folders/REPLACE_WITH_HEALTHCARE_NOTES_LINK", // Replace with Healthcare notes link
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
    driveLink:
      "https://drive.google.com/drive/folders/1pFg_ZlTOX75ijqYxCusHvcVXmjuLGXlR?usp=sharing", // Replace with Retailer project Google Drive folder link
    notesLink:
      "https://drive.google.com/drive/folders/REPLACE_WITH_RETAILER_NOTES_LINK", // Replace with Retailer notes link
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

function getDemoAccess(course: Course) {
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

function getEnrolledCourseAccess(course: Course) {
  if (course.type === "live" && course.zoomLink) {
    return {
      href: course.zoomLink,
      label: "Join Live Class",
      icon: MonitorPlay,
    };
  }

  return null;
}

function getDriveAccessRequestHref(student: LoggedInStudent, course: Course) {
  const message = [
    "Hi Admin, please provide Google Drive access for my course.",
    `Course: ${course.title}`,
    `Student Name: ${student.name}`,
    `Access Email: ${student.email}`,
    "I understand access will be provided to my mail inbox within 24 hours.",
  ].join("\n");

  return `https://wa.me/917305101711?text=${encodeURIComponent(message)}`;
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
  const demoAccess = getDemoAccess(course);

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
        className="absolute inset-0 bg-black/75 backdrop-blur-sm"
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
          {demoAccess && (
            <a
              href={demoAccess.href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl text-sm font-bold bg-gradient-to-r from-[#18c29c]/15 to-[#2f80ed]/15 border border-[#18c29c]/35 text-[#8df5d7] hover:from-[#18c29c]/25 hover:to-[#2f80ed]/25 hover:border-[#18c29c]/60 transition-all"
            >
              <demoAccess.icon className="w-4 h-4" />
              {demoAccess.longLabel}
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
  password: string;
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
      course_id: record.course.id,
      amount: record.course.price,
      drive_access_required: Boolean(record.course.driveLink),
      drive_link: record.course.driveLink || "",
      drive_access_email: record.student.email,
      notes_access_required: Boolean(record.course.notesLink),
      notes_link: record.course.notesLink || "",
      notes_access_email: record.student.email,
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
        className="absolute inset-0 bg-black/75 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative w-full sm:max-w-md bg-[#07111f] rounded-t-2xl sm:rounded-2xl border border-white/10 shadow-2xl overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(24,194,156,0.18),transparent_42%),radial-gradient(ellipse_at_bottom_right,rgba(242,184,75,0.12),transparent_36%)]" />
        {/* Header */}
        <div className="relative px-6 py-5 flex items-center justify-between border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#18c29c] to-[#2f80ed] flex items-center justify-center shadow-lg shadow-[#18c29c]/20">
              <Lock className="w-5 h-5 text-white" />
            </div>
            <div>
            <h2
              className="font-black text-white text-xl"
              style={{
                fontFamily:
                  "'Space Grotesk', system-ui, sans-serif",
              }}
            >
              {mode === "login"
                ? "Welcome Back"
                : "Create Account"}
            </h2>
            <p className="text-xs text-slate-400">
              {mode === "login"
                ? "Login to access your courses"
                : "Sign up to get started"}
            </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="relative px-6 py-6 space-y-4"
        >
          {errors.general && (
            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-300 text-sm">
              {errors.general}
            </div>
          )}

          {mode === "signup" && (
            <div>
              <label className="block text-sm font-semibold text-slate-200 mb-1.5">
                Full Name
              </label>
              <input
                value={form.name}
                onChange={(e) =>
                  setForm({ ...form, name: e.target.value })
                }
                placeholder="Enter your full name"
                className="w-full bg-white/[0.06] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#18c29c]/60 transition-all"
              />
              {errors.name && (
                <p className="text-xs text-red-300 mt-1">
                  {errors.name}
                </p>
              )}
            </div>
          )}

          <div>
            <label className="block text-sm font-semibold text-slate-200 mb-1.5">
              Email
            </label>
            <input
              type="email"
              value={form.email}
              onChange={(e) =>
                setForm({ ...form, email: e.target.value })
              }
              placeholder="your.email@example.com"
              className="w-full bg-white/[0.06] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#18c29c]/60 transition-all"
            />
            {errors.email && (
              <p className="text-xs text-red-300 mt-1">
                {errors.email}
              </p>
            )}
          </div>

          {mode === "signup" && (
            <div>
              <label className="block text-sm font-semibold text-slate-200 mb-1.5">
                Phone
              </label>
              <input
                type="tel"
                value={form.phone}
                onChange={(e) =>
                  setForm({ ...form, phone: e.target.value })
                }
                placeholder="10-digit mobile number"
                className="w-full bg-white/[0.06] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#18c29c]/60 transition-all"
              />
              {errors.phone && (
                <p className="text-xs text-red-300 mt-1">
                  {errors.phone}
                </p>
              )}
            </div>
          )}

          <div>
            <label className="block text-sm font-semibold text-slate-200 mb-1.5">
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
              className="w-full bg-white/[0.06] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#18c29c]/60 transition-all"
            />
            {errors.password && (
              <p className="text-xs text-red-300 mt-1">
                {errors.password}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-[#18c29c] to-[#2f80ed] text-white font-black text-sm hover:shadow-xl hover:shadow-[#18c29c]/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
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
              className="text-sm text-slate-400 hover:text-[#8df5d7] transition-colors"
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
  onEnroll,
}: {
  student: LoggedInStudent;
  courses: Course[];
  onLogout: () => void;
  onClose: () => void;
  onEnroll: (course: Course) => void;
}) {
  const enrolledCourses = courses.filter((c) =>
    student.enrolledCourses.includes(c.id),
  );
  const availableCourses = courses.filter(
    (c) => !student.enrolledCourses.includes(c.id),
  );

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div
        className="absolute inset-0 bg-[#020817]/86 backdrop-blur-xl"
        onClick={onClose}
      />
      <div className="premium-ring relative w-full sm:max-w-6xl max-h-[94dvh] sm:max-h-[90vh] flex flex-col bg-[#07111f]/95 rounded-t-2xl sm:rounded-3xl border border-white/12 shadow-2xl overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_18%_0%,rgba(24,194,156,0.22),transparent_34%),radial-gradient(ellipse_at_92%_20%,rgba(242,184,75,0.16),transparent_28%),linear-gradient(180deg,rgba(255,255,255,0.04),transparent_26%)]" />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#f2b84b]/70 to-transparent" />

        <div className="relative px-5 sm:px-7 py-5 flex items-center justify-between border-b border-white/10 bg-white/[0.035] backdrop-blur-xl">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#18c29c] via-[#2f80ed] to-[#7cc7ff] flex items-center justify-center shadow-lg shadow-[#18c29c]/25 ring-1 ring-white/20">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-xs font-black uppercase tracking-[0.18em] text-[#8df5d7]">
                SkillVane LMS
              </p>
              <h2
                className="font-black text-white text-lg sm:text-xl"
                style={{
                  fontFamily:
                    "'Space Grotesk', system-ui, sans-serif",
                }}
              >
                Welcome back, {student.name}
              </h2>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onLogout}
              className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl border border-white/12 bg-white/[0.04] text-slate-300 hover:text-white hover:border-[#18c29c]/40 transition-all text-sm font-semibold"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl border border-white/10 bg-white/[0.04] hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="relative overflow-y-auto flex-1 px-5 sm:px-7 py-6 space-y-8 lms-dashboard-scroll">
          <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-5">
            <div className="premium-surface rounded-2xl p-5 sm:p-6">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#18c29c]/25 bg-[#18c29c]/10 px-3 py-1 text-[11px] font-black uppercase tracking-[0.16em] text-[#9cf8dd]">
                <CheckCircle2 className="h-3.5 w-3.5" />
                Access center
              </div>
              <h3
                className="text-2xl sm:text-3xl font-black text-white"
                style={{
                  fontFamily:
                    "'Space Grotesk', system-ui, sans-serif",
                }}
              >
                Your learning command center
              </h3>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300">
                Access enrolled courses, request Google Drive access for your registered email, and add the next program to your SkillVane roadmap.
              </p>
              <div className="mt-4 rounded-xl border border-[#f2b84b]/20 bg-[#f2b84b]/10 px-4 py-3 text-xs leading-5 text-[#ffe4a3]">
                Drive invitations are sent to{" "}
                <span className="font-black text-white">
                  {student.email}
                </span>
                . Please check your inbox after requesting access.
              </div>
              <div className="mt-5 flex flex-wrap gap-3">
                <button
                  onClick={() =>
                    document
                      .getElementById("student-available-courses")
                      ?.scrollIntoView({ behavior: "smooth" })
                  }
                  className="magnetic-button inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#18c29c] via-[#2f80ed] to-[#7cc7ff] px-5 py-3 text-sm font-black text-white shadow-lg shadow-[#18c29c]/20"
                >
                  <ShoppingCart className="w-4 h-4" />
                  Enroll New Course
                </button>
                <button
                  onClick={onClose}
                  className="magnetic-button inline-flex items-center gap-2 rounded-xl border border-white/12 bg-white/[0.05] px-5 py-3 text-sm font-bold text-slate-200 hover:border-[#f2b84b]/40"
                >
                  <ArrowRight className="w-4 h-4" />
                  Back to Website
                </button>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {[
                { label: "Owned", value: enrolledCourses.length, icon: Award },
                { label: "Available", value: availableCourses.length, icon: ShoppingCart },
                { label: "Total", value: courses.length, icon: BookOpen },
              ].map((item) => (
                <div
                  key={item.label}
                  className="premium-surface rounded-2xl p-4 transition-transform duration-300 hover:-translate-y-1"
                >
                  <item.icon className="mb-3 h-4 w-4 text-[#f2b84b]" />
                  <div
                    className="text-3xl font-black text-white"
                    style={{
                      fontFamily:
                        "'Space Grotesk', system-ui, sans-serif",
                    }}
                  >
                    {item.value}
                  </div>
                  <div className="mt-1 text-[11px] font-bold uppercase tracking-[0.14em] text-slate-400">
                    {item.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <section>
            <div className="mb-4 flex items-end justify-between gap-4">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.18em] text-[#8df5d7]">
                  Course Access
                </p>
                <h3 className="mt-1 text-xl font-black text-white">
                  Enrolled Courses
                </h3>
              </div>
              <span className="rounded-full border border-[#18c29c]/25 bg-[#18c29c]/10 px-3 py-1 text-xs font-black text-[#9cf8dd]">
                {enrolledCourses.length} active
              </span>
            </div>

            {enrolledCourses.length === 0 ? (
              <div className="premium-surface rounded-2xl border-dashed px-5 py-10 text-center">
                <BookOpen className="mx-auto mb-3 h-10 w-10 text-[#f2b84b]" />
                <p className="font-bold text-white">No enrolled courses yet</p>
                <p className="mt-1 text-sm text-slate-400">
                  Pick a program below and complete enrollment to unlock access.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {enrolledCourses.map((course) => {
                  const Icon = course.icon;
                  const courseAccess =
                    getEnrolledCourseAccess(course);
                  const driveAccessRequestHref =
                    getDriveAccessRequestHref(student, course);
                  return (
                    <div
                      key={course.id}
                      className="premium-surface rounded-2xl p-5 transition-transform duration-300 hover:-translate-y-1"
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg ring-1 ring-white/10"
                          style={{
                            background: `linear-gradient(135deg, ${course.accentFrom}25 0%, ${course.accentTo}15 100%)`,
                            border: `1px solid ${course.accentFrom}50`,
                          }}
                        >
                          <Icon
                            className="w-5 h-5"
                            style={{ color: course.accentFrom }}
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <span
                            className="text-[10px] font-mono font-bold tracking-widest px-2 py-0.5 rounded-full border uppercase"
                            style={{
                              color: course.accentFrom,
                              borderColor: `${course.accentFrom}50`,
                              background: `${course.accentFrom}15`,
                            }}
                          >
                            {course.badge}
                          </span>
                          <h4 className="mt-2 text-lg font-black text-white leading-tight">
                            {course.title}
                          </h4>
                          <p className="text-xs text-slate-400">
                            {course.subtitle}
                          </p>
                        </div>
                      </div>

                      <div className="mt-4 flex flex-wrap gap-2">
                        {course.duration && (
                          <span className="flex items-center gap-1 rounded-full border border-white/10 bg-white/[0.07] px-2.5 py-1 text-xs text-slate-300">
                            <Clock className="w-3 h-3" />
                            {course.duration}
                          </span>
                        )}
                        <span className="flex items-center gap-1 rounded-full border border-white/10 bg-white/[0.07] px-2.5 py-1 text-xs text-slate-300">
                          <BookOpen className="w-3 h-3" />
                          {TYPE_LABELS[course.type]}
                        </span>
                      </div>

                      {courseAccess ? (
                        <a
                          href={courseAccess.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="magnetic-button mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-[#18c29c]/30 bg-[#18c29c]/10 px-4 py-3 text-sm font-black text-[#9cf8dd] hover:border-[#18c29c]/55 hover:bg-[#18c29c]/16 transition-all"
                        >
                          <courseAccess.icon className="h-4 w-4" />
                          {courseAccess.label}
                        </a>
                      ) : (
                        <div className="mt-4 rounded-xl border border-white/10 bg-white/[0.055] px-4 py-3 text-sm leading-6 text-slate-300">
                          Course materials and recordings are shared through
                          Google Drive after access is enabled for your email.
                        </div>
                      )}

                      <a
                        href={driveAccessRequestHref}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="magnetic-button mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#18c29c] via-[#2f80ed] to-[#7cc7ff] px-4 py-3 text-sm font-black text-white shadow-lg shadow-[#18c29c]/20 transition-all"
                      >
                        <Mail className="h-4 w-4" />
                        Ask Admin for Drive Access
                      </a>

                      <div className="mt-3 rounded-xl border border-[#f2b84b]/25 bg-gradient-to-r from-[#f2b84b]/12 to-white/[0.035] px-4 py-3 text-xs leading-5 text-[#ffe1a3]">
                        <div className="mb-1 flex items-center gap-2 font-black uppercase tracking-[0.12em] text-[#f2b84b]">
                          <Clock className="h-3.5 w-3.5" />
                          24 hour access window
                        </div>
                        Access will be provided to{" "}
                        <span className="font-black text-white">
                          {student.email}
                        </span>{" "}
                        within 24 hours. Please check your mail inbox for the
                        Google Drive invitation.
                      </div>

                    </div>
                  );
                })}
              </div>
            )}
          </section>

          <section id="student-available-courses">
            <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.18em] text-[#f2b84b]">
                  Grow Next
                </p>
                <h3 className="mt-1 text-xl font-black text-white">
                  Enroll New Courses
                </h3>
              </div>
              <span className="w-fit rounded-full border border-[#f2b84b]/25 bg-[#f2b84b]/10 px-3 py-1 text-xs font-black text-[#ffe4a3]">
                {availableCourses.length} options
              </span>
            </div>

            {availableCourses.length === 0 ? (
              <div className="premium-surface rounded-2xl p-5 text-sm text-slate-300">
                You are enrolled in every available course.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {availableCourses.map((course) => {
                  const Icon = course.icon;
                  const demoAccess = getDemoAccess(course);
                  return (
                    <div
                      key={course.id}
                      className="premium-surface rounded-2xl p-4 transition-transform duration-300 hover:-translate-y-1"
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg ring-1 ring-white/10"
                          style={{
                            background: `linear-gradient(135deg, ${course.accentFrom}25 0%, ${course.accentTo}15 100%)`,
                          }}
                        >
                          <Icon
                            className="w-5 h-5"
                            style={{ color: course.accentFrom }}
                          />
                        </div>
                        <div className="min-w-0">
                          <span
                            className="mb-2 inline-flex rounded-full border px-2 py-0.5 text-[9px] font-black uppercase tracking-[0.12em]"
                            style={{
                              color: course.accentFrom,
                              borderColor: `${course.accentFrom}45`,
                              background: `${course.accentFrom}12`,
                            }}
                          >
                            {course.badge}
                          </span>
                          <h4 className="font-black text-white leading-tight">
                            {course.title}
                          </h4>
                          <p className="mt-1 text-xs text-slate-400">
                            {course.subtitle}
                          </p>
                        </div>
                      </div>

                      <div className="mt-4 flex items-center justify-between gap-3">
                        <div>
                          <div className="text-xl font-black text-white">
                            {formatINR(course.price)}
                          </div>
                          {course.originalPrice && (
                            <div className="text-xs text-slate-500 line-through">
                              {formatINR(course.originalPrice)}
                            </div>
                          )}
                        </div>
                        <button
                          onClick={() => onEnroll(course)}
                          className="magnetic-button rounded-xl bg-gradient-to-r from-[#18c29c] via-[#2f80ed] to-[#7cc7ff] px-4 py-2 text-sm font-black text-white shadow-lg shadow-[#18c29c]/20"
                        >
                          Enroll
                        </button>
                      </div>

                      {demoAccess && (
                        <a
                          href={demoAccess.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-3 flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.055] px-3 py-2 text-xs font-bold text-slate-300 hover:border-[#18c29c]/30 hover:text-white"
                        >
                          <demoAccess.icon className="w-3.5 h-3.5" />
                          {demoAccess.longLabel}
                        </a>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </section>

          <button
            onClick={onLogout}
            className="sm:hidden flex w-full items-center justify-center gap-2 rounded-xl border border-white/12 px-4 py-3 text-sm font-bold text-slate-300"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
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
    password: "",
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
    if (!form.password || form.password.length < 6)
      e.password = "Password must be at least 6 characters";
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
      <div className="relative w-full sm:max-w-md bg-[#07111f] rounded-t-2xl sm:rounded-2xl border border-white/10 shadow-2xl overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(24,194,156,0.14),transparent_42%)]" />
        {/* Header */}
        <div
          className="relative px-6 py-4 flex items-center justify-between border-b border-white/10"
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
              className="font-black text-white text-base"
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
          className="relative px-6 py-6 space-y-4"
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
                className="w-full bg-white/[0.06] border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-white/25 focus:outline-none focus:border-[#18c29c]/60 focus:bg-white/[0.08] transition-all"
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
                className="w-full bg-white/[0.06] border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-white/25 focus:outline-none focus:border-[#18c29c]/60 focus:bg-white/[0.08] transition-all"
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
                className="w-full bg-white/[0.06] border border-white/10 rounded-xl pl-20 pr-4 py-3 text-sm text-white placeholder-white/25 focus:outline-none focus:border-[#18c29c]/60 focus:bg-white/[0.08] transition-all"
              />
            </div>
            {errors.phone && (
              <p className="text-xs text-red-400 mt-1">
                {errors.phone}
              </p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs font-semibold text-white/70 mb-1.5">
              Create Login Password *{" "}
              <span className="text-white/30 font-normal">
                (minimum 6 characters)
              </span>
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
              <input
                type="password"
                value={form.password}
                onChange={(e) =>
                  setForm({ ...form, password: e.target.value })
                }
                placeholder="Create a password"
                className="w-full bg-white/[0.06] border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-white/25 focus:outline-none focus:border-[#18c29c]/60 focus:bg-white/[0.08] transition-all"
              />
            </div>
            {errors.password && (
              <p className="text-xs text-red-400 mt-1">
                {errors.password}
              </p>
            )}
          </div>

          <p className="text-xs text-white/30 leading-relaxed">
            Your details are used only for sending your course
            access, invoice, and student login. We do not share your
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
      <div className="relative w-full sm:max-w-lg bg-[#07111f] rounded-t-2xl sm:rounded-2xl border border-[#18c29c]/30 shadow-2xl overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(24,194,156,0.16),transparent_45%)]" />
        {/* Success header */}
        <div className="relative px-6 pt-8 pb-6 text-center border-b border-white/10 bg-[#18c29c]/5">
          <div className="w-14 h-14 rounded-xl bg-[#18c29c]/20 flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-8 h-8 text-[#8df5d7]" />
          </div>
          <h2
            className="text-xl font-black text-white mb-1"
            style={{
              fontFamily: "'Space Grotesk', system-ui, sans-serif",
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
        <div className="relative px-6 py-5 space-y-4">
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
  const demoAccess = getDemoAccess(course);

  return (
    <div className="premium-surface group relative flex flex-col rounded-2xl overflow-hidden hover:border-[#18c29c]/35 hover:shadow-2xl hover:shadow-[#18c29c]/10 hover:-translate-y-1.5 transition-all duration-300">
      {/* Accent top bar */}
      <div
        className="h-1.5 w-full"
        style={{
          background: `linear-gradient(90deg, ${course.accentFrom} 0%, ${course.accentTo} 100%)`,
        }}
      />

      {/* Hover gradient overlay */}
      <div
        className="absolute inset-0 opacity-60 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background: `radial-gradient(circle at top left, ${course.accentFrom}18, transparent 38%), radial-gradient(circle at bottom right, ${course.accentTo}12, transparent 34%)`,
        }}
      />

      {/* Tag */}
      {course.tag && (
        <div
            className="absolute top-5 right-5 text-[10px] font-black px-3 py-1.5 rounded-full text-white shadow-lg z-10 ring-1 ring-white/20"
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
            className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md ring-1 ring-white/10 group-hover:scale-105 transition-transform duration-300"
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
            className="text-[10px] font-mono font-bold tracking-widest px-2.5 py-1 rounded-full border uppercase"
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
          className="text-xl font-black text-white leading-tight mb-1 relative z-10 group-hover:text-[#fff8dd]"
          style={{
            fontFamily:
              "'Space Grotesk', system-ui, sans-serif",
          }}
        >
          {course.title}
        </h3>
        <p className="text-sm text-slate-400 mb-5 relative z-10">
          {course.subtitle}
        </p>

        {/* Meta pills */}
        <div className="flex flex-wrap gap-2 mb-5">
          {course.duration && (
            <span className="flex items-center gap-1 text-xs text-slate-300 bg-white/[0.07] border border-white/10 px-2.5 py-1 rounded-full">
              <Clock className="w-3 h-3" />
              {course.duration}
            </span>
          )}
          {course.timings && (
            <span className="flex items-center gap-1 text-xs text-[#b8fff0] bg-[#18c29c]/12 border border-[#18c29c]/28 px-2.5 py-1 rounded-full shadow-sm shadow-[#18c29c]/10">
              <MonitorPlay className="w-3 h-3" />
              Live
            </span>
          )}
          <span className="flex items-center gap-1 text-xs text-slate-300 bg-white/[0.07] border border-white/10 px-2.5 py-1 rounded-full">
            <BookOpen className="w-3 h-3" />
            {TYPE_LABELS[course.type]}
          </span>
        </div>

        {/* Highlights (top 4) */}
        <ul className="space-y-2 mb-6 flex-1">
          {course.highlights.slice(0, 4).map((h) => (
            <li
              key={h}
              className="flex items-start gap-2.5 text-xs leading-relaxed text-slate-300"
            >
              <Check className="w-3.5 h-3.5 text-emerald-300 mt-0.5 flex-shrink-0 drop-shadow-[0_0_8px_rgba(110,231,183,0.35)]" />
              {h}
            </li>
          ))}
        </ul>

        {/* Price */}
        <div className="flex flex-wrap items-baseline gap-2 mb-5 relative z-10 rounded-xl border border-white/10 bg-gradient-to-r from-white/[0.075] to-white/[0.035] px-4 py-3 shadow-inner shadow-white/5">
          <span
            className="text-3xl font-black text-white"
            style={{
              fontFamily:
                "'Space Grotesk', system-ui, sans-serif",
            }}
          >
            {formatINR(course.price)}
          </span>
          {course.originalPrice && (
            <span className="text-slate-500 line-through text-base">
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
        <div className="relative z-10 space-y-3">
          {demoAccess && (
            <a
              href={demoAccess.href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-[#18c29c]/30 bg-[#18c29c]/10 px-4 py-3 text-sm font-black text-[#9cf8dd] hover:border-[#18c29c]/55 hover:bg-[#18c29c]/16 transition-all"
            >
              <demoAccess.icon className="h-4 w-4" />
              {demoAccess.longLabel}
            </a>
          )}
          <div className="flex gap-3">
          <button
            onClick={() => onEnroll(course)}
            className="magnetic-button flex-1 py-3 rounded-xl text-sm font-bold text-white hover:shadow-xl active:scale-[0.99] transition-all shadow-lg"
            style={{
              background: `linear-gradient(135deg, ${course.accentFrom} 0%, ${course.accentTo} 100%)`,
            }}
          >
            Enroll Now
          </button>
          <button
            onClick={() => onViewDetails(course)}
            className="px-5 py-3 rounded-xl text-sm font-semibold border border-white/12 text-slate-200 hover:bg-white/[0.07] hover:text-white hover:border-[#f2b84b]/40 transition-all"
          >
            Details
          </button>
          </div>
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
  const [scrollProgress, setScrollProgress] = useState(0);
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

  useEffect(() => {
    const updateProgress = () => {
      const scrollable =
        document.documentElement.scrollHeight - window.innerHeight;
      const nextProgress =
        scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0;
      setScrollProgress(Math.min(100, Math.max(0, nextProgress)));
    };

    updateProgress();
    window.addEventListener("scroll", updateProgress, {
      passive: true,
    });
    window.addEventListener("resize", updateProgress);

    return () => {
      window.removeEventListener("scroll", updateProgress);
      window.removeEventListener("resize", updateProgress);
    };
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
    const section = document.getElementById(id);
    if (section) {
      const fixedTopOffset = 112;
      window.scrollTo({
        top:
          section.getBoundingClientRect().top +
          window.scrollY -
          fixedTopOffset,
        behavior: "smooth",
      });
    }
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
                password: student.password,
                enrolledCourses: [course.id],
                createdAt: new Date().toISOString(),
              };
            } else {
              // Add course to existing student
              students[student.email].name = student.name;
              students[student.email].phone = student.phone;
              students[student.email].password = student.password;
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
      className="min-h-screen bg-background text-foreground overflow-x-hidden selection:bg-[#f2b84b]/25"
      style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}
    >
      {/* ── Navbar ──────────────────────────────────────────────── */}
      <div className="fixed inset-x-0 top-0 z-[90] h-1 bg-[#07111f]">
        <div
          className="h-full rounded-r-full bg-gradient-to-r from-[#18c29c] via-[#7cc7ff] to-[#f2b84b] shadow-[0_0_20px_rgba(242,184,75,0.45)] transition-[width] duration-150"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      <nav className="fixed inset-x-0 top-1 z-[70] border-b border-white/10 bg-[#07111f]/88 shadow-2xl shadow-black/25 backdrop-blur-2xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
          <div className="flex items-center gap-2.5">
            <div className="w-11 h-11 rounded-xl bg-white flex items-center justify-center shadow-lg shadow-[#18c29c]/20 ring-1 ring-white/15 overflow-hidden">
              <img
                src={skillVaneLogo}
                alt="SkillVane logo"
                className="h-10 w-10 object-contain"
              />
            </div>
            <span
              className="font-bold text-base tracking-tight"
              style={{
                fontFamily:
                  "'Space Grotesk', system-ui, sans-serif",
              }}
            >
              SkillVane{" "}
              <span className="bg-gradient-to-r from-[#18c29c] via-[#7cc7ff] to-[#f2b84b] bg-clip-text text-transparent">
                IT Academy
              </span>
            </span>
          </div>

          <div className="hidden md:flex items-center gap-1 rounded-full border border-white/10 bg-white/[0.045] p-1 text-sm text-muted-foreground">
            <button
              onClick={() => scrollTo("courses")}
              className="rounded-full px-4 py-2 font-bold hover:bg-white/[0.08] hover:text-foreground transition-colors"
            >
              Courses
            </button>
            <button
              onClick={() => scrollTo("instructor")}
              className="rounded-full px-4 py-2 font-bold hover:bg-white/[0.08] hover:text-foreground transition-colors"
            >
              Instructor
            </button>
            <button
              onClick={() => scrollTo("testimonials")}
              className="rounded-full px-4 py-2 font-bold hover:bg-white/[0.08] hover:text-foreground transition-colors"
            >
              Reviews
            </button>
            <button
              onClick={() => scrollTo("faq")}
              className="rounded-full px-4 py-2 font-bold hover:bg-white/[0.08] hover:text-foreground transition-colors"
            >
              FAQ
            </button>
          </div>

          <div className="hidden md:flex items-center gap-3">
            <div className="hidden lg:flex items-center gap-2">
              <a
                href="https://chat.whatsapp.com/J7vV8uKF8hSE5Zsx6ltoD1"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex h-10 w-10 items-center justify-center rounded-xl border border-[#25D366]/25 bg-[#25D366]/12 shadow-lg shadow-[#25D366]/10 hover:border-[#25D366]/45 hover:bg-[#25D366]/18"
                aria-label="Join WhatsApp Group"
              >
                <MessageCircle className="h-5 w-5 text-[#68f6a4] group-hover:scale-110 transition-transform" />
              </a>
              <a
                href="tel:+917305101711"
                className="group flex h-10 w-10 items-center justify-center rounded-xl border border-[#18c29c]/25 bg-[#18c29c]/12 shadow-lg shadow-[#18c29c]/10 hover:border-[#18c29c]/45 hover:bg-[#18c29c]/18"
                aria-label="Call us"
              >
                <Phone className="h-5 w-5 text-[#9cf8dd] group-hover:scale-110 transition-transform" />
              </a>
            </div>

            {currentStudent ? (
              <button
                onClick={() => setShowDashboard(true)}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#18c29c] to-[#2f80ed] text-white text-sm font-semibold hover:shadow-xl hover:shadow-[#18c29c]/30 hover:scale-105 transition-all shadow-lg shadow-[#18c29c]/20"
              >
                <GraduationCap className="w-4 h-4" />
                My Dashboard
              </button>
            ) : (
              <>
                <button
                  onClick={() => setShowLogin(true)}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg border border-white/12 text-muted-foreground hover:text-foreground hover:border-[#18c29c]/40 transition-all text-sm font-semibold"
                >
                  <LogIn className="w-4 h-4" />
                  Login
                </button>
                <button
                  onClick={() => scrollTo("courses")}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#18c29c] to-[#2f80ed] text-white text-sm font-semibold hover:shadow-xl hover:shadow-[#18c29c]/30 hover:scale-105 transition-all shadow-lg shadow-[#18c29c]/20"
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
          <div className="md:hidden bg-[#0b1524] border-t border-white/10 px-4 py-4 flex flex-col gap-1">
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
                className="mt-3 w-full py-3 rounded-xl bg-gradient-to-r from-[#18c29c] to-[#2f80ed] text-white text-sm font-semibold shadow-lg shadow-[#18c29c]/20 flex items-center justify-center gap-2"
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
                  className="mt-3 w-full py-3 rounded-xl border border-white/12 text-foreground text-sm font-semibold flex items-center justify-center gap-2"
                >
                  <LogIn className="w-4 h-4" />
                  Login
                </button>
                <button
                  onClick={() => scrollTo("courses")}
                  className="mt-2 w-full py-3 rounded-xl bg-gradient-to-r from-[#18c29c] to-[#2f80ed] text-white text-sm font-semibold shadow-lg shadow-[#18c29c]/20"
                >
                  View Courses →
                </button>
              </>
            )}
            <div className="mt-3 grid grid-cols-2 gap-2">
              <a
                href="https://chat.whatsapp.com/J7vV8uKF8hSE5Zsx6ltoD1"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 rounded-xl border border-[#25D366]/25 bg-[#25D366]/12 px-3 py-3 text-sm font-black text-[#b8ffd0]"
              >
                <MessageCircle className="h-4 w-4" />
                WhatsApp
              </a>
              <a
                href="tel:+917305101711"
                className="flex items-center justify-center gap-2 rounded-xl border border-[#18c29c]/25 bg-[#18c29c]/12 px-3 py-3 text-sm font-black text-[#9cf8dd]"
              >
                <Phone className="h-4 w-4" />
                Call
              </a>
            </div>
          </div>
        )}
      </nav>

      {!showDashboard && (
        <div className="trainer-support-card fixed bottom-5 right-5 z-50 w-[min(calc(100vw-1.5rem),320px)] rounded-2xl border border-[#f2b84b]/30 bg-[#07111f]/92 p-4 shadow-2xl shadow-black/30 backdrop-blur-xl">
          <div className="space-y-3">
            <div className="flex min-w-0 items-center gap-3">
              <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#f2b84b] to-[#fff0a8] shadow-lg shadow-[#f2b84b]/20">
                <MessageCircle className="h-4 w-4 text-[#1b1202]" />
              </span>
              <div className="min-w-0">
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#f2b84b]">
                  Trainer Support
                </p>
                <p className="mt-1 text-sm font-bold leading-5 text-white">
                  Questions about courses, access, or enrollment?
                </p>
              </div>
            </div>

            <a
              href={TRAINER_WHATSAPP_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="magnetic-button inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#25D366] px-4 py-2.5 text-sm font-black text-white shadow-lg shadow-[#25D366]/20"
              aria-label="Message the trainer on WhatsApp"
            >
              WhatsApp Trainer
              <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </div>
      )}

      {/* ── Floating Contact Buttons ─────────────────────────────── */}
      {/* ── Hero ────────────────────────────────────────────────── */}
      <section
        className="relative min-h-screen overflow-hidden bg-[#07111f] pt-24 sm:pt-28"
        style={{
          backgroundImage: `linear-gradient(90deg, rgba(7,17,31,0.99) 0%, rgba(7,17,31,0.93) 38%, rgba(7,17,31,0.5) 68%, rgba(7,17,31,0.82) 100%), url(${instructorPhoto})`,
          backgroundPosition: "center, right 18% top",
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover, min(50rem, 58vw) auto",
        }}
      >
        <div className="pointer-events-none absolute inset-0">
          <div
            className="absolute inset-0 opacity-[0.09]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,0.9) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.9) 1px, transparent 1px)",
              backgroundSize: "72px 72px",
              maskImage:
                "linear-gradient(to bottom, black 0%, transparent 82%)",
            }}
          />
          <div className="absolute left-0 top-0 h-full w-full bg-[radial-gradient(ellipse_at_20%_12%,rgba(24,194,156,0.2),transparent_38%),radial-gradient(ellipse_at_82%_78%,rgba(242,184,75,0.16),transparent_34%)]" />
          <div className="absolute right-[5%] top-28 hidden h-64 w-64 rounded-full border border-[#f2b84b]/15 bg-[#f2b84b]/5 blur-3xl lg:block" />
          <div className="absolute bottom-0 left-0 h-32 w-full bg-gradient-to-t from-background to-transparent" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 min-h-[calc(100vh-9rem)] flex flex-col justify-center py-14 sm:py-20">
          <div className="max-w-3xl">
            <button
              onClick={() => scrollTo("courses")}
              className="group mb-7 inline-flex items-center gap-2.5 rounded-full border border-[#f2b84b]/35 bg-[#f2b84b]/10 px-4 py-2 text-left text-xs font-bold uppercase tracking-[0.18em] shadow-lg shadow-[#f2b84b]/10 backdrop-blur-md hover:border-[#f2b84b]/60"
            >
              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#18c29c] opacity-75" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[#18c29c]" />
              </span>

              <span className="bg-gradient-to-r from-yellow-300 via-yellow-400 to-amber-500 bg-clip-text text-transparent">
                New live batch starts July 1, 2026 at 7.30 AM IST
              </span>
              <ArrowRight className="h-4 w-4 text-[#f2b84b] transition-transform group-hover:translate-x-1" />
            </button>

            <h1
              className="max-w-4xl text-4xl font-black leading-[1.03] tracking-tight text-white sm:text-6xl lg:text-7xl"
              style={{
                fontFamily: "'Space Grotesk', system-ui, sans-serif",
              }}
            >
              Learn GCP Data Engineering From{" "}
              <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                Shaik Saidhul
              </span>
            </h1>

            <p className="mt-6 max-w-2xl text-base leading-8 text-slate-300 sm:text-xl">
              At SkillVane, we offer industry-focused Google Cloud Data Engineering training through live classes, hands-on projects, real-world case studies, and dedicated career support to help you become job-ready.
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <button
                onClick={() => scrollTo("courses")}
                className="magnetic-button group inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#18c29c] via-[#2f80ed] to-[#7cc7ff] px-7 py-4 text-base font-extrabold text-white shadow-2xl shadow-[#18c29c]/25 active:scale-[0.98]"
              >
                Explore Courses
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </button>
              <button
                onClick={() => scrollTo("instructor")}
                className="magnetic-button inline-flex items-center justify-center gap-3 rounded-xl border border-white/18 bg-white/8 px-7 py-4 text-base font-bold text-white backdrop-blur-md hover:border-[#f2b84b]/50 hover:bg-white/12"
              >
                <Play className="h-5 w-5 text-[#f2b84b]" />
                Meet Instructor
              </button>
            </div>

            <div className="mt-9 flex flex-wrap items-center gap-3 text-sm text-slate-300">
              {[
                "Daily live sessions",
                "Recordings shared",
                "Portfolio projects",
                "Resume guidance",
              ].map((item) => (
                <span
                  key={item}
                  className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.08] px-3 py-2 shadow-lg shadow-black/10 backdrop-blur-md hover:border-[#18c29c]/35"
                >
                  <CheckCircle2 className="h-4 w-4 text-[#18c29c]" />
                  {item}
                </span>
              ))}
            </div>
          </div>

          <div className="mt-12 grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {[
                {
                  icon: Users,
                  val: "1500+",
                  sub: "Learners",
                },
                {
                  icon: Star,
                  val: "4.9/5",
                  sub: "Rating",
                },
                {
                  icon: Award,
                  val: "9+ yrs",
                  sub: "Experience",
                },
                {
                  icon: BookOpen,
                  val: "5",
                  sub: "Programs",
                },
              ].map(({ icon: Ic, val, sub }) => (
                <div
                  key={sub}
                  className="premium-surface rounded-xl p-4 transition-transform duration-300 hover:-translate-y-1"
                >
                  <Ic className="mb-3 h-5 w-5 text-[#f2b84b]" />
                  <div
                    className="text-2xl font-black text-white"
                    style={{
                      fontFamily:
                        "'Space Grotesk', system-ui, sans-serif",
                    }}
                  >
                    {val}
                  </div>
                  <div className="mt-1 text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">
                    {sub}
                  </div>
                </div>
              ))}
            </div>

            <div className="premium-surface rounded-xl p-4">
              <div className="mb-4 flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#8df5d7]">
                    Live Learning Path
                  </p>
                  <h2
                    className="mt-1 text-xl font-black text-white"
                    style={{
                      fontFamily:
                        "'Space Grotesk', system-ui, sans-serif",
                    }}
                  >
                    GCP Data Engineering
                  </h2>
                </div>
                <span className="rounded-lg bg-[#f2b84b] px-3 py-1 text-xs font-black text-[#1d1602]">
                  3 Months
                </span>
              </div>

              <div className="grid gap-2 sm:grid-cols-2">
                {[
                  { icon: Database, label: "BigQuery + SQL" },
                  { icon: Zap, label: "Dataflow + Beam" },
                  { icon: Layers, label: "Dataproc + Spark" },
                  { icon: GitBranch, label: "Composer + CI/CD" },
                ].map(({ icon: Ic, label }) => (
                    <div
                      key={label}
                    className="flex items-center gap-3 rounded-lg border border-white/10 bg-white/[0.065] px-3 py-3 hover:border-[#7cc7ff]/30"
                    >
                    <Ic className="h-5 w-5 text-[#7cc7ff]" />
                    <span className="text-sm font-semibold text-slate-200">
                      {label}
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-4 flex items-center justify-between gap-4 rounded-lg border border-[#18c29c]/25 bg-[#18c29c]/12 px-4 py-3 shadow-lg shadow-[#18c29c]/10">
                <span className="flex items-center gap-2 text-sm font-semibold text-[#c9fff0]">
                  <Shield className="h-4 w-4" />
                  {TICKER[ticker]}
                </span>
                <button
                  onClick={() => scrollTo("courses")}
                  className="text-sm font-black text-white hover:text-[#f2b84b]"
                >
                  View plan
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Courses ─────────────────────────────────────────────── */}
      <section
        id="courses"
        className="relative py-20 sm:py-28 bg-[#07111f] overflow-hidden"
      >
        {/* Background decoration */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_15%_10%,rgba(24,194,156,0.14),transparent_36%),radial-gradient(ellipse_at_88%_30%,rgba(242,184,75,0.1),transparent_30%)]" />
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.055]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.85) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.85) 1px, transparent 1px)",
            backgroundSize: "64px 64px",
          }}
        />
        <div className="pointer-events-none absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#18c29c]/60 to-transparent" />
        <div className="pointer-events-none absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#f2b84b]/40 to-transparent" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
          <div className="mx-auto mb-12 max-w-3xl text-center sm:mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#18c29c]/10 border border-[#18c29c]/25 text-xs font-mono text-[#8df5d7] tracking-widest uppercase mb-6 shadow-lg shadow-[#18c29c]/10">
              <span className="w-2 h-2 rounded-full bg-[#18c29c] animate-pulse" />
              Premium Programs
            </div>
            <h2
              className="text-4xl sm:text-5xl lg:text-6xl font-black mb-6 text-white"
              style={{
                fontFamily:
                  "'Space Grotesk', system-ui, sans-serif",
              }}
            >
              Pick your GCP learning path.
            </h2>
            <p className="text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
              Choose the format that fits your schedule and career goals.
            </p>
          </div>

          {/* Filter tabs */}
          <div className="premium-surface mx-auto mb-12 flex w-fit max-w-full flex-wrap justify-center gap-2 rounded-2xl p-2">
            {FILTERS.map(({ label, value }) => (
              <button
                key={value}
                onClick={() => setActiveFilter(value)}
                className={`relative px-5 py-3 rounded-lg text-sm font-bold transition-all ${
                  activeFilter === value
                    ? "bg-gradient-to-r from-[#18c29c] to-[#2f80ed] text-white shadow-lg shadow-[#18c29c]/20"
                    : "text-slate-300 hover:text-white hover:bg-white/[0.07]"
                }`}
              >
                {activeFilter === value && (
                  <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-[#18c29c] to-[#2f80ed] opacity-100" />
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6">
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

          <p className="text-center text-xs text-slate-500 mt-8">
            More courses coming soon · All prices in INR
            inclusive of taxes
          </p>
        </div>
      </section>

      {/* ── Instructor ──────────────────────────────────────────── */}
      <section
        id="instructor"
        className="relative py-20 sm:py-28 bg-[#08111f] overflow-hidden"
      >
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_18%_20%,rgba(24,194,156,0.12),transparent_32%),radial-gradient(ellipse_at_86%_62%,rgba(47,128,237,0.1),transparent_34%)]" />
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <span className="inline-flex rounded-full border border-[#18c29c]/25 bg-[#18c29c]/10 px-4 py-2 text-xs font-mono text-[#8df5d7] tracking-widest uppercase">
              Your Instructor
            </span>
            <h2
              className="text-3xl sm:text-4xl font-black mt-2 text-white"
              style={{
                fontFamily: "'Space Grotesk', system-ui, sans-serif",
              }}
            >
              Learn From a Working Professional
            </h2>
          </div>

          <div className="premium-surface rounded-2xl p-5 sm:p-7 flex flex-col md:flex-row gap-8 md:gap-12 items-center md:items-start">
            <div className="flex-shrink-0 flex flex-col items-center gap-3">
              <div className="premium-ring relative w-40 h-52 sm:w-52 sm:h-64 rounded-2xl overflow-hidden shadow-2xl shadow-[#18c29c]/20 ring-1 ring-white/12">
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
                className="text-2xl sm:text-3xl font-black mb-1 text-white"
                style={{
                  fontFamily: "'Space Grotesk', system-ui, sans-serif",
                }}
              >
                Shaik Saidhul
              </h3>
              <p className="text-[#8df5d7] font-semibold text-sm mb-5">
                Solution Architect · SkillVane IT Academy
              </p>
              <p className="text-slate-300 text-sm leading-relaxed mb-8 max-w-xl">
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
                      className="rounded-xl border border-white/10 bg-[#07111f]/72 p-3 text-center shadow-lg shadow-black/10 sm:p-4"
                  >
                    <div
                      className="text-xl sm:text-2xl font-black text-[#f2b84b]"
                      style={{
                        fontFamily:
                          "'Outfit', system-ui, sans-serif",
                      }}
                    >
                      {value}
                    </div>
                    <div className="text-xs text-slate-400 mt-1">
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
        className="relative py-20 sm:py-28 bg-[#07111f] border-y border-white/10 overflow-hidden"
      >
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_22%_12%,rgba(242,184,75,0.1),transparent_30%),radial-gradient(ellipse_at_80%_70%,rgba(24,194,156,0.1),transparent_34%)]" />
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <span className="inline-flex rounded-full border border-[#f2b84b]/25 bg-[#f2b84b]/10 px-4 py-2 text-xs font-mono text-[#ffe4a3] tracking-widest uppercase">
              Reviews
            </span>
            <h2
              className="text-3xl sm:text-4xl font-black mt-2 mb-3 text-white"
              style={{
                fontFamily: "'Space Grotesk', system-ui, sans-serif",
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
              <span className="ml-2 text-slate-400 text-sm">
                4.9 / 5 · 500+ ratings
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {TESTIMONIALS.map((t) => (
              <div
                key={t.name}
                className="premium-surface rounded-2xl p-6 transition-transform duration-300 hover:-translate-y-1 hover:border-[#18c29c]/35"
              >
                <div className="flex gap-0.5 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-4 h-4 text-yellow-400 fill-yellow-400"
                    />
                  ))}
                </div>
                <p className="text-slate-300 text-sm leading-relaxed mb-5">
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
                        className="font-semibold text-sm text-white"
                      style={{
                        fontFamily:
                          "'Outfit', system-ui, sans-serif",
                      }}
                    >
                      {t.name}
                    </div>
                    <div className="text-xs text-slate-400">
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
      <section id="faq" className="relative py-20 sm:py-28 bg-[#08111f] overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(242,184,75,0.1),transparent_38%)]" />
        <div className="relative max-w-3xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <span className="inline-flex rounded-full border border-[#f2b84b]/25 bg-[#f2b84b]/10 px-4 py-2 text-xs font-mono text-[#f2b84b] tracking-widest uppercase">
              FAQ
            </span>
            <h2
              className="text-3xl sm:text-4xl font-black mt-2 text-white"
              style={{
                fontFamily: "'Space Grotesk', system-ui, sans-serif",
              }}
            >
              Common Questions
            </h2>
          </div>

          <div className="space-y-2">
            {faqs.map((faq, i) => (
              <div
                key={i}
                className="premium-surface rounded-xl overflow-hidden"
              >
                <button
                  className="w-full flex items-center justify-between p-5 text-left hover:bg-white/[0.06] transition-colors"
                  onClick={() =>
                    setOpenFaq(openFaq === i ? null : i)
                  }
                >
                  <span className="font-semibold text-sm pr-4 text-slate-100">
                    {faq.q}
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-400 flex-shrink-0 transition-transform duration-200 ${
                      openFaq === i ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {openFaq === i && (
                  <div className="px-5 pb-5 border-t border-white/10 bg-[#07111f]/70">
                    <p className="text-sm text-slate-300 pt-4 leading-relaxed">
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
      <section className="relative py-20 border-t border-white/10 bg-[#07111f] overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(24,194,156,0.18),transparent_42%),radial-gradient(ellipse_at_80%_30%,rgba(242,184,75,0.12),transparent_32%)]" />
        <div className="relative max-w-2xl mx-auto px-4 sm:px-6 text-center">
          <h2
            className="text-3xl sm:text-5xl font-black mb-4 text-white"
            style={{
              fontFamily: "'Space Grotesk', system-ui, sans-serif",
            }}
          >
            Start your GCP journey today
          </h2>
          <p className="text-slate-300 text-sm sm:text-base mb-8">
            5 courses. Live batch, recordings, foundation &
            projects. One academy, trusted by 500+
            professionals.
          </p>
          <button
            onClick={() => scrollTo("courses")}
            className="magnetic-button px-10 py-4 rounded-xl bg-gradient-to-r from-[#18c29c] via-[#2f80ed] to-[#7cc7ff] text-white font-black text-base active:scale-[0.98] transition-all shadow-xl shadow-[#18c29c]/25"
          >
            Browse All Courses →
          </button>
        </div>
      </section>

      {/* ── Footer ──────────────────────────────────────────────── */}
      <footer className="py-8 border-t border-white/10 bg-[#050b14]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-md bg-white flex items-center justify-center overflow-hidden">
              <img
                src={skillVaneLogo}
                alt="SkillVane logo"
                className="h-7 w-7 object-contain"
              />
            </div>
            <span
              className="font-bold text-white"
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
              className="hover:text-white transition-colors"
            >
              Privacy Policy
            </a>
            <a
              href="#"
              className="hover:text-white transition-colors"
            >
              Terms
            </a>
            <a
              href="#"
              className="hover:text-white transition-colors"
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
          onEnroll={(course) => {
            setShowDashboard(false);
            handleEnroll(course);
          }}
        />
      )}
    </div>
  );
}
