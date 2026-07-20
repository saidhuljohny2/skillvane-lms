import { useState, useEffect, useRef } from "react";
import { ImageWithFallback } from "@/app/components/figma/ImageWithFallback";
import instructorPhoto from "@/imports/IMG_20260518_113243.jpg.jpeg";
import skillVaneLogo from "@/imports/logo1.png";
import gcpDataEngineeringCurriculum from "@/imports/gcp-data-engineering-curriculum.pdf";
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
  Landmark,
  ArrowRight,
  MonitorPlay,
  FileText,
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
  Youtube,
  Send,
  Linkedin,
} from "lucide-react";
import { motion } from "motion/react";
import { Navbar } from "@/app/components/landing/Navbar";
import { LandingHero } from "@/app/components/landing/LandingHero";
import { EnrollmentTicker } from "@/app/components/effects/EnrollmentTicker";
import { GcpTechMarquee } from "@/app/components/effects/GcpTechMarquee";
import { SectionHeading } from "@/app/components/landing/SectionHeading";
import { AdminStudentsModal } from "@/app/components/modals/AdminStudentsModal";
import { StudentDashboard } from "@/app/components/modals/StudentDashboard";
import { TestimonialMarquee } from "@/app/components/effects/TestimonialMarquee";
import { FinalCTA } from "@/app/components/landing/FinalCTA";
import { BackToTop } from "@/app/components/landing/BackToTop";
import { SimpleChatbot } from "@/app/components/landing/SimpleChatbot";
import { Reveal } from "@/app/components/effects/Reveal";

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// CONFIG - Update these two values after setup (see guide below)
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const RAZORPAY_KEY = "rzp_live_Sx2SDk8J6c6HBk";
const RAZORPAY_KEY_SECRET = "sBIaKza4uMIkT6ehyhqwRQts";

// Paste your Google Apps Script deployment URL here after setup:
const GOOGLE_SHEET_WEBHOOK_URL =
  "https://script.google.com/macros/s/AKfycbwNJMNfBQKYE4WoXJJDCSqOzJvmRYbx-VqNTYr3BdFpvwcxNiqW3puqQJHsSk30gRKj/exec";

// Paste your EmailJS credentials here after setup:
const EMAILJS_SERVICE_ID = "service_huss9yj";
const EMAILJS_INVOICE_TEMPLATE_ID = "template_jqy6yhj";
const EMAILJS_PASSWORD_OTP_TEMPLATE_ID = "template_fx61y3u";
const EMAILJS_PUBLIC_KEY = "xC4HlrScSivWvpXtz";
const TRAINER_WHATSAPP_LINK =
  "https://wa.me/917305101711?text=Hi%20Trainer%2C%20I%20have%20a%20question%20about%20SkillVane%20courses.%20Please%20guide%20me.";
const ADMIN_EMAIL = "saidhuljohny@gmail.com";
const ADMIN_DEFAULT_PASSWORD = "SkillVane@1711";
const OTP_VALIDITY_MS = 10 * 60 * 1000;
const ENROLLMENT_COUPON_CODE = "SKILLVANE10";
const ENROLLMENT_COUPON_DISCOUNT_PERCENT = 10;
const ENROLLMENT_COUPON_START_DATE = "2026-06-23T00:00:00+05:30";
const ENROLLMENT_COUPON_VALID_DAYS = 7;

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// COURSE DATA - Add a new course here and it appears on the site
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
type CourseType = "live" | "recording" | "course" | "project";
type CourseCategory = "all" | "live-batch" | "self-paced";

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
  curriculumDownload?: string;
  tag?: string;
  zoomLink?: string; // For live batch courses
  driveLink?: string; // For recording courses
  notesLink?: string; // Notes/material handout link for enrolled students
}

const COURSES: Course[] = [
  // â”€â”€ Course 1 â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  {
    id: "gcp-live",
    type: "live",
    badge: "LIVE BATCH",
    icon: MonitorPlay,
    accentFrom: "#4361ee",
    accentTo: "#3bc9db",
    title: "New Batch: GCP Data Engineering",
    subtitle: "Full Course - Live Morning Batch",
    price: 12000,
    originalPrice: 15000,
    duration: "3 months",
    timings: "7:00 AM to 8:00 AM",
    curriculumDownload: gcpDataEngineeringCurriculum,
    tag: "Main Focus",
    highlights: [
      "Demo: July 1, 2, and 3 - three free demo classes",
      "Daily live sessions from 7:00 AM to 8:00 AM",
      "Recordings Shared Daily",
      "Comprehensive Material",
      "Resume assistance & career guidance",
      "Live doubt-clearing in every session",
      "Private student community access",
    ],
    curriculum: [
      // â”€â”€ PASTE YOUR CURRICULUM HERE â”€â”€
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

  // â”€â”€ Course 2 â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  {
    id: "gcp-recordings",
    type: "recording",
    badge: "SELF-PACED",
    icon: Video,
    accentFrom: "#7c3aed",
    accentTo: "#a855f7",
    title: "GCP Data Engineering",
    subtitle: "Course - Recordings",
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
      // â”€â”€ PASTE YOUR CURRICULUM HERE â”€â”€
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

  // â”€â”€ Course 3 â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
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

  // â”€â”€ Course 4 â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  {
    id: "project-healthcare",
    type: "project",
    badge: "REAL PROJECT",
    icon: Heart,
    accentFrom: "#dc2626",
    accentTo: "#f87171",
    title: "Health Care GCP",
    subtitle: "Data Engineering Project",
    price: 899,
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
      // â”€â”€ PASTE YOUR CURRICULUM HERE â”€â”€
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
          "Pub/Sub -> Dataflow Streaming Ingestion",
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

  // â”€â”€ Course 5 â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  {
    id: "project-retail",
    type: "project",
    badge: "REAL PROJECT",
    icon: ShoppingCart,
    accentFrom: "#d97706",
    accentTo: "#f59e0b",
    title: "Retailer GCP",
    subtitle: "Data Engineering Project",
    price: 899,
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
      // â”€â”€ PASTE YOUR CURRICULUM HERE â”€â”€
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
          "Pub/Sub -> Dataflow for Live Order Events",
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

  // â”€â”€ Course 6 â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  {
    id: "project-banking",
    type: "project",
    badge: "REAL PROJECT",
    icon: Landmark,
    accentFrom: "#059669",
    accentTo: "#22c55e",
    title: "Banking GCP",
    subtitle: "Data Engineering Project",
    price: 899,
    originalPrice: 3000,
    highlights: [
      "End-to-end real-world banking data platform",
      "Cloud SQL, Pub/Sub, GCS, BigQuery & Dataproc pipelines",
      "Bronze, Silver and Gold layer implementation",
      "Airflow orchestration with production-style DAGs",
      "CI/CD with Cloud Build, GitHub and Airflow",
      "Portfolio-ready architecture walkthrough and code review",
    ],
    curriculum: [
      {
        module: "Project Overview & Architecture",
        topics: [
          "Banking Data Platform Introduction",
          "Architecture and Service Selection on GCP",
          "Project Setup and Banking Dataset Walkthrough",
        ],
      },
      {
        module: "Source Systems & Landing Setup",
        topics: [
          "Cloud SQL MySQL Source Setup",
          "Pub/Sub Source Setup",
          "Landing Layer and Metadata Layer Setup",
        ],
      },
      {
        module: "Batch & Streaming Ingestion",
        topics: [
          "Cloud SQL to GCS Ingestion Pipeline",
          "Pub/Sub to BigQuery Ingestion Pipeline",
          "Dataproc Cluster Creation",
        ],
      },
      {
        module: "Medallion Data Processing",
        topics: [
          "Bronze Layer Loading with PySpark on Dataproc",
          "Silver Layer Transformations",
          "Gold Layer Business-Ready Tables",
        ],
      },
      {
        module: "Airflow Orchestration & CI/CD",
        topics: [
          "Airflow Environment Creation",
          "Banking Ingestion, Bronze, Silver and Gold DAGs",
          "Manual DAG Triggering and CI/CD with Cloud Build",
        ],
      },
    ],
    driveLink:
      "https://drive.google.com/drive/folders/REPLACE_WITH_BANKING_PROJECT_LINK", // Replace with Banking project Google Drive folder link
    notesLink:
      "https://drive.google.com/drive/folders/REPLACE_WITH_BANKING_NOTES_LINK", // Replace with Banking notes link
  },

  // â”€â”€ ADD A NEW COURSE HERE â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  // Copy any block above, change the id, content, price, and colors.
  // The card will appear automatically on the site.
];

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// Static data
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const FREE_LEARNING_PLAYLIST_URL =
  "https://www.youtube.com/playlist?list=PLk8wwChOsCPzoZHuQEiJqWVvhHFdFa6sy";

