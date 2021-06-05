import axios from 'axios'
import store from '@/store'
import router from '@/router'
import { Message } from 'element-ui'
import { getTimeStamp } from '@/utils/auth'

const TimeOut = 3600 //定义超时时间

const service = axios.create({
    baseURL: process.env.VUE_APP_BASE_API,
    // baseURL: 'http://itcgq.com:8888/',
    timeout: 5000 //超时时间
})

// 请求拦截器
service.interceptors.request.use(config => {
    // config是请求的配置信息
    //在axios请求拦截器中统一 注入token
    if (store.getters.token) {
        // 在有token的情况下 才有必要检查时间戳是否存在
        if (checkTimeOut()) {
            // 为true表示 token失效
            store.dispatch('user/logout') //退出操作
            router.push('/login')
            return Promise.reject(new Error('token超时'))
        }
        config.headers['Authorization'] = `Bearer ${store.getters.token}`
    }
    return config //必须要返回
}, error => {
    return Promise.reject(error)
})

// 响应拦截器
service.interceptors.response.use(response => {
    const { success, message, data } = response.data //解构数据
    if (success) {
        return data
    } else {
        Message.error(message) //提示错误消息
        return Promise.reject(new Error(message))
    }
}, error => {
    // error里面有response的对象
    if (error.response && error.response.data && error.response.data.code === 10002) {
        // 表示后端提示 登录超时
        store.dispatch('user/logout') //退出
        router.push('/login')
    } else {
        Message.error(error.message) //提示错误信息
    }
    return Promise.reject(error) //返回执行错误 让当前的执行链跳出成功 直接进入catch
})

// 检查是否超市
// 超时逻辑 （当前时间戳-缓存中的时间戳） 是否大于时间差
function checkTimeOut() {
    var currentTime = Date.now()
    var timeStamp = getTimeStamp()
    return (currentTime - timeStamp) / 1000 > TimeOut
}

export default service