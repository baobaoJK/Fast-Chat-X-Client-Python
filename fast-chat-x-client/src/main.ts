import { createApp } from 'vue'
import pinia from '@/stores'

import App from './App.vue'
import router from './router'

import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

import moment from 'moment'

const app = createApp(App)

app.use(pinia)
app.use(ElementPlus, { zIndex: 3000, locale: zhCn })
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}
app.use(router)
app.use(moment)

app.mount('#app')
