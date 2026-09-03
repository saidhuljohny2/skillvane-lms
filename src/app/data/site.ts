import {
  Blocks,
  CloudCog,
  Code2,
  Database,
  GitBranch,
  Radio,
} from "lucide-react";

export type Program = {
  id: string;
  title: string;
  description: string;
  format: "Live cohort" | "Self-paced" | "Project lab";
  duration: string;
  price: number;
  featured?: boolean;
  icon: typeof CloudCog;
  skills: string[];
};

export const programs: Program[] = [
  {
    id: "gcp-live",
    title: "GCP Data Engineering",
    description:
      "Build production-ready data platforms with live instruction, guided labs, and weekly feedback.",
    format: "Live cohort",
    duration: "12 weeks",
    price: 14999,
    featured: true,
    icon: CloudCog,
    skills: ["BigQuery", "Dataflow", "Composer", "Pub/Sub"],
  },
  {
    id: "gcp-recordings",
    title: "GCP Data Engineering",
    description:
      "Learn the complete curriculum on your schedule with structured lessons and practical exercises.",
    format: "Self-paced",
    duration: "40+ hours",
    price: 7999,
    icon: Database,
    skills: ["GCS", "BigQuery", "Dataproc", "Airflow"],
  },
  {
    id: "python-de",
    title: "Python for Data Engineers",
    description:
      "Write reliable data pipelines with modern Python, testing patterns, and maintainable architecture.",
    format: "Self-paced",
    duration: "20+ hours",
    price: 3999,
    icon: Code2,
    skills: ["Python", "PySpark", "Testing", "APIs"],
  },
  {
    id: "healthcare-project",
    title: "Healthcare Data Platform",
    description:
      "Design an end-to-end healthcare analytics platform using realistic requirements and datasets.",
    format: "Project lab",
    duration: "3 weeks",
    price: 2499,
    icon: Blocks,
    skills: ["Architecture", "ETL", "Data quality", "BI"],
  },
  {
    id: "retail-project",
    title: "Real-time Retail Pipeline",
    description:
      "Process events in real time and serve decision-ready retail metrics at cloud scale.",
    format: "Project lab",
    duration: "3 weeks",
    price: 2499,
    icon: Radio,
    skills: ["Streaming", "Pub/Sub", "Dataflow", "SQL"],
  },
  {
    id: "banking-project",
    title: "Banking Data Modernization",
    description:
      "Migrate and model regulated workloads with governance, lineage, and secure access.",
    format: "Project lab",
    duration: "3 weeks",
    price: 2499,
    icon: GitBranch,
    skills: ["Migration", "IAM", "Governance", "dbt"],
  },
];

export const testimonials = [
  {
    quote:
      "The projects connected every GCP service into one clear workflow. I could explain my architecture confidently in interviews.",
    name: "Arun K.",
    role: "Data Engineer",
  },
  {
    quote:
      "The live feedback and practical debugging made the difference. This felt like working with a senior engineer, not watching tutorials.",
    name: "Priya S.",
    role: "Cloud Engineer",
  },
  {
    quote:
      "A focused curriculum with no filler. I moved from SQL support work into a data engineering role within three months.",
    name: "Mohammed R.",
    role: "Associate Data Engineer",
  },
];

export const faqs = [
  {
    question: "Do I need prior cloud experience?",
    answer:
      "No. The learning path starts with cloud and data fundamentals, then moves into production patterns. Basic SQL familiarity is helpful.",
  },
  {
    question: "Are the live sessions recorded?",
    answer:
      "Yes. Cohort learners receive session recordings, notes, lab files, and updates through their private learning dashboard.",
  },
  {
    question: "Will I build portfolio projects?",
    answer:
      "Yes. You will design, build, document, and present realistic data platforms that can be discussed in interviews.",
  },
  {
    question: "Is career support included?",
    answer:
      "Live cohorts include resume reviews, mock interviews, architecture discussions, and practical career guidance.",
  },
];

export const formatPrice = (price: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(price);
