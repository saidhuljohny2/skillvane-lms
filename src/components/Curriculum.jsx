"use client";

import { useState } from "react";

const modules = [
  {
    title: "Introduction to GCP",
    content: "Cloud fundamentals, IAM, GCS, networking, architecture."
  },
  {
    title: "BigQuery",
    content: "Partitioning, clustering, optimization, ETL pipelines."
  },
  {
    title: "Cloud Dataflow",
    content: "Apache Beam, batch pipelines, streaming pipelines."
  },
  {
    title: "Dataproc & Spark",
    content: "PySpark, optimization, production ETL pipelines."
  },
  {
    title: "Cloud Composer / Airflow",
    content: "Workflow orchestration, DAGs, automation."
  },
  {
    title: "Pub/Sub & Real-time",
    content: "Streaming architecture and real-time analytics."
  }
];

export default function Curriculum() {
  const [open, setOpen] = useState(null);

  return (
    <section
      id="curriculum"
      className="py-24 px-6 bg-slate-950"
    >
      <div className="max-w-4xl mx-auto">
        <h2 className="text-5xl font-bold text-center mb-14">
          Course Curriculum
        </h2>

        <div className="space-y-5">
          {modules.map((item, index) => (
            <div
              key={index}
              className="glass rounded-2xl p-6 cursor-pointer"
              onClick={() => setOpen(open === index ? null : index)}
            >
              <div className="flex justify-between">
                <h3 className="text-2xl font-semibold">
                  {item.title}
                </h3>

                <span>{open === index ? "-" : "+"}</span>
              </div>

              {open === index && (
                <p className="mt-5 text-gray-300">
                  {item.content}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
