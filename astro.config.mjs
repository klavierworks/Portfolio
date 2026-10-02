import { defineConfig } from 'astro/config';
import react from '@astrojs/react';

const FF8_DEPENDENCIES = [
  '@react-three/drei',
  '@react-three/fiber',
  '@react-three/postprocessing',
  'howler',
  'joystick-controller',
  'postprocessing',
  'react',
  'react/jsx-runtime',
  'react/jsx-dev-runtime',
  'react-dom/client',
  'three',
  'three-stdlib',
  'three/examples/jsm/Addons.js',
  'three/examples/jsm/utils/SkeletonUtils.js',
  'three/src/math/MathUtils.js',
  'zustand',
  'zustand/shallow',
];

// https://astro.build/config
export default defineConfig({
  integrations: [react()],
  vite: {
    // FF8 is consumed as TypeScript source and uses import.meta.glob, which the dependency
    // pre-bundler can't handle, so it is compiled as part of the site instead. Excluding it also
    // skips its own dependencies, several of which are CommonJS, so those are listed explicitly.
    optimizeDeps: {
      exclude: ['ff8'],
      include: FF8_DEPENDENCIES.map((dependency) => `ff8 > ${dependency}`),
    },
  },
});
