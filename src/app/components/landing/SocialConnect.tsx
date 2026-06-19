import { Reveal } from "@/app/components/effects/Reveal";
import { SOCIAL_LINKS } from "@/app/data/social";

export function SocialConnect() {
  return (
    <Reveal delay={360}>
      <div className="social-connect-card premium-surface float-gentle float-gentle-delay-2 relative overflow-hidden rounded-2xl p-4 sm:p-5">
        <div className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-[#4285f4]/15 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-10 -left-6 h-28 w-28 rounded-full bg-[#18c29c]/12 blur-3xl" />

        <div className="relative mb-4">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-[#f2b84b]">
            Connect With SkillVane
          </p>
          <h2
            className="mt-1 text-base font-black text-white sm:text-lg"
            style={{ fontFamily: "'Space Grotesk', system-ui, sans-serif" }}
          >
            Join the community or reach us directly
          </h2>
        </div>

        <div className="relative grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">
          {SOCIAL_LINKS.map((link, i) => {
            const Icon = link.icon;
            return (
              <a
                key={link.id}
                href={link.href}
                target={link.href.startsWith("tel:") ? undefined : "_blank"}
                rel={link.href.startsWith("tel:") ? undefined : "noopener noreferrer"}
                className={`social-link-tile group flex flex-col items-center gap-2 rounded-xl border px-3 py-3 text-center transition-all duration-300 ${link.border} ${link.bg} ${link.text} ${link.hoverBorder} ${link.hoverBg}`}
                style={{ animationDelay: `${i * 80}ms` }}
              >
                <span
                  className="flex h-9 w-9 items-center justify-center rounded-lg transition-transform duration-300 group-hover:scale-110 group-hover:-translate-y-0.5"
                  style={{ backgroundColor: `${link.accent}22` }}
                >
                  <Icon className="h-4 w-4" />
                </span>
                <span className="text-[11px] font-black uppercase tracking-wide">
                  {link.label}
                </span>
              </a>
            );
          })}
        </div>
      </div>
    </Reveal>
  );
}
