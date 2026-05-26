import { useState, useEffect } from "react";
import {
  ChevronDown, Star, Users, Clock, Award, Check, Menu, X,
  ArrowRight, Shield, Zap, Database, Cloud, BookOpen,
  Play, TrendingUp, Code2, Layers, GitBranch,
} from "lucide-react";

const MODULES = [
  {
    id: 1,
    title: "GCP Fundamentals & Cloud Architecture",
    duration: "4 hrs",
    lessons: 12,
    topics: [
      "GCP Console, IAM & Resource Hierarchy",
      "Compute Engine, Cloud Storage, Networking basics",
      "GCP Pricing, Billing & Cost Optimization",
      "Setting up your data engineering environment",
    ],
  },
  {
    id: 2,
    title: "BigQuery — Serverless Data Warehouse",
    duration: "8 hrs",
    lessons: 20,
    topics: [
      "BigQuery architecture & columnar storage internals",
      "Advanced SQL: window functions, nested records, arrays",
      "Partitioning, clustering & query performance optimization",
      "BigQuery ML, BI Engine & Omni multi-cloud",
    ],
  },
  {
    id: 3,
    title: "Cloud Dataflow — Streaming & Batch Pipelines",
    duration: "6 hrs",
    lessons: 16,
    topics: [
      "Apache Beam unified programming model",
      "Building batch pipelines with Dataflow templates",
      "Streaming pipelines, windowing & triggers",
      "Autoscaling, monitoring & cost management",
    ],
  },
  {
    id: 4,
    title: "Dataproc — Managed Spark & Hadoop",
    duration: "5 hrs",
    lessons: 14,
    topics: [
      "Dataproc cluster setup, autoscaling, and preemptibles",
      "PySpark for large-scale data transformations",
      "Hive metastore & integration with BigQuery",
      "Dataproc Serverless Spark and cost strategies",
    ],
  },
  {
    id: 5,
    title: "Cloud Composer / Apache Airflow Orchestration",
    duration: "5 hrs",
    lessons: 14,
    topics: [
      "Airflow concepts: DAGs, Operators, XComs, Sensors",
      "Building production-grade orchestrated pipelines",
      "Cloud Composer environment setup and upgrades",
      "Scheduling, alerting, and SLA monitoring",
    ],
  },
  {
    id: 6,
    title: "Pub/Sub — Event-Driven Architecture",
    duration: "4 hrs",
    lessons: 10,
    topics: [
      "Pub/Sub topics, subscriptions, and delivery guarantees",
      "Push vs pull delivery and ordering semantics",
      "Integration with Dataflow streaming pipelines",
      "Dead letter queues, retries, and error handling",
    ],
  },
  {
    id: 7,
    title: "Real-Time Pipelines & Streaming Analytics",
    duration: "6 hrs",
    lessons: 16,
    topics: [
      "End-to-end streaming architecture on GCP",
      "Pub/Sub → Dataflow → BigQuery reference pipeline",
      "Looker Studio real-time dashboards",
      "Monitoring with Cloud Monitoring, Logging & Alerting",
    ],
  },
  {
    id: 8,
    title: "Capstone Project & Career Preparation",
    duration: "8 hrs",
    lessons: 8,
    topics: [
      "Design a complete data engineering solution on GCP",
      "Ingest, transform, and serve real-world datasets",
      "Architecture review and code walkthroughs",
      "Resume prep, mock interviews & GCP DE exam guidance",
    ],
  },
];

