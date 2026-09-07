export const MULTI_CLOUD_CURRICULUM: { module: string; topics: string[] }[] =
  [
    {
      module: "01 · Cloud Computing Foundations",
      topics: [
        "What cloud computing is and why modern businesses adopted it",
        "IaaS, PaaS, SaaS and how data teams use each model",
        "Cloud service providers compared: GCP, Azure, and AWS",
        "Data Lake vs Data Warehouse vs Lakehouse architectures",
      ],
    },
    {
      module: "02 · GCP Platform, IAM & Linux",
      topics: [
        "GCP core services, Console, Cloud Shell, and Cloud SDK",
        "Regions, zones, and global infrastructure",
        "Organizations, folders, projects, and billing accounts",
        "IAM: principals, roles, service accounts, and resource hierarchy",
        "Free-account setup and Cloud Shell workflow",
        "Linux essentials: files, permissions, grep, awk, sed, and shell tips",
      ],
    },
    {
      module: "03 · Python for Data Engineers",
      topics: [
        "Python types, operators, and core data structures",
        "Control flow, functions, lambdas, classes, and modules",
        "File I/O, exception handling, and production logging",
        "Datetime operations, packaging, and pip workflows",
        "REST APIs: HTTP methods, status codes, headers, and JSON",
        "Calling APIs with the requests library",
      ],
    },
    {
      module: "04 · Google Cloud Storage",
      topics: [
        "Buckets, objects, durability, and common DE use cases",
        "Console and CLI labs: create, upload, download, and access control",
        "Lifecycle rules, versioning, transfer, and service integrations",
        "Monitoring and logging for storage operations",
      ],
    },
    {
      module: "05 · Cloud SQL & Database Migration",
      topics: [
        "Provisioning instances, users, settings, and access controls",
        "Connect with Cloud SQL Studio, Shell, and workbenches",
        "Import/export, backups, and high availability",
        "End-to-end migration: manual export/import vs Cloud SQL DMS",
      ],
    },
    {
      module: "06 · BigQuery SQL & Analytics",
      topics: [
        "Architecture, slots (on-demand, flat-rate, flex), and use cases",
        "Native vs external tables, file formats, nested/repeated JSON",
        "Load from GCS & Cloud SQL, export, and real-time streaming",
        "Views, materialized views, authorized views, and IAM",
        "Query optimization, partitioning, and clustering",
        "Case study: Spotify analytics data platform",
        "Case study: enterprise social media analytics platform",
      ],
    },
    {
      module: "07 · Dataproc & PySpark",
      topics: [
        "Hadoop vs Spark vs MapReduce and Dataproc as managed Spark",
        "Cluster creation, preemptible VMs, and cost optimization",
        "PySpark: read/transform/write CSV, JSON, Parquet, SQL, and BigQuery",
        "Job submit, init actions, monitoring, and debugging",
        "Case study: employee travel records data cleaning",
        "Case study: real-time patient health data processing",
        "Case study: PySpark jobs to support ML model creation",
      ],
    },
    {
      module: "08 · Dataflow, Apache Beam & Pub/Sub",
      topics: [
        "When to use Beam/Dataflow vs Spark/Dataproc",
        "Beam I/O and transforms across files, databases, and BigQuery",
        "Pub/Sub topics, subscriptions, retention, and acknowledgements",
        "Publish/subscribe patterns for event-driven pipelines",
        "Case study: template-based Dataflow pipelines",
        "Case study: e-commerce transaction processing",
        "Case study: streaming pipeline with Python, Pub/Sub, Dataflow, BigQuery & GCS",
      ],
    },
    {
      module: "09 · Cloud Composer (Airflow DAGs)",
      topics: [
        "Airflow architecture and Composer environment setup",
        "Scheduling, monitoring, retries, logging, and troubleshooting",
        "Orchestrating BigQuery, Dataproc, Dataflow, and external APIs",
        "Level 1 DAG: BigQuery pipelines",
        "Level 2 DAG: Dataproc pipelines",
        "Level 3 DAG: Dataflow pipelines",
        "CI/CD for DAGs with Cloud Build and GitHub",
      ],
    },
    {
      module: "10 · Azure Foundations & Data Lake (ADLS)",
      topics: [
        "Azure Console, Cloud Shell, SDK, regions, and hierarchy",
        "Subscriptions, resource groups, management groups, and IAM",
        "ADLS Gen2: accounts, containers, blobs, hierarchical namespace",
        "RBAC vs ACLs, Hot/Cool/Archive tiers, and cost practices",
        "Manage data via portal, CLI, SDK, and REST API",
      ],
    },
    {
      module: "11 · Azure SQL, Data Factory & Synapse",
      topics: [
        "Azure SQL Database setup for practice workloads",
        "ADF: IR, linked services, datasets, pipelines, activities, triggers",
        "Monitoring, partitioning, parallelism, and pipeline design",
        "Case study: incremental pipeline with ADF, ADLS, and Azure SQL",
        "Synapse workspace, dedicated vs serverless SQL pools",
        "Synapse pipelines, external tables, views, and lake integration",
        "Query performance, partitioning, and workload management",
      ],
    },
    {
      module: "12 · Databricks Lakehouse (Azure / GCP)",
      topics: [
        "Lakehouse architecture: workspace, clusters, jobs, and Runtime",
        "Admin: users, permissions, billing, notebooks, and autoscaling",
        "Unity Catalog for unified governance and security",
        "Delta Lake ACID, versioning, tables, and incremental ELT",
        "Spark SQL + Python pipelines and performance tuning",
        "Case study: Spark Structured Streaming",
        "Case study: Autoloader for file-based ingestion",
      ],
    },
    {
      module: "13 · Career Outcomes & Interview Readiness",
      topics: [
        "Build end-to-end batch and streaming pipelines on GCP & Azure",
        "Apply Bronze → Silver → Gold (Medallion) architecture",
        "Troubleshoot production-style data engineering scenarios",
        "Interview prep with practical, scenario-based questions",
      ],
    },
  ];
