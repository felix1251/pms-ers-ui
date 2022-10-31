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
import Antd from 'ant-design-vue';
import { notification } from 'ant-design-vue';
import 'ant-design-vue/dist/antd.css';

loadFonts()
const app = createApp(App)
app.use(vuetify)
app.use(Antd)
app.use(createPinia())
app.use(router)
app.use(store);
app.config.globalProperties.$plain = {...plainAxiosInstance}; 
app.config.globalProperties.$secured = {...securedAxiosInstance};
app.config.globalProperties.$notification = {...notification};
app.mount('#app')
