import { SOCIAL_LINKS } from "@/app/data/social";

export function SocialStrip() {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="mr-1 text-xs font-medium text-slate-500">Follow</span>
      {SOCIAL_LINKS.map((link) => {
        const Icon = link.icon;
        return (
          <a
            key={link.id}
            href={link.href}
            target={link.href.startsWith("tel:") ? undefined : "_blank"}
            rel={link.href.startsWith("tel:") ? undefined : "noopener noreferrer"}
            aria-label={link.label}
            className={`flex h-9 w-9 items-center justify-center rounded-full border transition-all duration-200 hover:-translate-y-0.5 ${link.border} ${link.bg} ${link.text} ${link.hoverBorder}`}
          >
            <Icon className="h-4 w-4" />
          </a>
        );
      })}
    </div>
  );
}
