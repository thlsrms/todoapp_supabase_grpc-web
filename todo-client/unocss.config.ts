import { defineConfig } from '@unocss/vite';
import { presetWind } from '@unocss/preset-wind';
import presetIcons from '@unocss/preset-icons';

export default defineConfig({
  presets: [presetWind(), presetIcons({
    collections: {
      mdi: () => import('@iconify-json/mdi/icons.json').then(i => i.default),
    }
  })],
  rules: []
});
