import confetti from "canvas-confetti";

const BRAND_COLORS = ["#0abab5", "#81d8d0", "#089691", "#6dd5d0", "#3d3d3d", "#b2e8e6"];

export function celebrateEnrollment() {
  const end = Date.now() + 2200;

  const frame = () => {
    confetti({
      particleCount: 3,
      angle: 60,
      spread: 55,
      origin: { x: 0, y: 0.65 },
      colors: BRAND_COLORS,
      zIndex: 9999,
    });
    confetti({
      particleCount: 3,
      angle: 120,
      spread: 55,
      origin: { x: 1, y: 0.65 },
      colors: BRAND_COLORS,
      zIndex: 9999,
    });

    if (Date.now() < end) {
      requestAnimationFrame(frame);
    }
  };

  confetti({
    particleCount: 120,
    spread: 80,
    origin: { y: 0.6 },
    colors: BRAND_COLORS,
    zIndex: 9999,
  });

  frame();
}