const TYPE_LABELS: Record<CourseType, string> = {
  live: "Live Batch",
  recording: "Self-Paced",
  course: "Foundation",
  project: "Project",
};

const CATEGORY_LABELS: Record<CourseCategory, string> = {
  all: "All",
  "live-batch": "Live Batch",
  "self-paced": "Self-paced",
};

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// Helpers
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function formatINR(n: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(n);
}

function getCouponExpiryDate() {
  const startDate = new Date(ENROLLMENT_COUPON_START_DATE);
  startDate.setDate(
    startDate.getDate() + ENROLLMENT_COUPON_VALID_DAYS,
  );
  return startDate;
}

function getDefaultPricing(course: Course): PaymentPricing {
  return {
    originalAmount: course.price,
    discountAmount: 0,
    amountPaid: course.price,
  };
}

function getCouponPricing(
  course: Course,
  inputCode: string,
): {
  pricing: PaymentPricing;
  valid: boolean;
  message: string;
} {
  const code = inputCode.trim().toUpperCase();
  const expiryDate = getCouponExpiryDate();

  if (!code) {
    return {
      pricing: getDefaultPricing(course),
      valid: false,
      message: "Enter coupon code to check discount.",
    };
  }

  if (code !== ENROLLMENT_COUPON_CODE) {
    return {
      pricing: getDefaultPricing(course),
      valid: false,
      message: "Coupon code is not valid.",
    };
  }

  if (Date.now() > expiryDate.getTime()) {
    return {
      pricing: getDefaultPricing(course),
      valid: false,
      message: "This coupon has expired.",
    };
  }

  const discountAmount = Math.round(
    (course.price * ENROLLMENT_COUPON_DISCOUNT_PERCENT) / 100,
  );

  return {
    pricing: {
      originalAmount: course.price,
      discountAmount,
      amountPaid: Math.max(0, course.price - discountAmount),
      couponCode: ENROLLMENT_COUPON_CODE,
    },
    valid: true,
    message: `${ENROLLMENT_COUPON_DISCOUNT_PERCENT}% discount applied.`,
  };
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

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// Course Modal
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
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
          className="px-4 py-4 sm:px-5 flex items-start justify-between gap-4 flex-shrink-0"
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
        <div className="overflow-y-auto flex-1 px-4 py-4 sm:px-5 space-y-5">
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
        <div className="flex-shrink-0 px-4 py-4 sm:px-5 border-t border-white/8 bg-[#080d1a] space-y-3">
          {course.curriculumDownload && (
            <a
              href={course.curriculumDownload}
              download
              className="flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl text-sm font-bold bg-[#f2b84b]/12 border border-[#f2b84b]/35 text-[#ffe4a3] hover:bg-[#f2b84b]/18 hover:border-[#f2b84b]/60 transition-all"
            >
              <Download className="w-4 h-4" />
              Download Curriculum
            </a>
          )}
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
            Enroll Now - {formatINR(course.price)}
          </button>
          <p className="text-center text-xs text-white/30 mt-2.5">
            Secure payment via Razorpay - UPI - Net Banking -
            Cards - EMI
          </p>
        </div>
      </div>
    </div>
  );
}

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// Types
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
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

interface StoredStudent extends LoggedInStudent {
  phone?: string;
  password: string;
  createdAt?: string;
}

interface EnrollmentRecord {
  invoiceNo: string;
  paymentId: string;
  student: StudentDetails;
  course: Course;
  originalAmount: number;
  discountAmount: number;
  amountPaid: number;
  couponCode?: string;
  paidAt: Date;
}

interface EnrollmentLedgerRow {
  invoiceNo: string;
  paymentId: string;
  studentName: string;
  email: string;
  phone: string;
  courseId: string;
  courseTitle: string;
  courseType: string;
  originalAmount: number;
  discountAmount: number;
  couponCode?: string;
  amount: number;
  paidAt: string;
}

interface PaymentPricing {
  originalAmount: number;
  discountAmount: number;
  amountPaid: number;
  couponCode?: string;
}

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// Helpers
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function generateInvoiceNo() {
  const d = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  return `SV-${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}-${Math.floor(1000 + Math.random() * 9000)}`;
}

