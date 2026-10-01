import type { NoiseConfig, PictureConfig } from '../config';
import { gaussian, seeded } from '../random';

function fillNoise(
  canvas: HTMLCanvasElement,
  cellSize: number,
  columns: number,
  rows: number,
  strength: number,
  random: () => number,
) {
  const mean = 1 - 2.5 * strength;
  const deviation = strength / 0.67;
  canvas.width = columns;
  canvas.height = rows;
  canvas.style.width = `${columns * cellSize}px`;
  canvas.style.height = `${rows * cellSize}px`;
  const context = canvas.getContext('2d')!;
  const image = context.createImageData(columns, rows);
  for (let i = 0; i < columns * rows; i++) {
    const value = Math.round(Math.min(1, Math.max(0, mean + deviation * gaussian(random))) * 255);
    image.data.set([value, value, value, 255], i * 4);
  }
  context.putImageData(image, 0, 0);
  return mean;
}

export class Noise {
  private span = { width: 0, height: 0 };

  constructor(
    private grain: HTMLCanvasElement,
    private unevenness: HTMLCanvasElement,
    private config: NoiseConfig,
    private picture: PictureConfig,
  ) {}

  build(scale: number) {
    const width = this.picture.referenceWidth * scale;
    const height = this.picture.referenceHeight * scale;

    const grainCell = this.config.grainCellSize * scale;
    const grainMean = fillNoise(
      this.grain, grainCell,
      Math.ceil(2 * width / grainCell), Math.ceil(2 * height / grainCell),
      this.config.grainStrength, Math.random,
    );
    this.span = { width, height };

    const unevennessCell = this.config.unevennessCellSize * scale;
    const unevennessMean = fillNoise(
      this.unevenness, unevennessCell,
      Math.ceil(width / unevennessCell) + 2, Math.ceil(height / unevennessCell) + 2,
      this.config.unevennessStrength, seeded(3),
    );
    this.unevenness.style.transform = `translate(${-unevennessCell}px, ${-unevennessCell}px)`;

    const averageBrightness = grainMean * unevennessMean;
    return averageBrightness;
  }

  shuffle() {
    this.grain.style.transform =
      `translate(${-Math.random() * this.span.width}px, ${-Math.random() * this.span.height}px)`;
  }
}
