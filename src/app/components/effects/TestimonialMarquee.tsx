import { Star } from "lucide-react";

type Testimonial = {
  name: string;
  role: string;
  initials: string;
  color: string;
  text: string;
};

function TestimonialCard({ t }: { t: Testimonial }) {
  return (
    <div className="testimonial-card premium-surface flex w-[min(88vw,340px)] flex-shrink-0 flex-col rounded-2xl p-5 sm:w-[340px]">
      <div className="mb-3 flex gap-0.5">
        {[...Array(5)].map((_, i) => (
          <Star key={i} className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
        ))}
      </div>
      <p className="mb-4 flex-1 text-sm leading-relaxed text-slate-300">"{t.text}"</p>
      <div className="flex items-center gap-3">
        <div
          className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${t.color} text-xs font-bold text-white`}
        >
          {t.initials}
        </div>
        <div>
          <div className="text-sm font-semibold text-white">{t.name}</div>
          <div className="text-xs text-slate-400">{t.role}</div>
        </div>
      </div>
    </div>
  );
}

export function TestimonialMarquee({ testimonials }: { testimonials: Testimonial[] }) {
  const row = [...testimonials, ...testimonials];

  return (
    <div className="testimonial-marquee space-y-4">
      <div className="overflow-hidden">
        <div className="marquee-track-slow flex w-max gap-4">
          {row.map((t, i) => (
            <TestimonialCard key={`a-${t.name}-${i}`} t={t} />
          ))}
        </div>
      </div>
      <div className="overflow-hidden">
        <div className="marquee-track-reverse flex w-max gap-4">
          {[...row].reverse().map((t, i) => (
            <TestimonialCard key={`b-${t.name}-${i}`} t={t} />
          ))}
        </div>
      </div>
    </div>
  );
}
