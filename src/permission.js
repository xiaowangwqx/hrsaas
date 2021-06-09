// 权限拦截在路由跳转 导航守卫

import router from '@/router'
import store from '@/store'
import NProgress from 'nprogress' //引入进度条
import 'nprogress/nprogress.css' //引入进度条样式

// 导航前置首守卫
// 定义白名单
const whiteList = ['/login', '/404']
router.beforeEach(async (to, from, next) => {
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
                // async函数 return的内容 await可以接收到
                const { roles } = await store.dispatch('user/getUserInfo')
                // console.log(roles);
                // 筛选用户的可用动态路由 
                const routes = await store.dispatch('permission/filterRoutes', roles.menus)
                // console.log(routes);
                // 把动态路由添加到路由表中 默认路由表中只有静态路由
                //addRoutes 
                router.addRoutes([...routes, { path: '*', redirect: '/404', hidden: true }])
                next(to.path) //相当于跳到对应地址
            } else {
                next()
            }
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