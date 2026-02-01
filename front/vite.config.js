import vue from '@vitejs/plugin-vue'
import { visualizer } from 'rollup-plugin-visualizer'
import { defineConfig, loadEnv } from 'vite'
import { viteSingleFile } from 'vite-plugin-singlefile'
import svgLoader from 'vite-svg-loader'
import { parsePublicEnv } from './src/lib/parsePublicEnv'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const publicEnv = parsePublicEnv(env)

  return {
    root: './',

    plugins: [viteSingleFile(), vue(), svgLoader(),
      env.HOST_ENV !== 'local'
        ? undefined
        : visualizer({
          filename: './dist/bundle-stats.html',
          gzipSize: true,
          brotliSize: true,
        })
    ],

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
      port: +env.PORT,
    },
    preview: {
      port: +env.PORT,
    },
    define: {
      'process.env': publicEnv,
    },
  }
})
