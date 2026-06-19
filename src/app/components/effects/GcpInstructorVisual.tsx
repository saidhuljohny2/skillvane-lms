import { motion } from "motion/react";
import {
  Database,
  GitBranch,
  HardDrive,
  Layers,
  Radio,
  Server,
  Workflow,
  Zap,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { ImageWithFallback } from "@/app/components/figma/ImageWithFallback";

const GCP_SERVICES: {
  name: string;
  icon: LucideIcon;
  color: string;
  angle: number;
}[] = [
  { name: "BigQuery", icon: Database, color: "#4285F4", angle: 0 },
  { name: "Dataflow", icon: Workflow, color: "#18c29c", angle: 40 },
  { name: "Composer", icon: GitBranch, color: "#7cc7ff", angle: 80 },
  { name: "Pub/Sub", icon: Radio, color: "#f2b84b", angle: 120 },
  { name: "DataProc", icon: Server, color: "#a855f7", angle: 160 },
  { name: "GCS", icon: HardDrive, color: "#34a853", angle: 200 },
  { name: "Cloud SQL", icon: Database, color: "#ea4335", angle: 240 },
  { name: "Terraform", icon: Layers, color: "#7b42bc", angle: 280 },
  { name: "Functions", icon: Zap, color: "#fbbc04", angle: 320 },
];

function polarToPercent(angleDeg: number, radiusPercent: number) {
  const rad = (angleDeg * Math.PI) / 180;
  return {
    left: `${50 + radiusPercent * Math.cos(rad)}%`,
    top: `${50 + radiusPercent * Math.sin(rad)}%`,
  };
}

export function GcpInstructorVisual({
  instructorPhoto,
}: {
  instructorPhoto: string;
}) {
  const orbitRadius = 44;

  return (
    <div className="gcp-orbit-stage relative mx-auto aspect-square w-full max-w-[min(100%,460px)]">
      <div className="glass-orbit-ring pointer-events-none absolute inset-[5%] rounded-full" />

      <svg
        className="pointer-events-none absolute inset-0 h-full w-full"
        viewBox="0 0 100 100"
        aria-hidden
      >
        <defs>
          <linearGradient id="gcp-line-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#4285F4" stopOpacity="0.45" />
            <stop offset="50%" stopColor="#18c29c" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#f2b84b" stopOpacity="0.3" />
          </linearGradient>
        </defs>
        <circle
          cx="50"
          cy="50"
          r={orbitRadius}
          fill="none"
          stroke="rgba(255,255,255,0.08)"
          strokeWidth="0.4"
        />
        {GCP_SERVICES.map((svc) => {
          const rad = (svc.angle * Math.PI) / 180;
          const x2 = 50 + orbitRadius * Math.cos(rad);
          const y2 = 50 + orbitRadius * Math.sin(rad);
          return (
            <line
              key={svc.name}
              x1="50"
              y1="50"
              x2={x2}
              y2={y2}
              stroke="url(#gcp-line-grad)"
              strokeWidth="0.35"
              strokeDasharray="1.2 1"
              opacity="0.7"
            />
          );
        })}
      </svg>

      {GCP_SERVICES.map((svc, i) => {
        const pos = polarToPercent(svc.angle, orbitRadius);
        const Icon = svc.icon;
        return (
          <motion.div
            key={svc.name}
            className="glass-chip absolute z-20 -translate-x-1/2 -translate-y-1/2"
            style={{ left: pos.left, top: pos.top }}
            initial={{ opacity: 0, scale: 0.75 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            animate={{ y: [0, -6, 0] }}
            transition={{
              opacity: { delay: 0.1 + i * 0.05, duration: 0.4 },
              scale: { delay: 0.1 + i * 0.05, type: "spring", stiffness: 220 },
              y: {
                duration: 2.8 + (i % 4) * 0.4,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.15,
              },
            }}
          >
            <span
              className="mb-1 flex h-8 w-8 items-center justify-center rounded-xl"
              style={{
                background: `linear-gradient(135deg, ${svc.color}28, ${svc.color}10)`,
                border: `1px solid ${svc.color}50`,
                boxShadow: `0 4px 20px ${svc.color}25, inset 0 1px 0 rgba(255,255,255,0.15)`,
              }}
            >
              <Icon className="h-4 w-4" style={{ color: svc.color }} />
            </span>
            <span className="whitespace-nowrap text-[9px] font-bold uppercase tracking-wider text-white">
              {svc.name}
            </span>
          </motion.div>
        );
      })}

      <motion.div
        className="glass-portrait relative absolute left-1/2 top-1/2 z-30 w-[48%] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-[1.65rem]"
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="glass-portrait-shine pointer-events-none absolute inset-0 z-10" />
        <ImageWithFallback
          src={instructorPhoto}
          alt="Shaik Saidhul — GCP Data Engineering Instructor"
          className="aspect-[3/4] w-full object-cover object-[center_8%]"
        />
        <div className="absolute inset-x-0 bottom-0 z-20 bg-gradient-to-t from-[#07111f]/95 via-[#07111f]/55 to-transparent px-2 pb-3 pt-12 text-center backdrop-blur-[2px]">
          <p className="text-[8px] font-black uppercase tracking-[0.22em] text-[#8df5d7]">
            Lead Instructor
          </p>
          <p className="text-sm font-black text-white">Shaik Saidhul</p>
        </div>
      </motion.div>

      <div className="pointer-events-none absolute left-1/2 top-1/2 z-0 h-[55%] w-[55%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-br from-[#4285F4]/20 via-[#18c29c]/15 to-transparent blur-2xl" />
    </div>
  );
}
