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
    <div className="relative overflow-hidden border-y border-white/10 py-4">
      <div className="pointer-events-none absolute inset-0 bg-white/[0.02] backdrop-blur-sm" />
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-[#050c16] to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-[#050c16] to-transparent" />
      <div className="marquee-track relative flex w-max gap-3">
        {items.map((tech, i) => (
          <span
            key={`${tech}-${i}`}
            className="glass-pill inline-flex items-center gap-2 !rounded-2xl px-4 py-2 text-xs font-bold uppercase tracking-[0.12em] text-slate-200"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-[#4285F4] shadow-[0_0_10px_rgba(66,133,244,0.8)]" />
            {tech}
          </span>
        ))}
      </div>
    </div>
  );
}
