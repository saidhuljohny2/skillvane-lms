import { motion } from "motion/react";
import {
  Database,
  Cloud,
  GitBranch,
  HardDrive,
  Layers,
  Radio,
  Server,
  Workflow,
  Zap,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { GcpCloudMark } from "./GcpCloudMark";

const CLOUD_SERVICES: {
  name: string;
  icon: LucideIcon;
  color: string;
  angle: number;
}[] = [
  { name: "BigQuery", icon: Database, color: "#4285F4", angle: 0 },
  { name: "Dataflow", icon: Workflow, color: "#3b82f6", angle: 40 },
  { name: "ADF", icon: GitBranch, color: "#38bdf8", angle: 80 },
  { name: "Synapse", icon: Layers, color: "#60a5fa", angle: 120 },
  { name: "Databricks", icon: Server, color: "#f97316", angle: 160 },
  { name: "GCS", icon: HardDrive, color: "#34a853", angle: 200 },
  { name: "ADLS", icon: Database, color: "#0078d4", angle: 240 },
  { name: "Pub/Sub", icon: Radio, color: "#f2b84b", angle: 280 },
  { name: "Functions", icon: Zap, color: "#a855f7", angle: 320 },
];

function polarToPercent(angleDeg: number, radiusPercent: number) {
  const rad = (angleDeg * Math.PI) / 180;
  return {
    left: `${50 + radiusPercent * Math.cos(rad)}%`,
    top: `${50 + radiusPercent * Math.sin(rad)}%`,
  };
}

export function MultiCloudVisual() {
  const orbitRadius = 44;

  return (
    <div className="gcp-orbit-stage relative mx-auto aspect-square w-full max-w-[300px] sm:max-w-[420px] lg:max-w-[min(100%,480px)]">
      <div className="glass-orbit-ring pointer-events-none absolute inset-[5%] rounded-full" />

      <motion.div
        className="pointer-events-none absolute left-1/2 top-1/2 z-0 h-[62%] w-[62%] -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          background:
            "conic-gradient(from 180deg, rgba(66,133,244,0.25), rgba(52,168,83,0.2), rgba(251,188,4,0.18), rgba(234,67,53,0.2), rgba(66,133,244,0.25))",
        }}
        animate={{ rotate: 360 }}
        transition={{ duration: 24, repeat: Infinity, ease: "linear" }}
      />
      <div className="pointer-events-none absolute left-1/2 top-1/2 z-0 h-[50%] w-[50%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#4285F4]/15 blur-3xl" />

      <svg
        className="pointer-events-none absolute inset-0 h-full w-full"
        viewBox="0 0 100 100"
        aria-hidden
      >
        <defs>
          <linearGradient id="gcp-line-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#4285F4" stopOpacity="0.5" />
            <stop offset="50%" stopColor="#34A853" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#EA4335" stopOpacity="0.35" />
          </linearGradient>
        </defs>
        <circle
          cx="50"
          cy="50"
          r={orbitRadius}
          fill="none"
          stroke="rgba(255,255,255,0.1)"
          strokeWidth="0.45"
        />
        {CLOUD_SERVICES.map((svc) => {
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
              strokeWidth="0.4"
              strokeDasharray="1.2 0.9"
              opacity="0.75"
            />
          );
        })}
      </svg>

      {CLOUD_SERVICES.map((svc, i) => {
        const pos = polarToPercent(svc.angle, orbitRadius);
        const Icon = svc.icon;
        return (
          <motion.div
            key={svc.name}
            className="glass-chip absolute z-20 -translate-x-1/2 -translate-y-1/2 scale-[0.78] sm:scale-100"
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
              className="mb-0 flex h-7 w-7 items-center justify-center rounded-lg sm:mb-1 sm:h-8 sm:w-8 sm:rounded-xl"
              style={{
                background: `linear-gradient(135deg, ${svc.color}28, ${svc.color}10)`,
                border: `1px solid ${svc.color}50`,
                boxShadow: `0 4px 20px ${svc.color}25, inset 0 1px 0 rgba(255,255,255,0.15)`,
              }}
            >
              <Icon className="h-3.5 w-3.5 sm:h-4 sm:w-4" style={{ color: svc.color }} />
            </span>
            <span className="hidden whitespace-nowrap text-[9px] font-bold uppercase tracking-wider text-white sm:block">
              {svc.name}
            </span>
          </motion.div>
        );
      })}

      {/* Multi-cloud hub */}
      <motion.div
        className="gcp-cloud-hub glass-panel absolute left-1/2 top-1/2 z-30 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center"
        initial={{ opacity: 0, scale: 0.88 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        whileHover={{ scale: 1.03 }}
      >
        <div className="glass-portrait-shine pointer-events-none absolute inset-0 rounded-[inherit]" />
        <motion.div
          className="relative flex items-center gap-2"
          animate={{ y: [0, -3, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/95 p-1.5 shadow-lg sm:h-12 sm:w-12">
            <GcpCloudMark className="h-full w-full" />
          </span>
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#0078d4] shadow-lg shadow-[#0078d4]/20 sm:h-12 sm:w-12">
            <Cloud className="h-6 w-6 text-white sm:h-7 sm:w-7" />
          </span>
        </motion.div>
        <div className="relative mt-2 text-center">
          <p className="text-[9px] font-black uppercase tracking-[0.22em] text-[#7cc7ff]">
            GCP + Azure
          </p>
          <p className="mt-0.5 text-xs font-bold text-white sm:text-sm">
            Multi-Cloud Engineering
          </p>
        </div>
      </motion.div>
    </div>
  );
}
