import confetti from 'canvas-confetti';

export function triggerConfetti() {
  try {
    // Left side burst
    confetti({
      particleCount: 50,
      angle: 60,
      spread: 55,
      origin: { x: 0, y: 0.7 },
      colors: ['#38bdf8', '#34d399', '#f472b6', '#facc15', '#a78bfa']
    });

    // Right side burst
    confetti({
      particleCount: 50,
      angle: 120,
      spread: 55,
      origin: { x: 1, y: 0.7 },
      colors: ['#38bdf8', '#34d399', '#f472b6', '#facc15', '#a78bfa']
    });

    // Center star burst
    setTimeout(() => {
      confetti({
        particleCount: 60,
        spread: 100,
        origin: { x: 0.5, y: 0.5 },
        shapes: ['star', 'circle'],
        colors: ['#fef08a', '#67e8f9', '#f472b6', '#a7f3d0']
      });
    }, 200);
  } catch {
    // gracefully ignore if canvas confetti fails
  }
}
