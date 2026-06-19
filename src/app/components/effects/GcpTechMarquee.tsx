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
    <section className="sv-strip relative overflow-hidden !py-4">
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-12 bg-gradient-to-r from-background to-transparent sm:w-20" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-12 bg-gradient-to-l from-background to-transparent sm:w-20" />

      <div className="marquee-track flex w-max gap-3 px-5 sm:px-6">
        {items.map((tech, i) => (
          <span
            key={`${tech}-${i}`}
            className="marquee-item inline-flex items-center gap-2 whitespace-nowrap rounded-full border border-border bg-card px-4 py-2 text-xs font-semibold text-muted-foreground"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
            {tech}
          </span>
        ))}
      </div>
    </section>
  );
}
