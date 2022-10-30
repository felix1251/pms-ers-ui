/* eslint-disable import/order */
import '@/@iconify/icons-bundle'
import App from '@/App.vue'
import vuetify from '@/plugins/vuetify'
import { loadFonts } from '@/plugins/webfontloader'
import router from '@/router'
import store from "@/store";
import { plainAxiosInstance, securedAxiosInstance } from "@/backend"
import '@/styles/styles.scss'
import '@core/scss/index.scss'
import { createPinia } from 'pinia'
import { createApp } from 'vue'

loadFonts()
const app = createApp(App)
app.use(vuetify)
app.use(createPinia())
app.use(router)
app.use(store);
app.config.globalProperties.$plain = {...plainAxiosInstance}; 
app.config.globalProperties.$secured = {...securedAxiosInstance};
app.mount('#app')
