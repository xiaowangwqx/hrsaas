import request from '@/utils/request'

export function getRoleList(params) {
    return request({
        url: '/sys/role',
        method: 'GET',
        params
    })
}

// 获取企业信息
export function getCompanyInfo(companyId) {
    return request({
        url: `/company/${companyId}`
    })
}

// 删除角色
export function deleteRole(id) {
    return request({
        url: `/sys/role/${id}`,
        method: 'DELETE'
    })
}

// 编辑角色
export function UpdataRole(data) {
    return request({
        url: `/sys/role/${data.id}`,
        method: 'PUT',
        data
    })
}

// 获取角色详情
export function getRoleDetail(id) {
    return request({
        url: `/sys/role/${id}`,
        method: 'GET'
    })
}

// 新增角色
export function addRole(data) {
    return request({
        url: '/sys/role',
        method: 'POST',
        data
    })
}