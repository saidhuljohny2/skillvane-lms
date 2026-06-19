import { Star } from "lucide-react";

const TESTIMONIALS = [
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

function TestimonialCard({
  t,
}: {
  t: (typeof TESTIMONIALS)[0];
}) {
  return (
    <article className="testimonial-card w-[340px] flex-shrink-0 rounded-2xl border border-white/10 bg-[#0b1423]/90 p-5 backdrop-blur-xl sm:w-[380px]">
      <div className="mb-3 flex gap-0.5">
        {[...Array(5)].map((_, i) => (
          <Star key={i} className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
        ))}
      </div>
      <p className="mb-5 text-sm leading-relaxed text-slate-300">"{t.text}"</p>
      <div className="flex items-center gap-3">
        <div
          className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${t.color} text-xs font-bold text-white`}
        >
          {t.initials}
        </div>
        <div>
          <p className="text-sm font-semibold text-white">{t.name}</p>
          <p className="text-xs text-slate-500">{t.role}</p>
        </div>
      </div>
    </article>
  );
}

export function TestimonialMarquee() {
  const row = [...TESTIMONIALS, ...TESTIMONIALS];

  return (
    <div className="relative overflow-hidden py-2">
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-[#07111f] to-transparent sm:w-28" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-[#07111f] to-transparent sm:w-28" />
      <div className="marquee-track-slow flex w-max gap-4">
        {row.map((t, i) => (
          <TestimonialCard key={`${t.name}-${i}`} t={t} />
        ))}
      </div>
    </div>
  );
}
