import { MonitorPlay, Video, Code2, Heart, ShoppingCart } from "lucide-react";
import gcpDataEngineeringCurriculum from "@/imports/gcp-data-engineering-curriculum.pdf";
import type { Course } from "@/app/types";

export const COURSES: Course[] = [
  // â”€â”€ Course 1 â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  {
    id: "gcp-live",
    type: "live",
    badge: "LIVE BATCH",
    icon: MonitorPlay,
    accentFrom: "#3d3d3d",
    accentTo: "#0abab5",
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
    accentFrom: "#2b2b2b",
    accentTo: "#81d8d0",
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
    accentFrom: "#089691",
    accentTo: "#0abab5",
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
    accentFrom: "#4a4a4a",
    accentTo: "#6dd5d0",
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
    accentFrom: "#3d3d3d",
    accentTo: "#81d8d0",
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

  // â”€â”€ ADD A NEW COURSE HERE â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  // Copy any block above, change the id, content, price, and colors.
  // The card will appear automatically on the site.
];
