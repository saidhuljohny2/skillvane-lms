import {
  Linkedin,
  MessageCircle,
  Phone,
  Send,
  Youtube,
  type LucideIcon,
} from "lucide-react";

export type SocialLink = {
  id: string;
  label: string;
  href: string;
  icon: LucideIcon;
  accent: string;
  border: string;
  bg: string;
  text: string;
  hoverBorder: string;
  hoverBg: string;
};

export const SOCIAL_LINKS: SocialLink[] = [
  {
    id: "whatsapp",
    label: "WhatsApp",
    href: "https://chat.whatsapp.com/J7vV8uKF8hSE5Zsx6ltoD1",
    icon: MessageCircle,
    accent: "#25D366",
    border: "border-[#25D366]/25",
    bg: "bg-[#25D366]/12",
    text: "text-[#b8ffd0]",
    hoverBorder: "hover:border-[#25D366]/50",
    hoverBg: "hover:bg-[#25D366]/20",
  },
  {
    id: "telegram",
    label: "Telegram",
    href: "https://t.me/gcpdataengineering",
    icon: Send,
    accent: "#3d3d3d",
    border: "border-[#3d3d3d]/25",
    bg: "bg-[#3d3d3d]/12",
    text: "text-[#bfe3ff]",
    hoverBorder: "hover:border-[#81d8d0]/50",
    hoverBg: "hover:bg-[#3d3d3d]/20",
  },
  {
    id: "youtube",
    label: "YouTube",
    href: "https://www.youtube.com/@SkillVane1711",
    icon: Youtube,
    accent: "#ef4444",
    border: "border-red-400/25",
    bg: "bg-red-500/12",
    text: "text-red-200",
    hoverBorder: "hover:border-red-400/50",
    hoverBg: "hover:bg-red-500/20",
  },
  {
    id: "linkedin",
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/shaik-saidhul-1286ab146",
    icon: Linkedin,
    accent: "#3d3d3d",
    border: "border-[#3d3d3d]/25",
    bg: "bg-[#3d3d3d]/12",
    text: "text-[#bfe3ff]",
    hoverBorder: "hover:border-[#81d8d0]/50",
    hoverBg: "hover:bg-[#3d3d3d]/20",
  },
  {
    id: "call",
    label: "Call",
    href: "tel:+917305101711",
    icon: Phone,
    accent: "#0abab5",
    border: "border-[#0abab5]/25",
    bg: "bg-[#0abab5]/12",
    text: "text-[#b2e8e6]",
    hoverBorder: "hover:border-[#0abab5]/50",
    hoverBg: "hover:bg-[#0abab5]/20",
  },
];
