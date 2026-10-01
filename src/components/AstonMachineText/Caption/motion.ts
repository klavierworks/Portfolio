import type { MotionConfig } from '../config';
import { gaussian, walk } from '../random';

type Word = { element: HTMLElement; x: number; y: number };
type Field = (x: number, y: number) => number[];

const smoothstep = (t: number) => t * t * (3 - 2 * t);

function driftField(): Field {
  const points = new Map<string, number[]>();
  const at = (i: number, j: number) => {
    const key = `${i},${j}`;
    if (!points.has(key)) points.set(key, [gaussian(), gaussian()]);
    return points.get(key)!;
  };
  return (x, y) => {
    const gx = Math.floor(x);
    const gy = Math.floor(y);
    const sx = smoothstep(x - gx);
    const sy = smoothstep(y - gy);
    const a = at(gx, gy);
    const b = at(gx + 1, gy);
    const c = at(gx, gy + 1);
    const d = at(gx + 1, gy + 1);
    return [0, 1].map((k) =>
      1.45 * ((a[k] * (1 - sx) + b[k] * sx) * (1 - sy) + (c[k] * (1 - sx) + d[k] * sx) * sy));
  };
}

export class Motion {
  private words: Word[];
  private state = { weaveX: 0, weaveY: 0, flicker: 0, driftPhase: 0 };
  private previousField = driftField();
  private nextField = driftField();

  constructor(private stage: HTMLElement, words: HTMLElement[], private config: MotionConfig) {
    this.words = words.map((element) => ({ element, x: 0, y: 0 }));
  }

  get averageBrightness() {
    return 1 - 2 * this.config.flickerAmount;
  }

  measure(picture: HTMLElement, cssPixelsPerReferencePixel: number) {
    const origin = picture.getBoundingClientRect();
    for (const word of this.words) {
      const box = word.element.getBoundingClientRect();
      word.x = (box.left + box.width / 2 - origin.left) / cssPixelsPerReferencePixel;
      word.y = (box.top + box.height / 2 - origin.top) / cssPixelsPerReferencePixel;
    }
  }

  step(scale: number) {
    const { state, config } = this;
    state.weaveX = walk(state.weaveX, config.weavePersistenceX);
    state.weaveY = walk(state.weaveY, config.weavePersistenceY);
    state.flicker = walk(state.flicker, config.flickerPersistence);

    const weaveX = state.weaveX * config.weaveAmountX * scale;
    const weaveY = state.weaveY * config.weaveAmountY * scale;
    this.stage.style.transform = `translate(${weaveX}px, ${weaveY}px)`;
    this.stage.style.opacity = String(Math.min(1, 1 + (state.flicker - 2) * config.flickerAmount));

    state.driftPhase += config.frameMilliseconds / 1000 / config.driftCycleSeconds;
    if (state.driftPhase >= 1) {
      state.driftPhase -= 1;
      this.previousField = this.nextField;
      this.nextField = driftField();
    }
    const angle = state.driftPhase * Math.PI / 2;
    const fromWeight = Math.cos(angle);
    const toWeight = Math.sin(angle);
    const driftAmount = config.driftAmount * scale;
    for (const word of this.words) {
      const u = word.x / config.driftFeatureSize;
      const v = word.y / config.driftFeatureSize;
      const from = this.previousField(u, v);
      const to = this.nextField(u, v);
      const dx = driftAmount * (fromWeight * from[0] + toWeight * to[0]);
      const dy = driftAmount * (fromWeight * from[1] + toWeight * to[1]);
      word.element.style.transform = `translate(${dx}px, ${dy}px)`;
    }
  }
}
