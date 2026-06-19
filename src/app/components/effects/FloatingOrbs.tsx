import { motion } from "motion/react";

const orbs = [
  { size: 420, x: "8%", y: "12%", color: "rgba(24,194,156,0.22)", delay: 0 },
  { size: 320, x: "78%", y: "18%", color: "rgba(47,128,237,0.18)", delay: 1.2 },
  { size: 280, x: "62%", y: "72%", color: "rgba(242,184,75,0.14)", delay: 2.4 },
  { size: 200, x: "18%", y: "68%", color: "rgba(124,199,255,0.12)", delay: 0.8 },
];

export function FloatingOrbs() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      {orbs.map((orb, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full blur-3xl"
          style={{
            width: orb.size,
            height: orb.size,
            left: orb.x,
            top: orb.y,
            background: `radial-gradient(circle, ${orb.color}, transparent 70%)`,
          }}
          animate={{
            x: [0, 24, -16, 0],
            y: [0, -20, 14, 0],
            scale: [1, 1.08, 0.96, 1],
          }}
          transition={{
            duration: 14 + i * 2,
            repeat: Infinity,
            ease: "easeInOut",
            delay: orb.delay,
          }}
        />
      ))}
    </div>
  );
}