const TESTIMONIALS = [
  {
    name: "Arjun Sharma",
    role: "Data Engineer at Infosys",
    avatar: "AS",
    color: "from-blue-500 to-indigo-600",
    text: "The BigQuery and Dataflow modules were incredibly in-depth. I landed my first Data Engineering role within 2 months of completing this course. Real-world examples made complex concepts click instantly.",
  },
  {
    name: "Priya Nair",
    role: "Cloud Architect at TCS",
    avatar: "PN",
    color: "from-violet-500 to-purple-600",
    text: "Coming from a traditional DBA background, this course was my bridge to the cloud. The Airflow and Pub/Sub sections alone are worth the entire fee. Highly structured and genuinely practical.",
  },
  {
    name: "Rahul Verma",
    role: "Senior Data Analyst at Wipro",
    avatar: "RV",
    color: "from-cyan-500 to-blue-600",
    text: "I cleared the Google Professional Data Engineer certification on my first attempt. The capstone project gave me a real portfolio piece I now showcase in every interview. Incredible value.",
  },
  {
    name: "Sneha Patil",
    role: "ML Engineer at Flipkart",
    avatar: "SP",
    color: "from-emerald-500 to-teal-600",
    text: "The live doubt-clearing sessions with the instructor made this feel like a bootcamp. You get real answers, not pre-recorded scripts. Best investment I have made in my tech career.",
  },
];

const TICKER = [
  "Rohan from Mumbai just enrolled",
  "Divya from Bangalore just enrolled",
  "Karthik from Chennai just enrolled",
  "Pooja from Hyderabad just enrolled",
  "Ankit from Delhi just enrolled",
  "Meena from Pune just enrolled",
  "Vijay from Kolkata just enrolled",
];

const FAQS = [
  {
    q: "Do I need prior GCP experience to join?",
    a: "No prior GCP experience is needed. The course starts from cloud fundamentals and builds up progressively. Basic SQL and Python familiarity is helpful but not mandatory.",
  },
  {
    q: "Is this a live or self-paced course?",
    a: "Both. You get 46+ hours of recorded HD video for self-paced study, plus scheduled live doubt-clearing sessions with the instructor every weekend.",
  },
  {
    q: "Will I receive a certificate on completion?",
    a: "Yes. You receive a SkillVane IT Academy completion certificate. The curriculum is also aligned with the Google Professional Data Engineer certification exam.",
  },
  {
    q: "What is the refund policy?",
    a: "We offer a 7-day no-questions-asked refund if you are not satisfied after accessing up to Module 2 of the course.",
  },
  {
    q: "Is EMI available?",
    a: "Yes. Razorpay offers 0% EMI on most major Indian credit cards. The EMI option appears automatically during checkout.",
  },
];

const FEATURES = [
  { icon: Database, title: "BigQuery Mastery", desc: "Serverless DW, SQL optimization, ML & BI Engine" },
  { icon: Zap, title: "Real-Time Streaming", desc: "Pub/Sub ingestion & Dataflow streaming pipelines" },
  { icon: Layers, title: "Batch Processing", desc: "Dataproc Spark jobs & large-scale transformations" },
  { icon: GitBranch, title: "Pipeline Orchestration", desc: "Cloud Composer, Airflow DAGs & monitoring" },
  { icon: Cloud, title: "GCP Architecture", desc: "IAM, networking, cost optimization & resource mgmt" },
  { icon: Code2, title: "Python & PySpark", desc: "Data engineering scripts, Beam & automation" },
  { icon: TrendingUp, title: "Real-World Projects", desc: "Portfolio-grade end-to-end pipeline capstone" },
  { icon: Shield, title: "Certification Prep", desc: "Google Professional DE exam strategies & mocks" },
];

