// 专门处理权限路由模块

import { asyncRoutes, constantRoutes } from '@/router'

const state = {
    // 开始肯定拥有静态路由的权限
    routes: constantRoutes //路由表 当前拥有所拥有路由的数组
}
const mutations = {
    // 定义修改routes的mutations
    // newRoutes认为是登录成功要添加的新路由
    setRoutes(state, newRoutes) {
        state.routes = [...constantRoutes, ...newRoutes] //每次都是在静态路由的基础上 加新的路由
    }
}

const actions = {
    // 筛选权限路由
    // menus当前用户所拥有的的菜单权限
    filterRoutes(context, menus) {
        // 筛选出动态路由中 和menus能够对上的路由
        const routes = []
        menus.forEach(key => {
            routes.push(...asyncRoutes.filter(item => item.name === key))
        })
        //routes得到所有模块中满足权限要求的路由数组
        //    routes就是当前用户拥有的动态路由权限
        context.commit('setRoutes', routes)  //将动态路由提交给mutations
        return routes  //state数据是用来 显示左侧菜单 return是路由addRoutes用的

    }

}

export default {
    namespaced: true,
    state,
    mutations,
    actions
}