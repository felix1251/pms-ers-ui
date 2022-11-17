import axios from 'axios'
import store from '@/store'
import router from "@/router";
import secureStorage from '@/secureStorage'

const API_URL = store.state.serverUrl

const securedAxiosInstance = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  }
})

const plainAxiosInstance = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  }
})

securedAxiosInstance.interceptors.request.use(config => {
  const method = config.method.toUpperCase()
  if (method !== 'OPTIONS' && method !== 'GET') {
    config.headers = {
      ...config.headers,
      'X-CSRF-TOKEN': store.state.csrf
    }
  }
  return config
})

const unsetUser = () => {
  let prevLocation = window.location
  secureStorage.setItem("prevPathOnRefresh", prevLocation.pathname + prevLocation.search)
  store.commit('unsetCurrentUser')
  router.replace('/login')
}

securedAxiosInstance.interceptors.response.use(null, async error => {
  if (error.response && error.response.config && error.response.status == 401) {
    return plainAxiosInstance.post('api/v2/refresh', {}, { headers: { 'X-CSRF-TOKEN': store.state.csrf } })
      .then(response => {
        store.commit('refresh', { csrf: response.data.csrf })
        let retryConfig = error.response.config
        retryConfig.headers['X-CSRF-TOKEN'] = response.data.csrf
        return plainAxiosInstance.request(retryConfig)
      })
      .catch(err => {
        unsetUser()
        return Promise.reject(err)
      })
  } else {
    return Promise.reject(error)
  }
})

export {securedAxiosInstance, plainAxiosInstance}
