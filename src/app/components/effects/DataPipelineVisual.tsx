import { Database, Cloud, GitBranch, BarChart3, Workflow, HardDrive } from "lucide-react";

const NODES = [
  { id: "ingest", label: "Pub/Sub", icon: Workflow, x: 8, y: 18, color: "#0abab5" },
  { id: "storage", label: "GCS", icon: HardDrive, x: 8, y: 50, color: "#81d8d0" },
  { id: "process", label: "Dataflow", icon: GitBranch, x: 42, y: 34, color: "#3d3d3d" },
  { id: "warehouse", label: "BigQuery", icon: BarChart3, x: 76, y: 22, color: "#0abab5" },
  { id: "orchestrate", label: "Composer", icon: Cloud, x: 76, y: 58, color: "#ea4335" },
  { id: "lake", label: "Delta Lake", icon: Database, x: 42, y: 72, color: "#0abab5" },
];

const PATHS = [
  "M 12 22 C 24 22, 30 30, 42 36",
  "M 12 54 C 24 54, 30 44, 42 40",
  "M 50 36 C 60 30, 68 26, 76 26",
  "M 50 40 C 60 48, 68 54, 76 58",
  "M 42 48 C 42 58, 42 64, 42 70",
];

export function DataPipelineVisual() {
  return (
    <div className="pipeline-visual relative w-full max-w-lg mx-auto aspect-[4/3] select-none">
      <div className="absolute inset-0 rounded-3xl border border-white/10 bg-gradient-to-br from-[#0d1f38]/90 via-[#1e1e1e]/80 to-[#0a1628]/90 shadow-2xl shadow-[#0abab5]/5 backdrop-blur-xl overflow-hidden">
        <div className="absolute inset-0 pipeline-grid opacity-40" />
        <div className="absolute -top-20 -right-20 h-56 w-56 rounded-full bg-[#0abab5]/15 blur-3xl animate-orb-drift" />
        <div className="absolute -bottom-16 -left-16 h-48 w-48 rounded-full bg-[#81d8d0]/12 blur-3xl animate-orb-drift-reverse" />

        <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-[#ea4335]/80" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#3d3d3d]/80" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#81d8d0]/80" />
          </div>
          <span className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-slate-500">
            gcp-pipeline.live
          </span>
        </div>

        <svg
          viewBox="0 0 100 90"
          className="absolute inset-x-0 top-8 bottom-4 w-full h-[calc(100%-3rem)] px-4"
          aria-hidden
        >
          <defs>
            <linearGradient id="pipeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#0abab5" stopOpacity="0.2" />
              <stop offset="50%" stopColor="#0abab5" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#3d3d3d" stopOpacity="0.3" />
            </linearGradient>
          </defs>

          {PATHS.map((d, i) => (
            <g key={d}>
              <path
                d={d}
                fill="none"
                stroke="url(#pipeGrad)"
                strokeWidth="0.6"
                strokeLinecap="round"
                className="pipeline-path-base"
              />
              <path
                d={d}
                fill="none"
                stroke="#81d8d0"
                strokeWidth="0.8"
                strokeLinecap="round"
                strokeDasharray="3 12"
                className="pipeline-path-flow"
                style={{ animationDelay: `${i * 0.4}s` }}
              />
            </g>
          ))}

          {NODES.map((node, i) => (
            <g
              key={node.id}
              className="pipeline-node"
              style={{ animationDelay: `${i * 0.15}s` }}
            >
              <circle
                cx={node.x}
                cy={node.y}
                r="5.5"
                fill={`${node.color}33`}
                stroke={node.color}
                strokeWidth="0.7"
              />
              <circle cx={node.x} cy={node.y} r="2" fill={node.color} />
              <text
                x={node.x}
                y={node.y + 9}
                textAnchor="middle"
                className="fill-slate-400 text-[3px] font-bold uppercase tracking-wider"
                style={{ fontFamily: "JetBrains Mono, monospace" }}
              >
                {node.label}
              </text>
            </g>
          ))}
        </svg>

        <div className="absolute left-4 right-4 top-14 hidden sm:grid grid-cols-3 gap-2 pointer-events-none">
          {NODES.slice(0, 3).map((node) => {
            const Icon = node.icon;
            return (
              <div
                key={node.id}
                className="flex items-center gap-1.5 rounded-lg border border-white/8 bg-black/20 px-2 py-1 backdrop-blur-sm"
              >
                <Icon className="h-3 w-3" style={{ color: node.color }} />
                <span className="text-[9px] font-mono font-bold text-slate-400">{node.label}</span>
              </div>
            );
          })}
        </div>

        <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between gap-2 rounded-xl border border-white/8 bg-black/30 px-3 py-2 backdrop-blur-md">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#81d8d0] opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-[#81d8d0]" />
            </span>
            <span className="text-[10px] font-mono text-[#b2e8e6]">Pipeline active</span>
          </div>
          <span className="text-[10px] font-mono text-slate-500">batch + streaming</span>
        </div>
      </div>
    </div>
  );
}
