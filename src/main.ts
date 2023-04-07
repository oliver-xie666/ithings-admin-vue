import '@/styles/reset.css'
import '@/styles/index.scss'
import 'uno.css'
import 'virtual:svg-icons-register'

import { createApp } from 'vue'
import Nprogress from 'nprogress'
import App from './App.vue'
import { setupStore } from './store'
import { setupRouter } from './router'

/**
 * @description 导入加载进度条，防止首屏加载时间过长，用户等待
 *
 * */
import 'nprogress/nprogress.css'
Nprogress.configure({ showSpinner: false, ease: 'ease', speed: 500 })
Nprogress.start()

async function setupApp() {
  const app = createApp(App)
  setupStore(app)
  await setupRouter(app)
  app.mount('#app')
}

setupApp()
