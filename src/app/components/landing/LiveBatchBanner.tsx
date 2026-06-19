import { motion } from "motion/react";
import { Calendar, Clock, MonitorPlay } from "lucide-react";

export function LiveBatchBanner({ onCta }: { onCta: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="relative mx-4 -mt-6 mb-0 max-w-5xl sm:mx-auto sm:-mt-10"
    >
      <div className="gradient-border-animated overflow-hidden rounded-2xl">
        <div className="relative flex flex-col gap-4 bg-[#0c1626]/95 p-5 backdrop-blur-xl sm:flex-row sm:items-center sm:justify-between sm:p-6">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_0%_50%,rgba(242,184,75,0.12),transparent_50%)]" />
          <div className="relative flex items-start gap-4">
            <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#4361ee] to-[#3bc9db] shadow-lg shadow-[#4361ee]/30">
              <MonitorPlay className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#f2b84b]">
                Featured Program
              </p>
              <h3 className="mt-1 text-xl font-black text-white sm:text-2xl">
                GCP Data Engineering Live Batch
              </h3>
              <div className="mt-2 flex flex-wrap gap-3 text-xs font-semibold text-slate-400">
                <span className="inline-flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5 text-[#18c29c]" />
                  Demo: Jul 1–3
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5 text-[#7cc7ff]" />
                  7:00–8:00 AM IST
                </span>
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={onCta}
            className="magnetic-button relative w-full rounded-xl bg-gradient-to-r from-[#f2b84b] to-[#f59e0b] px-6 py-3.5 text-sm font-black text-[#1b1202] shadow-xl shadow-[#f2b84b]/25 sm:w-auto"
          >
            Join Free Demo
          </button>
        </div>
      </div>
    </motion.div>
  );
}
