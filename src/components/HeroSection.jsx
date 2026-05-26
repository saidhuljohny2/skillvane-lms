export default function HeroSection() {
  return (
    <section className="min-h-screen flex items-center justify-center px-6">
      <div className="max-w-5xl text-center">

        <p className="text-purple-400 mb-4 text-lg">
          LIVE ONLINE TRAINING + REAL-TIME PROJECTS
        </p>

        <h1 className="text-5xl md:text-7xl font-bold leading-tight">
          Become a
          <span className="gradient-text"> GCP Data Engineer </span>
          with Industry-Level Training
        </h1>

        <p className="mt-8 text-gray-300 text-xl">
          Master BigQuery, Dataproc, Dataflow, Airflow, Pub/Sub,
          Real-Time Pipelines, CI/CD, and Production Deployments.
        </p>

        <div className="mt-10 flex justify-center gap-4 flex-wrap">
          <a
            href="#pricing"
            className="bg-purple-600 hover:bg-purple-700 px-8 py-4 rounded-2xl text-lg font-bold transition"
          >
            Enroll Now
          </a>

          <a
            href="#curriculum"
            className="border border-gray-500 hover:border-purple-400 px-8 py-4 rounded-2xl text-lg transition"
          >
            View Curriculum
          </a>
        </div>

        <div className="mt-16 overflow-hidden">
          <div className="animate-pulse text-gray-400 text-lg">
            ⭐ 1000+ Students Trained • ⭐ Real-Time Projects • ⭐ Resume Support • ⭐ Interview Preparation
          </div>
        </div>
      </div>
    </section>
  );
}
