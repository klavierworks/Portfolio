import { Motion } from './Caption/motion';
import { wrapWords } from './Caption/words';
import { astonMachineConfig as config } from './config';
import { setInkGain, sizeGlow } from './GlowFilter/glow';
import { Noise } from './Noise/noise';
import { layoutPicture } from './picture';

// WebKit gives any non-zero feGaussianBlur a minimum size, so small blurs come out far softer than requested.
// Every iOS browser is WebKit, and Blink keeps "AppleWebKit" in its user agent alongside "Chrome/".
const isWebKit = () => /AppleWebKit/.test(navigator.userAgent) && !/Chrome\//.test(navigator.userAgent);

export class OldDisplay extends HTMLElement {
  private picture!: HTMLElement;
  private caption!: HTMLElement;
  private filter!: SVGFilterElement;
  private noise!: Noise;
  private motion?: Motion;
  private scale = 1;
  private displayScale = 1;
  private reducedMotion = false;
  private visible = false;
  private frame = -1;
  private frameRequest = 0;
  private resizeObserver?: ResizeObserver;
  private intersectionObserver?: IntersectionObserver;

  connectedCallback() {
    this.picture = this.querySelector('.picture')!;
    if (isWebKit()) this.picture.style.filter = `blur(${config.pictureWebKit.blurPixels}px)`;
    this.caption = this.querySelector('.caption')!;
    this.filter = this.querySelector('filter')!;
    this.noise = new Noise(
      this.querySelector('.noise .grain')!,
      this.querySelector('.noise .unevenness')!,
      config.noise,
      config.picture,
    );
    this.reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const stage = this.querySelector<HTMLElement>('.stage')!;
    this.motion ??= new Motion(stage, wrapWords(stage), config.motion);

    this.resizeObserver = new ResizeObserver(() => this.refresh());
    this.resizeObserver.observe(this);
    document.fonts.ready.then(() => this.measureWords());

    if (!this.reducedMotion) {
      this.intersectionObserver = new IntersectionObserver(([entry]) => {
        this.visible = entry.isIntersecting;
        if (this.visible && !this.frameRequest) this.frameRequest = requestAnimationFrame(this.tick);
      });
      this.intersectionObserver.observe(this);
    }
  }

  disconnectedCallback() {
    this.resizeObserver?.disconnect();
    this.intersectionObserver?.disconnect();
    cancelAnimationFrame(this.frameRequest);
    this.frameRequest = 0;
  }

  private refresh() {
    const layout = layoutPicture(this, this.picture, config.picture);
    if (layout) ({ scale: this.scale, displayScale: this.displayScale } = layout);
    sizeGlow(this.filter, this.caption, isWebKit() ? { ...config.glow, ...config.glowWebKit } : config.glow);

    const noiseBrightness = this.noise.build(this.scale);
    const flickerBrightness = this.reducedMotion ? 1 : this.motion!.averageBrightness;
    setInkGain(this.filter, 1 / (noiseBrightness * flickerBrightness));

    this.measureWords();
  }

  private measureWords() {
    this.motion!.measure(this.picture, this.displayScale * this.scale);
  }

  private tick = (now: number) => {
    if (!this.visible) {
      this.frameRequest = 0;
      return;
    }
    this.frameRequest = requestAnimationFrame(this.tick);
    const frame = Math.floor(now / config.motion.frameMilliseconds);
    if (frame === this.frame) return;
    this.frame = frame;
    this.motion!.step(this.scale);
    this.noise.shuffle();
  };
}
