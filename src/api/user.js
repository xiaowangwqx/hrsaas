import request from '@/utils/request'

/* 登录接口 */
export function login(data) {
    // 返回一个promise对象
    return request({
        url: '/sys/login',
        method: 'POST',
        data
    })
}
// 获取用户资料接口
export function getUserInfo() {
    return request({
        url: '/sys/profile',
        method: 'POST',
    })

}

//通过id 获取用户的基本信息 显示头像
export function getUserDetailById(id) {
    return request({
        url: `/sys/user/${id}`
    })
}

export function logout() {

}