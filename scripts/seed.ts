import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Seed admin user
  const adminPassword = await bcrypt.hash('johndoe123', 12);
  await prisma.user.upsert({
    where: { email: 'john@doe.com' },
    update: {},
    create: {
      name: 'Admin User',
      email: 'john@doe.com',
      password: adminPassword,
      role: 'ADMIN',
    },
  });
  console.log('Admin user seeded');

  // Seed courses
  const courses = [
    {
      title: 'GCP Data Engineering Full Course - Live Batch',
      slug: 'gcp-data-engineering-live-batch',
      description: 'Comprehensive GCP Data Engineering training with daily live sessions, recordings, and resume assistance.',
      longDescription: 'Master Google Cloud Platform Data Engineering with our flagship 3-month live batch program. Covers BigQuery, Dataflow, Dataproc, Cloud Composer, Cloud Functions, Pub/Sub, and more. Includes daily hands-on practice, real-world projects, and dedicated placement support.',
      price: 12000,
      originalPrice: 18000,
      duration: '3 months',
      courseType: 'LIVE_BATCH' as const,
      schedule: 'Mon-Fri, 7:30 AM - 8:30 AM IST',
      features: ['Daily Live Sessions', 'Session Recordings', 'Notes & Materials', 'Resume Assistance', 'Placement Guidance', 'Doubt Support'],
      imageUrl: 'https://cdn.abacus.ai/images/9aed5d79-6556-46ef-99ec-272426819c67.png',
      sortOrder: 1,
      topics: [
        { title: 'Introduction to GCP & Cloud Computing', description: 'Overview of Google Cloud Platform, cloud computing fundamentals, and setting up your GCP account.', sortOrder: 1 },
        { title: 'GCP IAM & Security Basics', description: 'Identity and Access Management, service accounts, roles and permissions.', sortOrder: 2 },
        { title: 'Google Cloud Storage', description: 'Cloud Storage buckets, storage classes, lifecycle management, and data transfer.', sortOrder: 3 },
        { title: 'BigQuery Fundamentals', description: 'Introduction to BigQuery, SQL queries, datasets, tables, and partitioning.', sortOrder: 4 },
        { title: 'BigQuery Advanced - Optimization', description: 'Query optimization, materialized views, BI Engine, and cost management.', sortOrder: 5 },
        { title: 'Dataflow & Apache Beam', description: 'Building batch and streaming data pipelines with Dataflow and Apache Beam.', sortOrder: 6 },
        { title: 'Cloud Pub/Sub', description: 'Message queuing, topics, subscriptions, and real-time data streaming.', sortOrder: 7 },
        { title: 'Dataproc & Spark', description: 'Running Apache Spark on GCP with Dataproc clusters.', sortOrder: 8 },
        { title: 'Cloud Composer (Airflow)', description: 'Orchestrating data pipelines with Cloud Composer and Apache Airflow.', sortOrder: 9 },
        { title: 'Cloud Functions & Cloud Run', description: 'Serverless computing, triggers, and event-driven architectures.', sortOrder: 10 },
        { title: 'Data Fusion & ETL Pipelines', description: 'Building ETL pipelines with Cloud Data Fusion.', sortOrder: 11 },
        { title: 'Real-time Project: End-to-End Pipeline', description: 'Build a complete data pipeline from ingestion to visualization.', sortOrder: 12 },
      ],
    },
    {
      title: 'GCP Data Engineering Course - Recordings',
      slug: 'gcp-data-engineering-recordings',
      description: 'Access the latest batch recordings of our comprehensive GCP Data Engineering course at your own pace.',
      longDescription: 'Get the complete recordings from our latest live batch. Perfect for self-paced learners who want the same quality content without the live schedule. Includes all session recordings covering BigQuery, Dataflow, Dataproc, and more.',
      price: 6000,
      originalPrice: 12000,
      duration: 'Self-paced',
      courseType: 'RECORDINGS' as const,
      schedule: 'Watch anytime - lifetime access',
      features: ['Latest Batch Recordings', 'All Topics Covered', 'Lifetime Access', 'Notes & Materials'],
      imageUrl: 'https://cdn.abacus.ai/images/92861162-1e64-404a-85bf-2b3f7cfd432d.png',
      sortOrder: 2,
      topics: [
        { title: 'GCP Fundamentals & Setup', description: 'Cloud computing basics and GCP account configuration.', sortOrder: 1 },
        { title: 'Cloud Storage & IAM', description: 'Storage solutions and access management in GCP.', sortOrder: 2 },
        { title: 'BigQuery Complete', description: 'Complete BigQuery training from basics to advanced.', sortOrder: 3 },
        { title: 'Dataflow & Streaming', description: 'Building data pipelines with Dataflow.', sortOrder: 4 },
        { title: 'Dataproc & Spark', description: 'Apache Spark on GCP.', sortOrder: 5 },
        { title: 'Cloud Composer', description: 'Pipeline orchestration with Airflow.', sortOrder: 6 },
        { title: 'Serverless & Cloud Functions', description: 'Event-driven computing on GCP.', sortOrder: 7 },
        { title: 'End-to-End Project', description: 'Complete project implementation.', sortOrder: 8 },
      ],
    },
    {
      title: 'Python for Data Engineering',
      slug: 'python-for-data-engineering',
      description: 'Learn Python programming specifically tailored for data engineering tasks and GCP integration.',
      longDescription: 'A focused Python course designed for aspiring data engineers. Covers Python fundamentals, data manipulation with Pandas, API interactions, file handling, and Python integration with GCP services.',
      price: 599,
      originalPrice: 999,
      duration: 'Self-paced',
      courseType: 'SELF_PACED' as const,
      schedule: '',
      features: ['Python Fundamentals', 'Pandas & Data Manipulation', 'API Integration', 'GCP Python SDK'],
      imageUrl: 'https://cdn.abacus.ai/images/eea11388-893f-4ff5-a326-dfd86a69ae4c.png',
      sortOrder: 3,
      topics: [
        { title: 'Python Basics & Setup', description: 'Installing Python, IDEs, variables, data types, and operators.', sortOrder: 1 },
        { title: 'Control Flow & Functions', description: 'Conditionals, loops, functions, and error handling.', sortOrder: 2 },
        { title: 'Data Structures', description: 'Lists, dictionaries, tuples, sets, and comprehensions.', sortOrder: 3 },
        { title: 'File Handling & CSV', description: 'Reading and writing files, CSV processing, JSON handling.', sortOrder: 4 },
        { title: 'Pandas for Data Engineering', description: 'DataFrames, data cleaning, transformations, and aggregations.', sortOrder: 5 },
        { title: 'API Integration', description: 'REST APIs, requests library, and data extraction.', sortOrder: 6 },
        { title: 'Python with GCP', description: 'Google Cloud SDK, BigQuery client, Cloud Storage API.', sortOrder: 7 },
      ],
    },
    {
      title: 'Health Care GCP Data Engineering Project',
      slug: 'healthcare-gcp-data-engineering-project',
      description: 'Build a real-world healthcare data pipeline on GCP with patient data processing and analytics.',
      longDescription: 'Hands-on project building a complete healthcare data engineering solution on Google Cloud Platform. Process patient records, build ETL pipelines, create analytics dashboards, and ensure HIPAA-compliant data handling.',
      price: 1499,
      originalPrice: 2499,
      duration: 'Project-based',
      courseType: 'PROJECT' as const,
      schedule: '',
      features: ['Real Healthcare Dataset', 'End-to-End Pipeline', 'Analytics Dashboard', 'Portfolio Project'],
      imageUrl: 'https://cdn.abacus.ai/images/19f5bb9a-5046-4d84-90f1-dc5a4b339a59.png',
      sortOrder: 4,
      topics: [
        { title: 'Project Overview & Architecture', description: 'Understanding the healthcare data pipeline architecture and requirements.', sortOrder: 1 },
        { title: 'Data Ingestion Layer', description: 'Setting up data ingestion from healthcare sources into GCS.', sortOrder: 2 },
        { title: 'ETL Pipeline with Dataflow', description: 'Building transformation pipelines for patient data.', sortOrder: 3 },
        { title: 'BigQuery Data Warehouse', description: 'Designing and loading the healthcare data warehouse.', sortOrder: 4 },
        { title: 'Analytics & Reporting', description: 'Creating healthcare analytics and reporting dashboards.', sortOrder: 5 },
      ],
    },
    {
      title: 'Retailer GCP Data Engineering Project',
      slug: 'retailer-gcp-data-engineering-project',
      description: 'Build a retail analytics data pipeline on GCP with sales data processing and business intelligence.',
      longDescription: 'Create a complete retail data engineering solution on Google Cloud Platform. Process sales transactions, inventory data, build real-time analytics pipelines, and create business intelligence dashboards.',
      price: 1499,
      originalPrice: 2499,
      duration: 'Project-based',
      courseType: 'PROJECT' as const,
      schedule: '',
      features: ['Real Retail Dataset', 'Sales Analytics Pipeline', 'BI Dashboard', 'Portfolio Project'],
      imageUrl: 'https://cdn.abacus.ai/images/f476a230-bc6c-44a7-bdff-14d6c7bd233b.png',
      sortOrder: 5,
      topics: [
        { title: 'Project Setup & Architecture', description: 'Retail data pipeline architecture design and GCP setup.', sortOrder: 1 },
        { title: 'Sales Data Ingestion', description: 'Ingesting sales transactions and inventory data.', sortOrder: 2 },
        { title: 'Data Transformation', description: 'Cleaning and transforming retail data with Dataflow.', sortOrder: 3 },
        { title: 'Data Warehouse Design', description: 'Building the retail data warehouse in BigQuery.', sortOrder: 4 },
        { title: 'Business Intelligence', description: 'Creating BI dashboards and sales analytics reports.', sortOrder: 5 },
      ],
    },
  ];

  for (const courseData of courses) {
    const { topics, ...courseFields } = courseData;
    const course = await prisma.course.upsert({
      where: { slug: courseFields.slug },
      update: {
        title: courseFields.title,
        description: courseFields.description,
        longDescription: courseFields.longDescription,
        price: courseFields.price,
        originalPrice: courseFields.originalPrice,
        duration: courseFields.duration,
        courseType: courseFields.courseType,
        schedule: courseFields.schedule,
        features: courseFields.features,
        imageUrl: courseFields.imageUrl,
        sortOrder: courseFields.sortOrder,
      },
      create: courseFields,
    });
    // Upsert topics
    for (const topic of topics) {
      const existingTopics = await prisma.courseTopic.findMany({
        where: { courseId: course.id, title: topic.title },
      });
      if (existingTopics.length === 0) {
        await prisma.courseTopic.create({
          data: { ...topic, courseId: course.id },
        });
      }
    }
    console.log(`Seeded course: ${courseFields.title}`);
  }

  console.log('Seeding complete!');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
