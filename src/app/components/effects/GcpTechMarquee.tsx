const TECH = [
  "BigQuery",
  "Dataflow",
  "Cloud Composer",
  "Pub/Sub",
  "DataProc",
  "Cloud Storage",
  "Databricks",
  "Terraform",
  "Cloud Functions",
  "Data Fusion",
  "Cloud SQL",
  "Apache Beam",
];

export function GcpTechMarquee() {
  const items = [...TECH, ...TECH];

  return (
    <div className="relative border-y border-white/8 bg-[#050d18]/90 py-4 overflow-hidden">
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-[#050d18] to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-[#050d18] to-transparent" />
      <div className="marquee-track flex w-max gap-3">
        {items.map((tech, i) => (
          <span
            key={`${tech}-${i}`}
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-xs font-bold uppercase tracking-[0.14em] text-slate-300 backdrop-blur-sm"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-[#18c29c] shadow-[0_0_8px_rgba(24,194,156,0.8)]" />
            {tech}
          </span>
        ))}
      </div>
    </div>
  );
}
