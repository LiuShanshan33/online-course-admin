import request from '@/utils/request'
// 护理评估：启用状态
export function enableStatus(id) {
  return request({
    url: `/admin/busForm/enable/${id}`,
    method: 'post',
    params: {
      id
    }
  })
}

// 护理评估：禁用状态
export function disableStatus(id) {
  return request({
    url: `/admin/busForm/disable/${id}`,
    method: 'post',
    params: {
      id
    }
  })
}

// 护理诊断：获取诊断因素列表
export function busDiagElement(data) {
  return request({
    url: '/admin/busDiagElement/getPage',
    method: 'post',
    data
  })
}

// 护理诊断：获取诊断依据列表
export function busDiagBasis(data) {
  return request({
    url: '/admin/busDiagBasis/getPage',
    method: 'post',
    data
  })
}

// 护理诊断：获取诊断目标列表
export function busDiagTarget(data) {
  return request({
    url: '/admin/busDiagTarget/getPage',
    method: 'post',
    data
  })
}

// 护理诊断：获取诊断措施列表
export function busDiagMeasureDetail(data) {
  return request({
    url: '/admin/busDiagMeasureDetail/getPage',
    method: 'post',
    data
  })
}

// 宣教模板：启用状态
export function enable(id) {
  return request({
    url: `/admin/busMissionTemplate/enable/${id}`,
    method: 'post',
    params: {
      id
    }
  })
}

// 宣教模板：禁用状态
export function disable(id) {
  return request({
    url: `/admin/busMissionTemplate/disable/${id}`,
    method: 'post',
    params: {
      id
    }
  })
}

// 宣教模板：模板展示
export function missionPage(id) {
  return request({
    url: `/admin/common/missionPage/${id}`,
    method: 'post',
    params: {
      id
    }
  })
}

// 员工信息：通过员工号获取员工护理单元
export function getDepts(empNo) {
  return request({
    url: `/admin/sysUser/getDepts/${empNo}`,
    method: 'get'
  })
}

// 员工信息：修改员工的护理单元
export function saveUnit() {
  return request({
    url: '/admin/sysUser/saveUnit',
    method: 'post'
  })
}

//  模块管理：根据父级id获取模块
export function getNextMoudle(parentId) {
  return request({
    url: `/admin/sysMoudle/getList/${parentId}`,
    method: 'get'
  })
}

// 任务管理：暂停状态
export function pauseStatus(id) {
  return request({
    url: `/admin/sysTask/pause/${id}`,
    method: 'post',
    params: {
      id
    }
  })
}

// 任务管理：恢复状态
export function resumeStatus(id) {
  return request({
    url: `/admin/sysTask/resume/${id}`,
    method: 'post',
    params: {
      id
    }
  })
}

// 任务管理：初始化
export function recreateStatus(id) {
  return request({
    url: `/admin/sysTask/recreate/${id}`,
    method: 'post',
    params: {
      id
    }
  })
}

// 任务管理：立即执行
export function runOnceStatus(id) {
  return request({
    url: `/admin/sysTask/runOnce/${id}`,
    method: 'post',
    params: {
      id
    }
  })
}
