import confetti from 'canvas-confetti';

export function fireSmallConfetti() {
  try {
    confetti({
      particleCount: 35,
      spread: 60,
      origin: { y: 0.8 },
      colors: ['#a855f7', '#6366f1', '#3b82f6', '#10b981', '#f59e0b']
    });
  } catch (e) {}
}

export function fireBigCelebration() {
  try {
    const count = 200;
    const defaults = {
      origin: { y: 0.7 },
      colors: ['#c084fc', '#818cf8', '#38bdf8', '#34d399', '#fbbf24', '#f472b6']
    };

    function fire(particleRatio: number, opts: confetti.Options) {
      confetti({
        ...defaults,
        ...opts,
        particleCount: Math.floor(count * particleRatio)
      });
    }

    fire(0.25, { spread: 26, startVelocity: 55 });
    fire(0.2, { spread: 60 });
    fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8 });
    fire(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2 });
    fire(0.1, { spread: 120, startVelocity: 45 });
  } catch (e) {}
}
