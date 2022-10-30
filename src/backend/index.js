import axios from 'axios'
import store from './../../store'
import router from "./../../router";

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

securedAxiosInstance.interceptors.response.use(null, async error => {
  if (error.response && error.response.config && error.response.status == 401) {
    // do refresh request
    return plainAxiosInstance.post('api/admin/refresh', {}, { headers: { 'X-CSRF-TOKEN': store.state.csrf } })
      .then(response => {
        store.commit('refresh', { csrf: response.data.csrf })
        // retry request
        let retryConfig = error.response.config
        retryConfig.headers['X-CSRF-TOKEN'] = response.data.csrf
        return plainAxiosInstance.request(retryConfig)
      })
      .catch(err => {
        store.commit('unsetCurrentUser')
        router.replace('/signin')
        return Promise.reject(err)
      })
  } else {
    return Promise.reject(error)
  }
})

export {securedAxiosInstance, plainAxiosInstance}
