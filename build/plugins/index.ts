import type { PluginOption } from 'vite'
import vue from '@vitejs/plugin-vue'
import unocss from 'unocss/vite'
import { visualizer } from 'rollup-plugin-visualizer'
import viteCompression from 'vite-plugin-compression'
import legacyPlugin from '@vitejs/plugin-legacy'
import Banner from 'vite-plugin-banner'

import unplugins from './unplugin'
import { setupHtmlPlugin } from './html'
import { setupMockPlugin } from './mock'

export function setupVitePlugins(viteEnv: ViteEnv, isBuild: boolean): PluginOption[] {
  const timestamp = Date.now()
  const plugins = [vue(), ...unplugins, unocss(), setupHtmlPlugin(viteEnv), legacyPlugin({
    targets: ['Android > 39', 'Chrome >= 60', 'Safari >= 10.1', 'iOS >= 10.3', 'Firefox >= 54', 'Edge >= 15'],
  }), [Banner(`\n Build based on ithings \n Time : ${timestamp}`)]]
  if (viteEnv.VITE_USE_MOCK)
    plugins.push(setupMockPlugin(isBuild))

  if (viteEnv.VITE_USE_COMPRESS) {
    plugins.push(
      viteCompression({ algorithm: viteEnv.VITE_COMPRESS_TYPE || 'gzip' }),
    )
  }

  if (isBuild) {
    plugins.push(
      visualizer({
        open: true,
        gzipSize: true,
        brotliSize: true,
      }),
    )
  }

  return plugins
}
