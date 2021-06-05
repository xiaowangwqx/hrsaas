import { getToken, setToken, removeToken, setTimeStamp } from '@/utils/auth'
import { login, getUserInfo, getUserDetailById } from '@/api/user'

// 状态
const state = {
        // token持久化
        token: getToken(), //设置token为共享状态 初始化vuex时 先从缓存中读取
        userInfo: {}, //存放用户信息
    }
    // 修改状态
const mutations = {
        setToken(state, token) {
            state.token = token //将数据设置给vuex
                // 同步给缓存
            setToken(token)
        },
        removeToken(state) {
            state.token = null
            removeToken() //同步到缓存
        },
        setUserInfo(state, result) {
            state.userInfo = result
        },
        removeUserInfo(state) {
            state.userInfo = {}
        }
    }
    // 执行异步
const actions = {
    async login(context, data) {
        // 调用api接口
        const result = await login(data)
            // 为true表示登录成功
        context.commit('setToken', result); //设置token
        // 获取到token说明登录成功 
        setTimeStamp() //设置当前时间戳
    },
    async getUserInfo(context) {
        const result = await getUserInfo()
            // 获取用户详情
        const baseInfo = await getUserDetailById(result.userId)
        const obj = {...result, ...baseInfo }
        context.commit('setUserInfo', obj) //提交到mutations
        return result //return 给后期做权限留下伏笔
    },
    // 退出操作
    logout(context) {
        // 删除token
        context.commit('removeToken')
            // 删除用户资料
        context.commit('removeUserInfo')
    }
}


export default {
    namespaced: true,
    state,
    mutations,
    actions
}