export default function App() {
  const [openModule, setOpenModule] = useState<number | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [ticker, setTicker] = useState(0);
  const [payLoading, setPayLoading] = useState(false);
  const [payDone, setPayDone] = useState(false);

  useEffect(() => {
    const t = setInterval(() => setTicker((i) => (i + 1) % TICKER.length), 2800);
    return () => clearInterval(t);
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMobileOpen(false);
  };

  const handleBuyNow = () => {
    setPayLoading(true);
    setTimeout(() => {
      setPayLoading(false);
      setPayDone(true);
      setTimeout(() => setPayDone(false), 4000);
    }, 1000);
  };

  return (
    <div
      className="min-h-screen bg-background text-foreground overflow-x-hidden"
      style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}
    >
      {/* ── Navbar ── */}
      <nav className="sticky top-0 z-50 border-b border-border bg-background/85 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shadow-lg shadow-primary/40">
              <Cloud className="w-4 h-4 text-white" />
            </div>
            <span
              className="font-bold text-sm tracking-tight"
              style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
            >
              SkillVane{" "}
              <span className="text-primary">IT Academy</span>
            </span>
          </div>

          <div className="hidden md:flex items-center gap-7 text-sm text-muted-foreground">
            {["curriculum", "instructor", "testimonials", "pricing"].map((s) => (
              <button
                key={s}
                onClick={() => scrollTo(s)}
                className="capitalize hover:text-foreground transition-colors"
              >
                {s === "testimonials" ? "Reviews" : s.charAt(0).toUpperCase() + s.slice(1)}
              </button>
            ))}
          </div>

          <button
            onClick={() => scrollTo("pricing")}
            className="hidden md:block px-5 py-2 rounded-lg bg-primary text-white text-sm font-semibold hover:opacity-90 transition-all shadow-md shadow-primary/30"
          >
            Enroll Now →
          </button>

          <button className="md:hidden p-2 text-muted-foreground" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {mobileOpen && (
          <div className="md:hidden bg-card border-t border-border px-4 py-4 flex flex-col gap-1">
            {["curriculum", "instructor", "testimonials", "pricing"].map((s) => (
              <button
                key={s}
                onClick={() => scrollTo(s)}
                className="capitalize text-sm text-muted-foreground hover:text-foreground py-2.5 text-left border-b border-border/40 last:border-0"
              >
                {s === "testimonials" ? "Reviews" : s.charAt(0).toUpperCase() + s.slice(1)}
              </button>
            ))}
            <button
              onClick={() => scrollTo("pricing")}
              className="mt-3 w-full py-3 rounded-lg bg-primary text-white text-sm font-semibold"
            >
              Enroll Now →
            </button>
          </div>
        )}
      </nav>

      {/* ── Hero ── */}
      <section className="relative overflow-hidden pb-24 pt-16 sm:pt-24">
        {/* Dot-grid background */}
        <div
          className="pointer-events-none absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              "radial-gradient(circle, rgba(67,97,238,0.35) 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />
        {/* Glow orbs */}
        <div className="pointer-events-none absolute top-24 left-1/3 w-[500px] h-[500px] rounded-full bg-primary/15 blur-[140px]" />
        <div className="pointer-events-none absolute top-48 right-1/4 w-80 h-80 rounded-full bg-cyan-500/10 blur-[100px]" />

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 text-center">
          {/* Pill badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-primary/30 bg-primary/10 text-xs font-mono text-primary mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            New Batch Starting Soon · Limited Seats Available
          </div>

          <h1
            className="text-4xl sm:text-5xl lg:text-[3.75rem] font-extrabold tracking-tight leading-[1.1] mb-6"
            style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
          >
            Master{" "}
            <span
              style={{
                background: "linear-gradient(135deg, #4361ee 0%, #3bc9db 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              GCP Data Engineering
            </span>
            <br />
            <span className="text-muted-foreground font-semibold text-3xl sm:text-4xl lg:text-5xl">
              from Zero to Production
            </span>
          </h1>

          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed mb-10">
            A hands-on, instructor-led program covering BigQuery, Dataflow, Dataproc, Pub/Sub &
            Composer — taught by a working GCP Solution Architect. Build real pipelines, crack
            interviews, and pass the Google Professional Data Engineer certification.
          </p>

          {/* CTA buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center mb-12">
            <button
              onClick={() => scrollTo("pricing")}
              className="px-8 py-4 rounded-xl bg-primary text-white font-bold text-base hover:opacity-90 active:scale-[0.98] transition-all shadow-xl shadow-primary/30"
            >
              Enroll Now — ₹15,000
            </button>
            <button
              onClick={() => scrollTo("curriculum")}
              className="px-8 py-4 rounded-xl border border-border text-foreground font-semibold text-base hover:bg-accent transition-all flex items-center gap-2 justify-center"
            >
              <Play className="w-4 h-4 text-primary" />
              View Curriculum
            </button>
          </div>

          {/* Social proof row */}
          <div className="flex flex-wrap justify-center gap-5 sm:gap-8 text-sm text-muted-foreground mb-10">
            {[
              { icon: Users, color: "text-primary", label: "500+", sub: "Students Enrolled" },
              { icon: Star, color: "text-yellow-400", label: "4.9/5", sub: "Average Rating" },
              { icon: Award, color: "text-emerald-400", label: "GCP Certified", sub: "Instructor" },
              { icon: Clock, color: "text-cyan-400", label: "46+ Hours", sub: "of HD Content" },
            ].map(({ icon: Icon, color, label, sub }) => (
              <div key={label} className="flex items-center gap-2">
                <Icon className={`w-4 h-4 ${color}`} />
                <span>
                  <strong className="text-foreground">{label}</strong> {sub}
                </span>
              </div>
            ))}
          </div>

          {/* Enrollment ticker */}
          <div className="flex items-center justify-center gap-4">
            <div className="h-px w-16 bg-border" />
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-card border border-border text-xs text-muted-foreground min-w-[220px] justify-center">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse flex-shrink-0" />
              <span className="transition-all duration-500">{TICKER[ticker]}</span>
            </div>
            <div className="h-px w-16 bg-border" />
          </div>
        </div>
      </section>

      {/* ── What You Will Learn ── */}
      <section className="bg-card border-y border-border py-16 sm:py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <span className="text-xs font-mono text-primary tracking-widest uppercase">
              Learning Outcomes
            </span>
            <h2
              className="text-2xl sm:text-3xl font-bold mt-2"
              style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
            >
              Everything a GCP Data Engineer Needs
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {FEATURES.map(({ icon: Icon, title, desc }) => (
              <div
                key={title}
                className="group p-5 rounded-xl border border-border/60 bg-background hover:border-primary/50 hover:bg-primary/5 transition-all cursor-default"
              >
                <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center mb-3 group-hover:bg-primary/20 transition-colors">
                  <Icon className="w-4 h-4 text-primary" />
                </div>
                <h3
                  className="font-semibold text-sm mb-1"
                  style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                >
                  {title}
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Curriculum ── */}
      <section id="curriculum" className="py-16 sm:py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <span className="text-xs font-mono text-primary tracking-widest uppercase">
              Course Curriculum
            </span>
            <h2
              className="text-2xl sm:text-3xl font-bold mt-2 mb-3"
              style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
            >
              8 Modules · 46+ Hours · 110+ Lessons
            </h2>
            <p className="text-muted-foreground text-sm max-w-xl mx-auto">
              Structured from fundamentals to production deployment. Every module includes theory,
              hands-on GCP labs, and quizzes.
            </p>
          </div>

          <div className="space-y-2">
            {MODULES.map((mod) => (
              <div
                key={mod.id}
                className="border border-border/60 rounded-xl overflow-hidden"
              >
                <button
                  className="w-full flex items-center justify-between p-4 sm:p-5 text-left hover:bg-accent/60 transition-colors"
                  onClick={() => setOpenModule(openModule === mod.id ? null : mod.id)}
                >
                  <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                    <span className="flex-shrink-0 w-7 h-7 rounded-lg bg-primary/10 text-primary text-xs font-mono flex items-center justify-center">
                      {String(mod.id).padStart(2, "0")}
                    </span>
                    <span
                      className="font-semibold text-sm sm:text-base truncate"
                      style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                    >
                      {mod.title}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0 ml-3">
                    <span className="hidden sm:block text-xs text-muted-foreground whitespace-nowrap">
                      {mod.lessons} lessons · {mod.duration}
                    </span>
                    <ChevronDown
                      className={`w-4 h-4 text-muted-foreground transition-transform duration-200 ${
                        openModule === mod.id ? "rotate-180" : ""
                      }`}
                    />
                  </div>
                </button>

                {openModule === mod.id && (
                  <div className="px-4 sm:px-5 pb-5 border-t border-border/40 bg-card/60">
                    <p className="sm:hidden text-xs text-muted-foreground pt-3 pb-1">
                      {mod.lessons} lessons · {mod.duration}
                    </p>
                    <ul className="mt-3 space-y-2.5">
                      {mod.topics.map((topic) => (
                        <li key={topic} className="flex items-start gap-3 text-sm text-muted-foreground">
                          <Check className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                          {topic}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Instructor ── */}
      <section id="instructor" className="py-16 sm:py-20 bg-card border-y border-border">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <span className="text-xs font-mono text-primary tracking-widest uppercase">
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
            <div className="flex-shrink-0 flex flex-col items-center gap-4">
              <div
                className="w-28 h-28 sm:w-36 sm:h-36 rounded-2xl flex items-center justify-center text-white text-3xl sm:text-4xl font-bold shadow-2xl shadow-primary/30"
                style={{ background: "linear-gradient(135deg, #4361ee 0%, #3bc9db 100%)" }}
              >
                SV
              </div>
              <div className="flex gap-1">
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
              <p className="text-primary font-semibold text-sm mb-5">
                Solution Architect · SkillVane IT Academy
              </p>
              <p className="text-muted-foreground text-sm leading-relaxed mb-8 max-w-xl">
                With over 8 years of hands-on experience designing large-scale data pipelines on
                Google Cloud Platform, your instructor has architected solutions for Fortune 500
                enterprises across BFSI, e-commerce, and logistics. As a Google Certified
                Professional Data Engineer and Cloud Architect, they bring real-world war stories,
                battle-tested patterns, and current industry practices directly into every lesson —
                no filler, no theory-only slides.
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
                    className="p-3 sm:p-4 rounded-xl bg-background border border-border/60 text-center"
                  >
                    <div
                      className="text-xl sm:text-2xl font-bold text-primary"
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

      {/* ── Testimonials ── */}
      <section id="testimonials" className="py-16 sm:py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <span className="text-xs font-mono text-primary tracking-widest uppercase">
              Student Reviews
            </span>
            <h2
              className="text-2xl sm:text-3xl font-bold mt-2 mb-3"
              style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
            >
              Trusted by Professionals Across India
            </h2>
            <div className="flex items-center justify-center gap-1 mt-2">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
              ))}
              <span className="ml-2 text-muted-foreground text-sm">4.9 out of 5 · 500+ ratings</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {TESTIMONIALS.map((t) => (
              <div
                key={t.name}
                className="p-6 rounded-xl border border-border/60 bg-card hover:border-primary/40 transition-colors"
              >
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
                <p className="text-muted-foreground text-sm leading-relaxed mb-6">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-xl bg-gradient-to-br ${t.color} flex items-center justify-center text-white text-xs font-bold flex-shrink-0`}
                  >
                    {t.avatar}
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

      {/* ── Pricing ── */}
      <section id="pricing" className="py-16 sm:py-20 bg-card border-y border-border">
        <div className="max-w-xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10">
            <span className="text-xs font-mono text-primary tracking-widest uppercase">Pricing</span>
            <h2
              className="text-2xl sm:text-3xl font-bold mt-2"
              style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
            >
              One Price. Full Lifetime Access.
            </h2>
          </div>

          {payDone && (
            <div className="mb-6 p-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-sm text-center font-semibold">
              ✓ In the live site, Razorpay checkout opens here. See the deployment guide below.
            </div>
          )}

          <div className="rounded-2xl border-2 border-primary/50 bg-background overflow-hidden shadow-2xl shadow-primary/15">
            <div className="bg-primary px-6 py-4 flex items-center justify-between">
              <span
                className="font-bold text-white"
                style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
              >
                GCP Data Engineering Program
              </span>
              <span className="text-xs font-mono bg-white/20 px-2.5 py-1 rounded-full text-white">
                Most Popular
              </span>
            </div>

            <div className="p-6 sm:p-8">
              <div className="flex items-baseline gap-3 mb-1">
                <span
                  className="text-5xl font-extrabold"
                  style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                >
                  ₹15,000
                </span>
                <span className="text-muted-foreground line-through text-xl">₹25,000</span>
              </div>
              <p className="text-xs text-emerald-400 font-semibold mb-8">
                Save ₹10,000 · Limited time launch offer
              </p>

              <ul className="space-y-3 mb-8">
                {[
                  "46+ hours of recorded HD video lessons",
                  "8 modules from fundamentals to production",
                  "Hands-on labs with real GCP resources",
                  "Lifetime access + all future updates",
                  "Weekend live doubt-clearing sessions",
                  "SkillVane IT Academy completion certificate",
                  "Resume preparation + mock interview Q&A",
                  "Private student community (Slack + WhatsApp)",
                  "Google Professional DE exam prep & mock tests",
                ].map((f) => (
                  <li key={f} className="flex items-start gap-3 text-sm">
                    <Check className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>

              <button
                onClick={handleBuyNow}
                disabled={payLoading}
                className="w-full py-4 rounded-xl bg-primary text-white font-bold text-base hover:opacity-90 active:scale-[0.99] transition-all shadow-lg shadow-primary/30 disabled:opacity-60"
              >
                {payLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg
                      className="animate-spin w-4 h-4"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v8z"
                      />
                    </svg>
                    Creating order…
                  </span>
                ) : (
                  "Buy Now · Pay Securely via Razorpay"
                )}
              </button>

              <div className="mt-5 flex flex-wrap items-center justify-center gap-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Shield className="w-3.5 h-3.5 text-primary" /> SSL Secured
                </span>
                <span className="flex items-center gap-1">
                  <ArrowRight className="w-3.5 h-3.5 rotate-180 text-primary" /> 7-day Refund
                </span>
                <span className="flex items-center gap-1">
                  <Zap className="w-3.5 h-3.5 text-primary" /> Instant Access
                </span>
              </div>
              <p className="text-center text-xs text-muted-foreground mt-3">
                0% EMI available on major credit cards · UPI · Net Banking · Wallets
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="py-16 sm:py-20">
        <div className="max-w-2xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <span className="text-xs font-mono text-primary tracking-widest uppercase">FAQ</span>
            <h2
              className="text-2xl sm:text-3xl font-bold mt-2"
              style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
            >
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-2">
            {FAQS.map((faq, i) => (
              <div key={i} className="border border-border/60 rounded-xl overflow-hidden">
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

      {/* ── Footer CTA ── */}
      <section className="py-16 border-t border-border bg-card">
        <div className="max-w-xl mx-auto px-4 sm:px-6 text-center">
          <h2
            className="text-2xl sm:text-3xl font-bold mb-3"
            style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
          >
            Ready to become a GCP Data Engineer?
          </h2>
          <p className="text-muted-foreground text-sm mb-8">
            Join 500+ professionals who have transformed their careers with SkillVane IT Academy.
          </p>
          <button
            onClick={() => scrollTo("pricing")}
            className="px-10 py-4 rounded-xl bg-primary text-white font-bold text-base hover:opacity-90 transition-all shadow-xl shadow-primary/30"
          >
            Enroll Now — ₹15,000 →
          </button>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="py-8 border-t border-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-primary flex items-center justify-center">
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
            <a href="#" className="hover:text-foreground transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-foreground transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
