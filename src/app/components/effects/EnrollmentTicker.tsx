import { motion, AnimatePresence } from "motion/react";
import { useEffect, useState } from "react";
import { Users } from "lucide-react";

const MESSAGES = [
  "Rohan from Mumbai just enrolled",
  "Divya from Bangalore just enrolled",
  "Karthik from Chennai just enrolled",
  "Pooja from Hyderabad just enrolled",
  "Ankit from Delhi just enrolled",
  "Meena from Pune just enrolled",
  "Vijay from Kolkata just enrolled",
];

export function EnrollmentTicker() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const t = setInterval(
      () => setIndex((i) => (i + 1) % MESSAGES.length),
      3200,
    );
    return () => clearInterval(t);
  }, []);

  return (
    <div className="relative overflow-hidden border-b border-white/[0.07] bg-gradient-to-r from-[#2dd4a6]/[0.05] via-[#07111d] to-[#eab96e]/[0.04] py-2.5">
      <div className="mx-auto flex max-w-7xl items-center justify-center gap-3 px-4 text-sm">
        <span className="inline-flex items-center gap-1.5 rounded-lg border border-[#2dd4a6]/20 bg-[#2dd4a6]/[0.07] px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.16em] text-[#8bedd0]">
          <Users className="h-3 w-3" />
          Live
        </span>
        <div className="relative h-5 min-w-[240px] overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.p
              key={index}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -14 }}
              transition={{ duration: 0.35 }}
              className="absolute inset-0 truncate text-center font-semibold text-slate-300"
            >
              <span className="text-[#eab96e]">●</span> {MESSAGES[index]}
            </motion.p>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
