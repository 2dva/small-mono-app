import { defineConfig } from 'vite'
import { viteSingleFile } from 'vite-plugin-singlefile'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  root: './',

  plugins: [viteSingleFile(), vue()],

  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    minify: true,
    sourcemap: false,
    // Optional: Inline assets are handled better if CSS code splitting is disabled.
    cssCodeSplit: false,
    // Optional: Set asset inline limit very high to ensure everything is inlined.
    assetsInlineLimit: 1_000_000,
  },

  server: {
    open: false, // автоматически открывать в браузере
  },
})
