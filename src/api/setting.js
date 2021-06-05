import request from '@/utils/request'

export function getRoleList(params) {
    return request({
        url: '/sys/role',
        method: 'GET',
        params
    })
}