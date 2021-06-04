// 权限拦截在路由跳转 导航守卫

import router from '@/router'
import store from '@/store'
import NProgress from 'nprogress' //引入进度条
import 'nprogress/nprogress.css' //引入进度条样式

// 导航前置首守卫
// 定义白名单
const whiteList = ['/login', '/404']
router.beforeEach(async(to, from, next) => {
    NProgress.start() //开启进度条
        // netx是前置导航守卫必须执行的钩子
    if (store.getters.token) {
        // 只有有token才能获取用户信息
        // 如果有token
        if (to.path === '/login') {
            next('/') //跳到主页
        } else {
            // 只有放行时 才会获取用户资料
            // 如果当前vuex中有用用户资料的id 表示已经有资料了 不需要获取 如果没有id才需要获取
            if (!store.getters.userId) {
                // 如果没有id值 才会获取用户资料
                await store.dispatch('user/getUserInfo')
            }
            next()
        }
    } else {
        if (whiteList.indexOf(to.path) > -1) {
            next()
        } else {
            next('/login')
        }
    }
    NProgress.done() //解决手动切换地址时 进度条不关闭
})

// 后置守卫
router.afterEach(() => {
    NProgress.done() //关闭进度条
})