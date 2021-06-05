import request from '@/utils/request'

// 获取员工的简单列表
export function getEmployeesSimple() {
    return request({
        url: '/sys/user/simple'
    })
}