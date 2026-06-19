import { useEffect, useState } from "react";

const GCP_TERMS = [
  "BigQuery",
  "Dataflow",
  "Cloud Storage",
  "Pub/Sub",
  "Composer",
  "DataProc",
  "Databricks",
  "Delta Lake",
];

export function CyclingTechWords() {
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setIndex((i) => (i + 1) % GCP_TERMS.length);
        setVisible(true);
      }, 280);
    }, 2800);
    return () => clearInterval(interval);
  }, []);

  return (
    <span className="relative inline-block min-w-[10ch] align-bottom">
      <span
        className={`inline-block bg-gradient-to-r from-accent via-primary to-[#089691] bg-clip-text text-transparent transition-all duration-300 ${
          visible ? "translate-y-0 opacity-100 blur-0" : "translate-y-2 opacity-0 blur-sm"
        }`}
      >
        {GCP_TERMS[index]}
      </span>
    </span>
  );
}
