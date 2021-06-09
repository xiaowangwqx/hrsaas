import request from '@/utils/request'

// 获取员工的简单列表
export function getEmployeesSimple() {
    return request({
        url: '/sys/user/simple'
    })
}

// 获取员工的综合列表
export function getEmployeeList(params) {
    return request({
        url: '/sys/user',
        method: 'GET',
        params
    })
}

// 删除员工
export function delEmployee(id) {
    return request({
        url: `/sys/user/${id}`,
        method: 'DELETE'
    })
}

// 新增员工
export function addEmployee(data) {
    return request({
        url: '/sys/user',
        method: 'POST',
        data
    })
}

// 导入员工数据接口  参数 data是一个数组类型
export function importEmployee(data) {
    return request({
        url: '/sys/user/batch',
        method: 'POST',
        data
    })
}

// 保存用户基本信息
export function saveUserDetailById(data){
    return request({
        url:`/sys/user/${data.id}`,
        method:'put',
        data
    })
}


//  *  读取用户详情的基础信息

 export function getPersonalDetail(id) {
    return request({
      url: `/employees/${id}/personalInfo`
    })
  }
  
  /** *
   *  更新用户详情的基础信息
   * **/
  export function updatePersonal(data) {
    return request({
      url: `/employees/${data.userId}/personalInfo`,
      method: 'put',
      data
    })
  }
  
  
  /** **
   * 获取用户的岗位信息
   *
   * ****/
  export function getJobDetail(id) {
    return request({
      url: `/employees/${id}/jobs`
    })
  }
  
  
  /**
   * 保存岗位信息
   * ****/
  export function updateJob(data) {
    return request({
      url: `/employees/${data.userId}/jobs`,
      method: 'put',
      data
    })
  }

  // 给用户分配角色
  export function assignRoles(data) {
    return request({
      url: '/sys/user/assignRoles',
      data,
      method: 'put'
    })
  }