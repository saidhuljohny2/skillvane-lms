export default function Instructor() {
  return (
    <section className="py-24 px-6">
      <div className="max-w-5xl mx-auto glass rounded-3xl p-10">

        <h2 className="text-5xl font-bold mb-10">
          About the Instructor
        </h2>

        <p className="text-gray-300 text-lg leading-8">
          Learn from a Solution Architect and GCP Data Engineering Trainer
          with extensive real-world industry experience in cloud data platforms,
          BigQuery, Databricks, Spark, Dataflow, Airflow, and enterprise-scale
          analytics solutions.
        </p>

        <div className="mt-8 grid md:grid-cols-3 gap-6">
          <div className="glass p-6 rounded-2xl">
            <h3 className="text-3xl font-bold">12+</h3>
            <p className="text-gray-400">Years Experience</p>
          </div>

          <div className="glass p-6 rounded-2xl">
            <h3 className="text-3xl font-bold">1000+</h3>
            <p className="text-gray-400">Students Trained</p>
          </div>

          <div className="glass p-6 rounded-2xl">
            <h3 className="text-3xl font-bold">Real-Time</h3>
            <p className="text-gray-400">Industry Projects</p>
          </div>
        </div>
      </div>
    </section>
  );
}
