import confetti from 'canvas-confetti';

const confettiSetup = (angle: number, xAxis: number): confetti.Options => ({
  angle: angle,
  spread: 100,
  startVelocity: 50,
  particleCount: 200,
  origin: { x: xAxis, y: 1 },
  shapes: ['circle'],
  colors: ['#FF4766', '#39CC83', '#45AEF5', '#F5A73B', '#7665E5']
});

export function showConfetti() {
  confetti(confettiSetup(60, 0));
  confetti(confettiSetup(120, 1));
}
