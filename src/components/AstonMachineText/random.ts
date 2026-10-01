export function gaussian(random: () => number = Math.random) {
  let u = 0;
  while (u === 0) u = random();
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * random());
}

export function seeded(seed: number) {
  return () => (seed = (seed * 16807) % 2147483647) / 2147483647;
}

export function walk(previous: number, keep: number) {
  return keep * previous + Math.sqrt(1 - keep * keep) * gaussian();
}
