import type { GlowConfig } from '../config';

export function sizeGlow(filter: SVGFilterElement, caption: HTMLElement, config: GlowConfig) {
  const textScale = parseFloat(getComputedStyle(caption).fontSize) / config.referenceFontSize;
  const pixelRatio = devicePixelRatio || 1;
  const snapToDevicePixel = (value: number) => Math.round(value * pixelRatio) / pixelRatio;
  const aspectFactor = Math.sqrt(config.blurAspect);
  const offsets = (stepSize: number): Record<string, number> => {
    const one = snapToDevicePixel(stepSize);
    const two = snapToDevicePixel(2 * stepSize);
    const four = snapToDevicePixel(4 * stepSize);
    return { 1: one, 2: two, 4: four, centre: -snapToDevicePixel((one + two + four) / 2) };
  };
  const shift: Record<string, Record<string, number>> = {
    x: offsets(config.edgeWidth * textScale * aspectFactor / 8),
    y: offsets(config.edgeWidth * textScale / aspectFactor / 8),
  };
  for (const node of filter.querySelectorAll<SVGElement>('feOffset[data-axis]')) {
    const { axis, step } = node.dataset;
    node.setAttribute(axis === 'x' ? 'dx' : 'dy', String(shift[axis!][step!]));
  }

  const blurs: Record<string, string> = {
    round: `${config.edgeRounding * textScale * aspectFactor} ${config.edgeRounding * textScale / aspectFactor}`,
    near: String(config.nearHaloRadius * textScale),
    far: String(config.farHaloRadius * textScale),
  };
  for (const node of filter.querySelectorAll<SVGElement>('feGaussianBlur[data-blur]')) {
    node.setAttribute('stdDeviation', blurs[node.dataset.blur!]);
  }
}

export function setInkGain(filter: SVGFilterElement, gain: number) {
  for (const node of filter.querySelectorAll('[data-ink-gain]')) node.setAttribute('slope', String(gain));
}