function saveEnrollmentLedger(record: EnrollmentRecord) {
  const row: EnrollmentLedgerRow = {
    invoiceNo: record.invoiceNo,
    paymentId: record.paymentId,
    studentName: record.student.name,
    email: record.student.email,
    phone: record.student.phone,
    courseId: record.course.id,
    courseTitle: record.course.title,
    courseType: record.course.subtitle,
    originalAmount: record.originalAmount,
    discountAmount: record.discountAmount,
    couponCode: record.couponCode,
    amount: record.amountPaid,
    paidAt: record.paidAt.toISOString(),
  };

  const existing: EnrollmentLedgerRow[] = JSON.parse(
    localStorage.getItem("skillvane_enrollment_ledger") || "[]",
  );
  const withoutDuplicate = existing.filter(
    (item) => item.paymentId !== row.paymentId,
  );
  localStorage.setItem(
    "skillvane_enrollment_ledger",
    JSON.stringify([...withoutDuplicate, row]),
  );
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
      original_amount: record.originalAmount,
      discount_amount: record.discountAmount,
      coupon_code: record.couponCode || "",
      amount: record.amountPaid,
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
  await ejs.send(EMAILJS_SERVICE_ID, EMAILJS_INVOICE_TEMPLATE_ID, {
    to_name: record.student.name,
    to_email: record.student.email,
    invoice_no: record.invoiceNo,
    payment_id: record.paymentId,
    course_name: `${record.course.title} - ${record.course.subtitle}`,
    amount: formatINR(record.amountPaid),
    original_amount: formatINR(record.originalAmount),
    discount_amount: formatINR(record.discountAmount),
    coupon_code: record.couponCode || "No coupon",
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

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// Login/Signup Modal
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function generateOtp() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

function getAdminPassword() {
  return (
    localStorage.getItem("skillvane_admin_password") ||
    ADMIN_DEFAULT_PASSWORD
  );
}

function getEmailJsErrorMessage(error: unknown) {
  if (typeof error === "object" && error) {
    const detail =
      "text" in error
        ? String((error as { text?: unknown }).text || "")
        : "message" in error
          ? String((error as { message?: unknown }).message || "")
          : "";
    if (detail) return detail;
  }
  if (error instanceof Error) return error.message;
  return "EmailJS could not send the OTP.";
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

async function sendOtpEmail(
  toEmail: string,
  toName: string,
  otp: string,
  purpose: string,
) {
  if (EMAILJS_SERVICE_ID === "YOUR_EMAILJS_SERVICE_ID") return;
  if (
    !EMAILJS_PASSWORD_OTP_TEMPLATE_ID ||
    EMAILJS_PASSWORD_OTP_TEMPLATE_ID === "template_password_otp"
  ) {
    throw new Error("Password OTP EmailJS template is not configured.");
  }
  await loadEmailJs();
  const ejs = (window as any).emailjs;
  ejs.init({ publicKey: EMAILJS_PUBLIC_KEY });
  await ejs.send(EMAILJS_SERVICE_ID, EMAILJS_PASSWORD_OTP_TEMPLATE_ID, {
    to_name: toName,
    to_email: toEmail,
    email: toEmail,
    user_email: toEmail,
    reply_to: toEmail,
    otp,
    passcode: otp,
    verification_code: otp,
    purpose,
    academy_name: "SkillVane IT Academy",
    message: `Your SkillVane ${purpose} OTP is ${otp}. It is valid for 10 minutes.`,
  });
}

function LoginModal({
  onClose,
  onLogin,
}: {
  onClose: () => void;
  onLogin: (student: LoggedInStudent) => void;
}) {
  const [mode, setMode] = useState<"login" | "signup" | "reset">("login");
  const [otpState, setOtpState] = useState<{
    email: string;
    code: string;
    expiresAt: number;
    verified: boolean;
    purpose: "login" | "reset";
  } | null>(null);
  const [otpInput, setOtpInput] = useState("");
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
    if (mode === "signup" || (mode === "reset" && otpState?.verified)) {
      if (!form.password || form.password.length < 6)
        e.password = "Password must be at least 6 characters";
    }
    if (mode === "signup") {
      if (!form.name.trim()) e.name = "Name is required";
      if (!form.phone || !/^[6-9]\d{9}$/.test(form.phone))
        e.phone = "Valid 10-digit mobile number required";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const loadStudents = (): Record<string, StoredStudent> => {
    try {
      return JSON.parse(localStorage.getItem("skillvane_students") || "{}");
    } catch {
      return {};
    }
  };

  const completeStudentLogin = (student: StoredStudent) => {
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
  };

  const sendStudentLoginOtp = async () => {
    const email = form.email.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setErrors({ email: "Valid email is required" });
      return;
    }

    const students = loadStudents();
    const student = students[email];
    if (!student) {
      setErrors({ email: "No student found with this email." });
      return;
    }

    setLoading(true);
    try {
      const code = generateOtp();
      await sendOtpEmail(
        email,
        student.name || "Student",
        code,
        "student login",
      );
      setOtpState({
        email,
        code,
        expiresAt: Date.now() + OTP_VALIDITY_MS,
        verified: false,
        purpose: "login",
      });
      setOtpInput("");
      setErrors({
        general: "Login OTP sent to your registered email.",
      });
    } catch (error) {
      console.error("Student login OTP email failed:", error);
      setErrors({
        general: `Unable to send OTP: ${getEmailJsErrorMessage(error)}`,
      });
    } finally {
      setLoading(false);
    }
  };

  const verifyStudentLoginOtp = () => {
    if (!otpState || otpState.purpose !== "login") return;
    if (Date.now() > otpState.expiresAt) {
      setErrors({ general: "OTP expired. Please send a new OTP." });
      setOtpState(null);
      return;
    }
    if (otpInput.trim() !== otpState.code) {
      setErrors({ general: "Invalid OTP. Please check your email." });
      return;
    }

    const student = loadStudents()[otpState.email];
    if (!student) {
      setErrors({ email: "No student found with this email." });
      return;
    }
    setOtpState({ ...otpState, verified: true });
    completeStudentLogin(student);
  };

  const sendStudentResetOtp = async () => {
    const email = form.email.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setErrors({ email: "Valid email is required" });
      return;
    }

    const students = loadStudents();
    const student = students[email];
    if (!student) {
      setErrors({ email: "No student found with this email." });
      return;
    }

    setLoading(true);
    try {
      const code = generateOtp();
      await sendOtpEmail(
        email,
        student.name || "Student",
        code,
        "password reset",
      );
      setOtpState({
        email,
        code,
        expiresAt: Date.now() + OTP_VALIDITY_MS,
        verified: false,
        purpose: "reset",
      });
      setOtpInput("");
      setErrors({
        general: "OTP sent to your registered email. Please check your inbox.",
      });
    } catch (error) {
      console.error("Student OTP email failed:", error);
      setErrors({
        general: `Unable to send OTP: ${getEmailJsErrorMessage(error)}`,
      });
    } finally {
      setLoading(false);
    }
  };

  const verifyStudentOtp = () => {
    if (!otpState) return;
    if (Date.now() > otpState.expiresAt) {
      setErrors({ general: "OTP expired. Please send a new OTP." });
      setOtpState(null);
      return;
    }
    if (otpInput.trim() !== otpState.code) {
      setErrors({ general: "Invalid OTP. Please check your email." });
      return;
    }
    setOtpState({ ...otpState, verified: true });
    setErrors({
      general:
        otpState.purpose === "reset"
          ? "OTP verified. Set your new password."
          : "OTP verified.",
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Get existing students from localStorage
      const students = loadStudents();

      if (mode === "reset") {
        if (!otpState?.verified) {
          setErrors({ general: "Please verify the OTP before resetting." });
          setLoading(false);
          return;
        }

        const student = students[otpState.email];
        if (!student) {
          setErrors({ email: "No student found with this email." });
          setLoading(false);
          return;
        }

        students[otpState.email] = {
          ...student,
          password: form.password,
        };
        localStorage.setItem(
          "skillvane_students",
          JSON.stringify(students),
        );
        setErrors({
          general:
            "Password reset successful. You can login with the new password.",
        });
        setMode("login");
        setForm({ ...form, password: "" });
        setOtpState(null);
        setOtpInput("");
        setLoading(false);
        return;
      }

      if (mode === "signup") {
        // Check if user already exists
        const email = form.email.trim().toLowerCase();
        if (students[email]) {
          setErrors({
            email: "Email already registered. Please login.",
          });
          setLoading(false);
          return;
        }

        // Create new student account
        students[email] = {
          email,
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
          email,
          name: form.name,
          enrolledCourses: [],
        };
        localStorage.setItem(
          "skillvane_current_student",
          JSON.stringify(loggedStudent),
        );
        onLogin(loggedStudent);
      } else {
        // Login with OTP
        const email = form.email.trim().toLowerCase();
        const student = students[email];
        if (!student) {
          setErrors({ email: "No student found with this email." });
          setLoading(false);
          return;
        }
        if (
          !otpState?.verified ||
          otpState.purpose !== "login" ||
          otpState.email !== email
        ) {
          setErrors({ general: "Please verify your login OTP first." });
          setLoading(false);
          return;
        }
        completeStudentLogin(student);
      }
    } catch (error) {
      setErrors({
        general: "Something went wrong. Please try again.",
      });
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[120] flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div
        className="absolute inset-0 bg-black/75 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative w-full sm:max-w-md bg-[#07111f] rounded-t-2xl sm:rounded-2xl border border-white/10 shadow-2xl overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(24,194,156,0.18),transparent_42%),radial-gradient(ellipse_at_bottom_right,rgba(242,184,75,0.12),transparent_36%)]" />
        {/* Header */}
        <div className="relative px-5 py-4 flex items-center justify-between border-b border-white/10">
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
                : mode === "signup"
                  ? "Create Account"
                  : "Reset Password"}
            </h2>
            <p className="text-xs text-slate-400">
              {mode === "login"
                ? "Login with OTP sent to your email"
                : mode === "signup"
                  ? "Sign up to get started"
                  : "Verify OTP sent to your email"}
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
          className="relative px-5 py-5 space-y-4"
        >
          {errors.general && (
            <div
              className={`p-3 rounded-lg border text-sm ${
                /sent|verified|successful/i.test(errors.general)
                  ? "bg-[#18c29c]/10 border-[#18c29c]/30 text-[#9cf8dd]"
                  : "bg-red-500/10 border-red-500/30 text-red-300"
              }`}
            >
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
              onChange={(e) => {
                setForm({ ...form, email: e.target.value.toLowerCase() });
                setOtpState(null);
                setOtpInput("");
              }}
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

          {mode === "login" && (
            <div className="grid gap-3">
              <button
                type="button"
                onClick={sendStudentLoginOtp}
                disabled={loading}
                className="rounded-xl border border-[#f2b84b]/30 bg-[#f2b84b]/10 px-4 py-3 text-sm font-black text-[#ffe4a3] transition-colors hover:bg-[#f2b84b]/16 disabled:opacity-50"
              >
                {otpState?.purpose === "login"
                  ? "Resend Login OTP"
                  : "Send Login OTP"}
              </button>

              {otpState?.purpose === "login" && (
                <div className="grid gap-2">
                  <label className="block text-sm font-semibold text-slate-200">
                    Email OTP
                  </label>
                  <div className="grid grid-cols-[1fr_auto] gap-2">
                    <input
                      inputMode="numeric"
                      value={otpInput}
                      onChange={(e) => setOtpInput(e.target.value)}
                      placeholder="6-digit OTP"
                      className="w-full bg-white/[0.06] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#18c29c]/60 transition-all"
                    />
                    <button
                      type="button"
                      onClick={verifyStudentLoginOtp}
                      className="rounded-xl bg-gradient-to-r from-[#18c29c] to-[#2f80ed] px-4 py-3 text-sm font-black text-white"
                    >
                      Verify
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {mode === "reset" && (
            <div className="grid gap-3">
              <button
                type="button"
                onClick={sendStudentResetOtp}
                disabled={loading}
                className="rounded-xl border border-[#f2b84b]/30 bg-[#f2b84b]/10 px-4 py-3 text-sm font-black text-[#ffe4a3] transition-colors hover:bg-[#f2b84b]/16 disabled:opacity-50"
              >
                {otpState ? "Resend OTP" : "Send OTP to Email"}
              </button>

              {otpState && !otpState.verified && (
                <div className="grid gap-2">
                  <label className="block text-sm font-semibold text-slate-200">
                    Email OTP
                  </label>
                  <div className="grid grid-cols-[1fr_auto] gap-2">
                    <input
                      inputMode="numeric"
                      value={otpInput}
                      onChange={(e) => setOtpInput(e.target.value)}
                      placeholder="6-digit OTP"
                      className="w-full bg-white/[0.06] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#18c29c]/60 transition-all"
                    />
                    <button
                      type="button"
                      onClick={verifyStudentOtp}
                      className="rounded-xl bg-white/[0.08] px-4 py-3 text-sm font-black text-white hover:bg-white/[0.12]"
                    >
                      Verify
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {((mode === "signup") || (mode === "reset" && otpState?.verified)) && (
          <div>
            <label className="block text-sm font-semibold text-slate-200 mb-1.5">
              {mode === "reset" ? "New Password" : "Password"}
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
          )}

          {mode !== "login" && (
            <button
              type="submit"
              disabled={loading || (mode === "reset" && !otpState?.verified)}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-[#18c29c] to-[#2f80ed] text-white font-black text-sm hover:shadow-xl hover:shadow-[#18c29c]/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {loading
                ? "Please wait..."
                : mode === "signup"
                  ? "Sign Up"
                  : "Save New Password"}
            </button>
          )}

          <div className="flex flex-col items-center gap-2 text-center">
            <button
              type="button"
              onClick={() => {
                setMode(mode === "login" ? "signup" : "login");
                setErrors({});
                setOtpState(null);
                setOtpInput("");
              }}
              className="text-sm text-slate-400 hover:text-[#8df5d7] transition-colors"
            >
              {mode === "login"
                ? "Don't have an account? Sign up"
                : mode === "signup"
                  ? "Already have an account? Login"
                  : "Back to login"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// Enrollment Form Modal
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
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
          className="relative px-5 py-4 flex items-center justify-between border-b border-white/10"
          style={{
            background: `linear-gradient(135deg, ${course.accentFrom}22, ${course.accentTo}11)`,
          }}
        >
          <div>
            <p
              className="text-xs font-mono uppercase tracking-widest mb-0.5"
              style={{ color: course.accentFrom }}
            >
              Step 1 of 3 - Your Details
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
              {course.subtitle} · {formatINR(course.price)}
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
          className="relative px-5 py-5 space-y-4"
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
            Continue to Amount
          </button>
        </form>
      </div>
    </div>
  );
}

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// Invoice Modal
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function PaymentReviewModal({
  course,
  student,
  onClose,
  onBack,
  onPay,
}: {
  course: Course;
  student: StudentDetails;
  onClose: () => void;
  onBack: () => void;
  onPay: (pricing: PaymentPricing) => void;
}) {
  const [couponInput, setCouponInput] = useState("");
  const [message, setMessage] = useState(
    `Use ${ENROLLMENT_COUPON_CODE} before ${getCouponExpiryDate().toLocaleDateString(
      "en-IN",
      { day: "2-digit", month: "short", year: "numeric" },
    )}.`,
  );
  const [pricing, setPricing] = useState<PaymentPricing>(() =>
    getDefaultPricing(course),
  );
  const [couponValid, setCouponValid] = useState(false);
  const couponExpiry = getCouponExpiryDate();

  const applyCoupon = () => {
    const result = getCouponPricing(course, couponInput);
    setPricing(result.pricing);
    setCouponValid(result.valid);
    setMessage(result.message);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div
        className="absolute inset-0 bg-black/75 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative w-full sm:max-w-lg bg-[#07111f] rounded-t-2xl sm:rounded-2xl border border-[#f2b84b]/30 shadow-2xl overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(242,184,75,0.16),transparent_42%)]" />
        <div
          className="relative px-5 py-4 flex items-center justify-between border-b border-white/10"
          style={{
            background: `linear-gradient(135deg, ${course.accentFrom}1f, rgba(242,184,75,0.12))`,
          }}
        >
          <div>
            <p className="text-xs font-mono uppercase tracking-widest mb-0.5 text-[#f2b84b]">
              Step 2 of 3 - Amount & Coupon
            </p>
            <h2
              className="font-black text-white text-base"
              style={{
                fontFamily: "'Outfit', system-ui, sans-serif",
              }}
            >
              Confirm enrollment
            </h2>
            <p className="text-xs text-white/45">
              {student.name} - {student.email}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-white/10 text-white/50 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="relative px-5 py-5 space-y-4">
          <div className="rounded-2xl border border-white/10 bg-white/[0.045] p-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[11px] font-black uppercase tracking-[0.18em] text-[#8df5d7]">
                  Selected Course
                </p>
                <h3 className="mt-1 text-lg font-black text-white">
                  {course.title}
                </h3>
                <p className="text-sm text-white/45">
                  {course.subtitle}
                </p>
              </div>
              <div className="rounded-xl bg-[#f2b84b]/10 px-3 py-2 text-right">
                <p className="text-[10px] font-black uppercase tracking-wider text-[#f2b84b]">
                  Payable
                </p>
                <p className="text-xl font-black text-white">
                  {formatINR(pricing.amountPaid)}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-[#f2b84b]/20 bg-[#f2b84b]/[0.06] p-4">
            <label className="block text-xs font-black uppercase tracking-wider text-[#f2b84b] mb-2">
              Coupon Code
            </label>
            <div className="flex gap-2">
              <input
                value={couponInput}
                onChange={(e) => {
                  setCouponInput(e.target.value.toUpperCase());
                  if (couponValid) {
                    setCouponValid(false);
                    setPricing(getDefaultPricing(course));
                  }
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    applyCoupon();
                  }
                }}
                placeholder={ENROLLMENT_COUPON_CODE}
                className="min-w-0 flex-1 rounded-xl border border-white/10 bg-[#050d18]/80 px-4 py-3 text-sm font-bold uppercase tracking-wider text-white placeholder-white/25 outline-none transition-all focus:border-[#f2b84b]/70"
              />
              <button
                type="button"
                onClick={applyCoupon}
                className="rounded-xl bg-gradient-to-r from-[#f2b84b] to-[#f59e0b] px-4 py-3 text-xs font-black text-[#1b1202] shadow-lg shadow-[#f2b84b]/20 transition-transform hover:-translate-y-0.5"
              >
                Apply
              </button>
            </div>
            <p
              className={`mt-2 text-xs font-semibold ${
                couponValid ? "text-emerald-300" : "text-white/45"
              }`}
            >
              {message}
            </p>
            <p className="mt-1 text-[11px] text-white/35">
              Coupon expires on{" "}
              {couponExpiry.toLocaleDateString("en-IN", {
                day: "2-digit",
                month: "long",
                year: "numeric",
              })}
              .
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-[#050d18]/80 p-4 space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-white/50">Course amount</span>
              <span className="font-bold text-white">
                {formatINR(pricing.originalAmount)}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-white/50">Coupon discount</span>
              <span className="font-bold text-emerald-300">
                - {formatINR(pricing.discountAmount)}
              </span>
            </div>
            <div className="border-t border-white/10 pt-3 flex items-center justify-between">
              <span className="text-sm font-black uppercase tracking-wider text-white">
                Final payment
              </span>
              <span className="text-2xl font-black text-white">
                {formatINR(pricing.amountPaid)}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-[0.42fr_0.58fr]">
            <button
              type="button"
              onClick={onBack}
              className="rounded-xl border border-white/15 px-4 py-3 text-sm font-bold text-white/70 transition-all hover:bg-white/5 hover:text-white"
            >
              Back
            </button>
            <button
              type="button"
              onClick={() => onPay(pricing)}
              className="rounded-xl bg-gradient-to-r from-[#18c29c] to-[#2f8cff] px-4 py-3 text-sm font-black text-white shadow-lg shadow-[#18c29c]/20 transition-transform hover:-translate-y-0.5"
            >
              Proceed to Payment
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

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
        <div className="relative px-5 pt-7 pb-5 text-center border-b border-white/10 bg-[#18c29c]/5">
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
              Invoice email setup pending - see guide below
            </div>
          )}
        </div>

        {/* Invoice body */}
        <div className="relative px-5 py-5 space-y-4">
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
                {formatINR(record.amountPaid)} paid
              </p>
              {record.couponCode && (
                <p className="text-[11px] text-[#f2b84b] mt-1">
                  {record.couponCode} saved{" "}
                  {formatINR(record.discountAmount)}
                </p>
              )}
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

        <div className="px-5 pb-5">
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

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// Course Card
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function CourseCard({
  course,
  onEnroll,
}: {
  course: Course;
  onEnroll: (c: Course) => void;
}) {
  const Icon = course.icon;
  const demoAccess = getDemoAccess(course);
  const category: CourseCategory =
    course.type === "live" ? "live-batch" : "self-paced";
  const isLiveBatch = category === "live-batch";
  const isFeaturedLiveBatch = course.id === "gcp-live";
  const moduleCount = course.curriculum.length;
  const curriculumHref = isLiveBatch ? course.curriculumDownload : undefined;
  const cardHighlights = course.highlights.slice(0, 4);

  return (
    <motion.div
      className={`group course-card-3d relative flex h-[640px] flex-col overflow-hidden rounded-2xl border border-white/12 bg-[#0b1423] shadow-xl shadow-black/20 transition-colors duration-300 hover:border-[#18c29c]/35 hover:shadow-2xl hover:shadow-[#18c29c]/10 ${
        isFeaturedLiveBatch
          ? "border-[#f2b84b]/40 bg-[#0c1626] shadow-2xl shadow-[#f2b84b]/10"
          : ""
      }`}
      whileHover={{ y: -6, scale: 1.01 }}
      transition={{ type: "spring", stiffness: 320, damping: 22 }}
    >
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
          background: `linear-gradient(135deg, ${course.accentFrom}10, transparent 34%), linear-gradient(180deg, rgba(255,255,255,0.035), transparent 28%)`,
        }}
      />

      <div className="pointer-events-none absolute right-4 top-4 z-10 rounded-full border border-white/12 bg-black/20 px-3 py-1 text-[10px] font-black uppercase tracking-[0.16em] text-white/80 backdrop-blur-xl">
        {CATEGORY_LABELS[category]}
      </div>

      {/* Tag */}
      {course.tag && (
        <div
            className="absolute top-12 right-4 text-[10px] font-black px-3 py-1.5 rounded-full text-white shadow-lg z-10 ring-1 ring-white/20"
          style={{
            background: `linear-gradient(135deg, ${course.accentFrom}, ${course.accentTo})`,
          }}
        >
          {course.tag}
        </div>
      )}

      <div
        className={`flex h-full flex-1 flex-col ${
          isFeaturedLiveBatch ? "p-4 sm:p-6" : "p-3.5 sm:p-4"
        }`}
      >
        {/* Icon + badge */}
        <div className={`relative z-10 flex items-center gap-3 ${isFeaturedLiveBatch ? "mb-4" : "mb-3"}`}>
          <div
            className={`${isFeaturedLiveBatch ? "h-12 w-12" : "h-10 w-10"} flex flex-shrink-0 items-center justify-center rounded-xl shadow-md ring-1 ring-white/10 transition-transform duration-300 group-hover:scale-105`}
            style={{
              background: `linear-gradient(135deg, ${course.accentFrom}25 0%, ${course.accentTo}15 100%)`,
              border: `1.5px solid ${course.accentFrom}50`,
            }}
          >
            <Icon
              className={isFeaturedLiveBatch ? "h-6 w-6" : "h-5 w-5"}
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
          className={`relative z-10 mb-1 font-black leading-tight text-white group-hover:text-[#fff8dd] ${
            isFeaturedLiveBatch ? "text-2xl sm:text-3xl" : "text-lg"
          }`}
          style={{
            fontFamily:
              "'Space Grotesk', system-ui, sans-serif",
          }}
        >
          {course.title}
        </h3>
        <p className={`relative z-10 text-sm text-slate-400 ${isFeaturedLiveBatch ? "mb-5" : "mb-3"}`}>
          {course.subtitle}
        </p>

        {isFeaturedLiveBatch && (
          <div className="relative z-10 mb-4 grid gap-2 rounded-xl border border-[#f2b84b]/25 bg-gradient-to-r from-[#f2b84b]/12 to-white/[0.04] p-3 sm:grid-cols-3">
            {[
              { label: "Duration", value: "3 months" },
              { label: "Timings", value: "7:00 AM - 8:00 AM" },
              { label: "Demo", value: "July 1, 2, 3" },
            ].map((item) => (
              <div key={item.label}>
                <p className="text-[10px] font-black uppercase tracking-[0.14em] text-[#f2b84b]">
                  {item.label}
                </p>
                <p className="mt-1 text-sm font-black text-white">
                  {item.value}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Meta pills */}
        <div className={`flex flex-wrap gap-2 ${isFeaturedLiveBatch ? "mb-4" : "mb-3"}`}>
          <span className="flex items-center gap-1 text-xs text-[#ffe4a3] bg-[#f2b84b]/10 border border-[#f2b84b]/24 px-2.5 py-1 rounded-full">
            <Zap className="w-3 h-3" />
            {isLiveBatch ? "Free demo available" : "On-demand access"}
          </span>
          {course.duration && (
            <span className="flex items-center gap-1 text-xs text-slate-300 bg-white/[0.07] border border-white/10 px-2.5 py-1 rounded-full">
              <Clock className="w-3 h-3" />
              {course.duration}
            </span>
          )}
          {course.timings && (
            <span className="flex items-center gap-1 text-xs text-[#b8fff0] bg-[#18c29c]/12 border border-[#18c29c]/28 px-2.5 py-1 rounded-full shadow-sm shadow-[#18c29c]/10">
              <MonitorPlay className="w-3 h-3" />
              {course.timings}
            </span>
          )}
          {isFeaturedLiveBatch && (
            <span className="flex items-center gap-1 text-xs text-[#ffe4a3] bg-[#f2b84b]/10 border border-[#f2b84b]/24 px-2.5 py-1 rounded-full">
              <Play className="w-3 h-3" />
              3 free demos
            </span>
          )}
          <span className="flex items-center gap-1 text-xs text-slate-300 bg-white/[0.07] border border-white/10 px-2.5 py-1 rounded-full">
            <BookOpen className="w-3 h-3" />
            {TYPE_LABELS[course.type]}
          </span>
          <span className="flex items-center gap-1 text-xs text-slate-300 bg-white/[0.07] border border-white/10 px-2.5 py-1 rounded-full">
            <Layers className="w-3 h-3" />
            {moduleCount} modules
          </span>
        </div>

        <div className={`relative z-10 rounded-xl border border-white/10 bg-[#07111f]/72 ${isFeaturedLiveBatch ? "mb-4 p-3" : "mb-3 p-2.5"}`}>
          <div className={`${isFeaturedLiveBatch ? "mb-3" : "mb-2"} flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.14em] text-[#8df5d7]`}>
            <CheckCircle2 className="h-3.5 w-3.5" />
            What's included
          </div>
          <ul className={`grid ${isFeaturedLiveBatch ? "gap-2 sm:grid-cols-2" : "gap-1.5"}`}>
            {cardHighlights.map((h) => (
              <li
                key={h}
                className={`flex items-start gap-2.5 rounded-lg bg-white/[0.035] text-slate-200 ${isFeaturedLiveBatch ? "px-3 py-2 text-xs leading-relaxed" : "px-2.5 py-1.5 text-[11px] leading-snug"}`}
              >
                <Check className="w-3.5 h-3.5 text-emerald-300 mt-0.5 flex-shrink-0 drop-shadow-[0_0_8px_rgba(110,231,183,0.35)]" />
                {h}
              </li>
            ))}
          </ul>
        </div>

        {/* Price */}
        <div className={`relative z-10 mt-auto flex flex-wrap items-baseline gap-2 rounded-xl border border-white/10 bg-white/[0.045] shadow-inner shadow-white/5 ${isFeaturedLiveBatch ? "mb-4 px-4 py-3" : "mb-3 px-3 py-2.5"}`}>
          <span
            className={`${isFeaturedLiveBatch ? "text-3xl" : "text-2xl"} font-black text-white`}
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
          {isFeaturedLiveBatch ? (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {curriculumHref && (
                <a
                  href={curriculumHref}
                  download
                  className="flex w-full items-center justify-center gap-2 rounded-xl border border-[#f2b84b]/35 bg-[#f2b84b]/12 px-4 py-3 text-sm font-black text-[#ffe4a3] transition-all hover:border-[#f2b84b]/60 hover:bg-[#f2b84b]/18"
                >
                  <Download className="h-4 w-4" />
                  Download Curriculum
                </a>
              )}
              {demoAccess && (
                <a
                  href={demoAccess.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex w-full items-center justify-center gap-2 rounded-xl border border-[#18c29c]/30 bg-[#18c29c]/10 px-4 py-3 text-sm font-black text-[#9cf8dd] hover:border-[#18c29c]/55 hover:bg-[#18c29c]/16 transition-all"
                >
                  <demoAccess.icon className="h-4 w-4" />
                  Join Demo
                </a>
              )}
            </div>
          ) : null}
          {!isFeaturedLiveBatch && demoAccess && (
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
          <button
            onClick={() => onEnroll(course)}
            className={`magnetic-button w-full rounded-xl text-sm font-black text-white shadow-lg transition-all hover:shadow-xl active:scale-[0.99] ${isFeaturedLiveBatch ? "py-3.5" : "py-3"}`}
            style={{
              background: `linear-gradient(135deg, ${course.accentFrom} 0%, ${course.accentTo} 100%)`,
            }}
          >
            Enroll Now
          </button>
        </div>
      </div>
    </motion.div>
  );
}

// Main App
export default function App() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeCategory, setActiveCategory] =
    useState<CourseCategory>("all");
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
  const [paymentReview, setPaymentReview] = useState<{
    course: Course;
    student: StudentDetails;
  } | null>(null);
  const [invoice, setInvoice] =
    useState<EnrollmentRecord | null>(null);

  // Authentication state
  const [currentStudent, setCurrentStudent] =
    useState<LoggedInStudent | null>(null);
  const [showLogin, setShowLogin] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);
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
      paymentReview ||
      invoice ||
      showLogin ||
      showAdmin ||
      showDashboard
    );
    document.body.style.overflow = anyOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [
    modalCourse,
    formCourse,
    paymentReview,
    invoice,
    showLogin,
    showAdmin,
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

  // Step 1: Enroll button -> show student details form
  const getSavedStudentDetails = (
    student: LoggedInStudent,
  ): StudentDetails | null => {
    try {
      const studentsData = localStorage.getItem("skillvane_students");
      const students: Record<string, any> = studentsData
        ? JSON.parse(studentsData)
        : {};
      const saved = students[student.email];

      if (
        saved?.name &&
        saved?.email &&
        /^[6-9]\d{9}$/.test(saved.phone || "") &&
        saved?.password
      ) {
        return {
          name: saved.name,
          email: saved.email,
          phone: saved.phone,
          password: saved.password,
        };
      }
    } catch (err) {
      console.error("Could not load saved student details:", err);
    }

    return null;
  };

  // Step 3: Amount confirmed -> open Razorpay
  const startEnrollmentPayment = async (
    course: Course,
    student: StudentDetails,
    pricing: PaymentPricing = getDefaultPricing(course),
  ) => {
    setFormCourse(null);
    setPaymentReview(null);
    setShowDashboard(false);
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
        amount: Math.round(pricing.amountPaid * 100), // Amount in paise
        currency: "INR",
        name: "SkillVane IT Academy",
        description: `${course.title} - ${course.subtitle}`,
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
            originalAmount: pricing.originalAmount,
            discountAmount: pricing.discountAmount,
            amountPaid: pricing.amountPaid,
            couponCode: pricing.couponCode,
            paidAt: new Date(),
          };
          saveEnrollmentLedger(record);

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
          original_amount: String(pricing.originalAmount),
          discount_amount: String(pricing.discountAmount),
          coupon_code: pricing.couponCode || "",
          amount_paid: String(pricing.amountPaid),
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

  const handleEnroll = (course: Course) => {
    setModalCourse(null);

    if (currentStudent?.enrolledCourses.includes(course.id)) {
      setShowDashboard(true);
      setPayError("You are already enrolled in this course.");
      setTimeout(() => setPayError(null), 4000);
      return;
    }

    if (currentStudent) {
      const savedStudent = getSavedStudentDetails(currentStudent);
      if (savedStudent) {
        setPaymentReview({ course, student: savedStudent });
        return;
      }
    }

    setFormCourse(course);
  };

  const handleFormSubmit = async (student: StudentDetails) => {
    if (!formCourse) return;
    setPaymentReview({ course: formCourse, student });
    setFormCourse(null);
  };

  const COURSE_CATEGORIES: {
    label: string;
    value: CourseCategory;
    icon: React.ElementType;
  }[] = [
    {
      label: "All",
      value: "all",
      icon: Layers,
    },
    {
      label: "Live Batch",
      value: "live-batch",
      icon: MonitorPlay,
    },
    {
      label: "Self-paced",
      value: "self-paced",
      icon: Video,
    },
  ];

  const visibleCourses = COURSES.filter((course) => {
    if (activeCategory === "all") return true;
    return activeCategory === "live-batch"
      ? course.type === "live"
      : course.type !== "live";
  });

  const faqs = [
    {
      q: "Do I need prior GCP experience?",
      a: "No. The GCP courses start from cloud fundamentals. For the project courses, basic GCP knowledge is helpful. The Python course has no prerequisites at all.",
    },
    {
      q: "What is the difference between the Live Batch and Recordings course?",
      a: "The Live Batch gives you real-time interaction with the instructor (Mon-Fri, 7:30-8:30 AM) plus daily recordings, notes, and resume assistance. The Recordings course gives you the full video archive of the latest batch to study at your own pace.",
    },
    {
      q: "Can I buy the project courses without the main GCP course?",
      a: "Yes. The project courses are standalone. However, they are most effective if you have some GCP fundamentals. We recommend completing the Recordings course first if you are new to GCP.",
    },
    {
      q: "Is there a refund policy?",
      a: "Yes - 7-day no-questions-asked refund if you are not satisfied after accessing up to the first two modules of any course.",
    },
    {
      q: "Is EMI or instalment payment available?",
      a: "Yes. Razorpay offers 0% EMI on most major credit cards. The option appears automatically at checkout.",
    },
  ];

  return (
    <div
      className="min-h-screen bg-background text-foreground overflow-x-hidden selection:bg-[#f2b84b]/25"
    >
      <Navbar
        logo={skillVaneLogo}
        scrollProgress={scrollProgress}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
        currentStudent={currentStudent}
        scrollTo={scrollTo}
        onLogin={() => setShowLogin(true)}
        onDashboard={() => setShowDashboard(true)}
        onAdmin={() => setShowAdmin(true)}
        onLogout={handleLogout}
      />

      {!showDashboard && <SimpleChatbot whatsappLink={TRAINER_WHATSAPP_LINK} />}

      {/* â”€â”€ Floating Contact Buttons â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <LandingHero scrollTo={scrollTo} />
      <EnrollmentTicker />
      <GcpTechMarquee />

      {/* Courses */}
      <section
        id="courses"
        className="relative py-12 sm:py-16 bg-[#08111f] overflow-hidden"
      >
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-white/10" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-white/10" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
          <SectionHeading
            eyebrow="Premium Programs"
            title="Pick your GCP learning path"
            description="Choose the format that fits your schedule and career goals."
            accent="teal"
          />

          {/* Category tabs */}
          <div className="premium-surface mx-auto mb-7 flex w-fit max-w-full flex-wrap justify-center gap-2 rounded-2xl p-2">
            {COURSE_CATEGORIES.map(({ label, value, icon: CategoryIcon }) => (
              <button
                key={value}
                onClick={() => setActiveCategory(value)}
                className={`relative inline-flex items-center gap-2 overflow-hidden rounded-xl px-5 py-3 text-sm font-black transition-all ${
                  activeCategory === value
                    ? "bg-gradient-to-r from-[#18c29c] via-[#2f80ed] to-[#7cc7ff] text-white shadow-lg shadow-[#18c29c]/20"
                    : "border border-white/10 bg-white/[0.04] text-slate-300 hover:border-[#f2b84b]/35 hover:text-white"
                }`}
              >
                {activeCategory === value && (
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/12 to-white/0" />
                )}
                <CategoryIcon className="relative z-10 h-4 w-4" />
                <span className="relative z-10">{label}</span>
                <span className="relative z-10 rounded-full bg-black/18 px-2 py-0.5 text-[10px] font-black">
                  {
                    value === "all"
                      ? COURSES.length
                      : COURSES.filter((course) =>
                          value === "live-batch"
                            ? course.type === "live"
                            : course.type !== "live",
                        ).length
                  }
                </span>
              </button>
            ))}
          </div>

          {/* Payment error banner */}
          {payError && (
            <div className="mb-6 p-4 rounded-xl border border-red-500/30 bg-red-500/10 text-red-400 text-sm text-center font-semibold">
              Error: {payError}
            </div>
          )}

          {/* Course grid */}
          <div className="grid auto-rows-fr grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
            {visibleCourses.map((course, index) => (
              <Reveal
                key={course.id}
                className={`h-full ${course.id === "gcp-live" ? "lg:col-span-2" : ""}`}
                delay={index * 0.08}
              >
                <CourseCard
                  course={course}
                  onEnroll={handleEnroll}
                />
              </Reveal>
            ))}
          </div>

          <p className="text-center text-xs text-slate-500 mt-8">
            More courses coming soon - All prices in INR
            inclusive of taxes
          </p>
        </div>
      </section>

      {/* â”€â”€ Instructor â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <section
        id="free-learning"
        className="section-shell relative overflow-hidden border-y border-white/10 py-14 sm:py-20"
      >
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_18%_10%,rgba(239,68,68,0.14),transparent_30%),radial-gradient(ellipse_at_82%_70%,rgba(24,194,156,0.12),transparent_34%)]" />
        <div className="relative mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
          <SectionHeading
            eyebrow="Free Learning"
            title="Start learning GCP for free"
            description="Watch the SkillVane YouTube playlist first, then choose a live or self-paced path when you're ready."
            align="left"
            accent="red"
          />

          <div className="premium-surface rounded-2xl p-4">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex min-w-0 items-center gap-4">
                <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-2xl border border-red-400/25 bg-red-500/15 shadow-xl shadow-red-500/10">
                  <Play className="h-7 w-7 fill-red-200 text-red-200" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-black uppercase tracking-[0.16em] text-[#f2b84b]">
                    YouTube Playlist
                  </p>
                  <h3 className="mt-1 text-xl font-black text-white">
                    Free GCP Data Engineering Lessons
                  </h3>
                  <p className="mt-1 text-sm text-slate-400">
                    Beginner-friendly lessons from SkillVane.
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-2 sm:w-52">
                <a
                  href={FREE_LEARNING_PLAYLIST_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="magnetic-button inline-flex items-center justify-center gap-2 rounded-xl bg-red-500 px-5 py-3 text-sm font-black text-white shadow-xl shadow-red-500/20 transition-all hover:bg-red-400"
                >
                  <Youtube className="h-4 w-4" />
                  Play Playlist
                </a>
                <a
                  href="https://www.youtube.com/@SkillVane1711"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.05] px-5 py-3 text-sm font-bold text-slate-200 transition-all hover:border-red-400/35 hover:text-white"
                >
                  Visit Channel
                  <ArrowRight className="h-4 w-4" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        id="instructor"
        className="section-shell relative overflow-hidden py-14 sm:py-20"
      >
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_18%_20%,rgba(24,194,156,0.12),transparent_32%),radial-gradient(ellipse_at_86%_62%,rgba(47,128,237,0.1),transparent_34%)]" />
        <div className="relative mx-auto max-w-5xl px-4 sm:px-6">
          <SectionHeading
            eyebrow="Your Instructor"
            title="Learn from a working professional"
            accent="teal"
          />

          <div className="premium-surface rounded-2xl p-4 sm:p-5 flex flex-col md:flex-row gap-5 md:gap-8 items-center md:items-start">
            <div className="flex-shrink-0 flex flex-col items-center gap-3">
              <div className="premium-ring relative w-40 h-52 sm:w-52 sm:h-64 rounded-2xl overflow-hidden shadow-2xl shadow-[#18c29c]/20 ring-1 ring-white/12">
                <ImageWithFallback
                  src={instructorPhoto}
                  alt="SkillVane IT Academy - GCP Data Engineering Instructor"
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
              <p className="text-[#8df5d7] font-semibold text-sm mb-4">
                Solution Architect - SkillVane IT Academy
              </p>
              <p className="text-slate-300 text-sm leading-relaxed mb-6 max-w-xl">
                With over 9+ years of hands-on experience
                designing large-scale data pipelines on Google
                Cloud Platform, your instructor has architected
                solutions for Fortune 500 enterprises across
                BFSI, e-commerce, and logistics. As a Google
                Certified Professional Data Engineer and Cloud
                Architect, they bring real-world war stories,
                battle-tested patterns, and current industry
                practices into every lesson - no filler, no
                theory-only slides.
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { value: "9+", label: "Years on GCP" },
                  { value: "2500+", label: "Students Trained" },
                  { value: "5", label: "GCP Certifications" },
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

      <section
        id="testimonials"
        className="relative overflow-hidden border-y border-white/10 bg-[#07111f] py-14 sm:py-20"
      >
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_22%_12%,rgba(242,184,75,0.1),transparent_30%),radial-gradient(ellipse_at_80%_70%,rgba(24,194,156,0.1),transparent_34%)]" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
          <SectionHeading
            eyebrow="Reviews"
            title="Trusted by professionals across India"
            description="4.9 / 5 average rating from 500+ learners"
            accent="gold"
          />
          <div className="mb-4 flex items-center justify-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className="h-5 w-5 fill-yellow-400 text-yellow-400"
              />
            ))}
          </div>
          <TestimonialMarquee />
        </div>
      </section>

      {/* â”€â”€ FAQ â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <section id="faq" className="relative py-12 sm:py-16 bg-[#08111f] overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(242,184,75,0.1),transparent_38%)]" />
        <div className="relative max-w-3xl mx-auto px-4 sm:px-6">
          <SectionHeading
            eyebrow="FAQ"
            title="Common questions"
            accent="gold"
          />

          <div className="space-y-2">
            {faqs.map((faq, i) => (
              <div
                key={i}
                className="premium-surface rounded-xl overflow-hidden"
              >
                <button
                  className="w-full flex items-center justify-between p-4 text-left hover:bg-white/[0.06] transition-colors"
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
                  <div className="px-4 pb-4 border-t border-white/10 bg-[#07111f]/70">
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

      <FinalCTA scrollTo={scrollTo} />

      {/* Footer */}
      <footer className="py-6 border-t border-white/10 bg-[#050b14]">
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
            (c) {new Date().getFullYear()} SkillVane IT Academy.
            All rights reserved.
          </span>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <a
              href="https://www.linkedin.com/in/shaik-saidhul-1286ab146"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-full border border-[#2f80ed]/25 bg-[#2f80ed]/10 px-3 py-1.5 text-[#bfe3ff] hover:border-[#7cc7ff]/45 hover:text-white transition-colors"
            >
              <Linkedin className="h-3.5 w-3.5" />
              LinkedIn
            </a>
            <a
              href="https://www.youtube.com/@SkillVane1711"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-full border border-red-400/20 bg-red-500/10 px-3 py-1.5 text-red-200 hover:border-red-400/45 hover:text-white transition-colors"
            >
              <Youtube className="h-3.5 w-3.5" />
              YouTube
            </a>
            <a
              href="https://t.me/gcpdataengineering"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-full border border-[#18c29c]/20 bg-[#18c29c]/10 px-3 py-1.5 text-[#9cf8dd] hover:border-[#18c29c]/45 hover:text-white transition-colors"
            >
              <Send className="h-3.5 w-3.5" />
              Telegram
            </a>
          </div>
        </div>
      </footer>

      <BackToTop />

      {/* Course Detail Modal */}
      {modalCourse && (
        <CourseModal
          course={modalCourse}
          onClose={() => setModalCourse(null)}
          onEnroll={handleEnroll}
        />
      )}

      {/* â”€â”€ Enrollment Form Modal â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      {formCourse && (
        <EnrollmentFormModal
          course={formCourse}
          onClose={() => setFormCourse(null)}
          onSubmit={handleFormSubmit}
        />
      )}

      {paymentReview && (
        <PaymentReviewModal
          course={paymentReview.course}
          student={paymentReview.student}
          onClose={() => setPaymentReview(null)}
          onBack={() => {
            setFormCourse(paymentReview.course);
            setPaymentReview(null);
          }}
          onPay={(pricing) =>
            startEnrollmentPayment(
              paymentReview.course,
              paymentReview.student,
              pricing,
            )
          }
        />
      )}

      {/* â”€â”€ Invoice / Success Modal â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */} 
      {invoice && (
        <InvoiceModal
          record={invoice}
          onClose={() => setInvoice(null)}
        />
      )}

      {/* â”€â”€ Login Modal â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      {showLogin && (
        <LoginModal
          onClose={() => setShowLogin(false)}
          onLogin={handleLogin}
        />
      )}

      {showAdmin && (
        <AdminStudentsModal
          courses={COURSES}
          onClose={() => setShowAdmin(false)}
        />
      )}

      {/* â”€â”€ Student Dashboard â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
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


