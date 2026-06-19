import confetti from "canvas-confetti";

const GCP_COLORS = ["#4285f4", "#34a853", "#fbbc04", "#18c29c", "#7cc7ff", "#f2b84b"];

export function celebrateEnrollment() {
  const end = Date.now() + 2200;

  const frame = () => {
    confetti({
      particleCount: 3,
      angle: 60,
      spread: 55,
      origin: { x: 0, y: 0.65 },
      colors: GCP_COLORS,
      zIndex: 9999,
    });
    confetti({
      particleCount: 3,
      angle: 120,
      spread: 55,
      origin: { x: 1, y: 0.65 },
      colors: GCP_COLORS,
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
    colors: GCP_COLORS,
    zIndex: 9999,
  });

  frame();
}
