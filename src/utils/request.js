/* eslint-disable new-cap */
import axios from 'axios'
import $config from '@/utils/env'
import { Toast } from 'vant'
console.log(process.env.NODE_ENV)
const service = axios.create({
    baseURL:  process.env.NODE_ENV === 'development' ? $config.env.BASE_URL : window.globalUrl,
    timeout: 50000,
    // withCredentials: false // 跨域请求是否携带cookie
})

// 请求拦截器
service.interceptors.request.use(
    config => {
        if (localStorage.getItem('faceToken')) {
            config.headers['token'] = localStorage.getItem('faceToken')
        }
        return config
    },
    error => {
        // eslint-disable-next-line no-new
        Promise.reject(error)
    }
)

// 响应拦截器-- 对首页是 加载
service.interceptors.response.use(
    response => {
        return response.data
    },
    error => {
        Toast({
            message: '访问超时', // error.message
            type: 'fail',
            duration: 3000
        })
        return Promise.reject(error)
    }
)

export default service