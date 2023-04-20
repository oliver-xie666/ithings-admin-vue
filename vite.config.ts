import { defineConfig, loadEnv } from 'vite'
import type { ConfigEnv } from 'vite'
import { convertEnv, getRootPath, getSrcPath } from './build/utils'
import { createViteProxy, viteDefine } from './build/config'
import { setupVitePlugins } from './build/plugins'

export default defineConfig((configEnv: ConfigEnv) => {
  const srcPath = getSrcPath()
  const rootPath = getRootPath()
  const isBuild = configEnv.command === 'build'

  const viteEnv = convertEnv(loadEnv(configEnv.mode, process.cwd()))

  const { VITE_PORT, VITE_PUBLIC_PATH, VITE_USE_PROXY, VITE_PROXY_TYPE } = viteEnv

  const esbuild = {}
  const optimizeDeps = {}

  return {
    base: VITE_PUBLIC_PATH,
    resolve: {
      alias: {
        '~': rootPath,
        '@': srcPath,
        'vue$': 'vue/dist/vue.runtime.esm-bundler.js',
      },
    },
    define: viteDefine,
    plugins: [
      setupVitePlugins(viteEnv, isBuild)],
    server: {
      host: '0.0.0.0',
      port: VITE_PORT,
      open: true,
      proxy: createViteProxy(VITE_USE_PROXY, VITE_PROXY_TYPE as ProxyType),
    },
    esbuild,
    optimizeDeps,
    // css: {
    //   preprocessorOptions: {
    //     scss: {
    //       additionalData: '@import "src/styles/index.scss";',
    //     },
    //   },
    // },
    build: {
      target: 'es2017',
      minify: 'terser', // 是否进行压缩,boolean | 'terser' | 'esbuild',默认使用terser
      manifest: false, // 是否产出manifest.json
      sourcemap: false, // 是否产出sourcemap.json
      outDir: 'dist', // 产出目录
      reportCompressedSize: false,
      chunkSizeWarningLimit: 1024, // chunk 大小警告的限制（单位kb）
      commonjsOptions: {
        ignoreTryCatch: false,
      },
    },
  }
})
