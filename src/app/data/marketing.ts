import type { Testimonial } from "@/app/types";

export const TICKER = [
  "Rohan from Mumbai just enrolled",
  "Divya from Bangalore just enrolled",
  "Karthik from Chennai just enrolled",
  "Pooja from Hyderabad just enrolled",
  "Ankit from Delhi just enrolled",
  "Meena from Pune just enrolled",
  "Vijay from Kolkata just enrolled",
];

export const LIVE_BATCH = {
  headline: "New live batch starts 1st July at 7:00 AM IST",
  subline: "Free demo classes · July 1, 2 & 3",
  timing: "Mon–Fri · 7:00–8:00 AM IST",
};

export const FREE_LEARNING_PLAYLIST_URL =
  "https://www.youtube.com/playlist?list=PLk8wwChOsCPzoZHuQEiJqWVvhHFdFa6sy";

export const TESTIMONIALS: Testimonial[] = [
  {
    name: "Arjun Sharma",
    role: "Data Engineer at Infosys",
    initials: "AS",
    color: "from-blue-500 to-indigo-600",
    text: "The live batch format is incredible. Getting to ask questions in real time saved me weeks of confusion. Landed a Data Engineering role within 2 months of completing the course.",
  },
  {
    name: "Priya Nair",
    role: "Cloud Architect at TCS",
    initials: "PN",
    color: "from-violet-500 to-purple-600",
    text: "I started with the Python course and then upgraded to the GCP live batch. The progression was seamless and very well structured. The instructor explains complex concepts with remarkable clarity.",
  },
  {
    name: "Rahul Verma",
    role: "Senior Analyst at Wipro",
    initials: "RV",
    color: "from-cyan-500 to-blue-600",
    text: "Cleared the Google Professional Data Engineer exam on my first attempt. The Healthcare project gave me a standout portfolio piece that every interviewer asks about.",
  },
  {
    name: "Sneha Patil",
    role: "ML Engineer at Flipkart",
    initials: "SP",
    color: "from-emerald-500 to-teal-600",
    text: "The Retailer project course was worth every rupee. It bridged the gap between theory and production-grade engineering. I used the exact architecture in my current job.",
  },
];
