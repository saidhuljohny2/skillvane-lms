const GCP_TECH = [
  "BigQuery",
  "Cloud Storage",
  "Dataflow",
  "Pub/Sub",
  "Cloud Composer",
  "DataProc",
  "Databricks",
  "Delta Lake",
  "Cloud SQL",
  "IAM",
  "Looker",
  "Vertex AI",
  "Cloud Functions",
  "Apache Beam",
  "PySpark",
  "Airflow",
];

export function GcpTechMarquee() {
  const items = [...GCP_TECH, ...GCP_TECH];

  return (
    <section className="relative overflow-hidden border-y border-white/8 bg-[#050b14]/90 py-4">
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-[#050b14] to-transparent sm:w-24" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-[#050b14] to-transparent sm:w-24" />

      <div className="marquee-track flex w-max gap-3">
        {items.map((tech, i) => (
          <span
            key={`${tech}-${i}`}
            className="marquee-item inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-xs font-bold text-slate-300 whitespace-nowrap"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-gradient-to-r from-[#4285f4] to-[#34a853]" />
            {tech}
          </span>
        ))}
      </div>
    </section>
  );
}
