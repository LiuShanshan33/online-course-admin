import request from '@/utils/request'
// 护理诊断：删除接口
export function deleteTeaInfo(id) {
  return request({
    url: `/tea/delete/${id}`,
    method: 'get',
    id
  })
}
// 科室信息：删除接口
export function deleteDeptInfo(id) {
  return request({
    url: `/admin/sysDept/delete/${id}`,
    method: 'post',
    id
  })
}
// 床位信息：删除接口
export function deleteBedInfo(id) {
  return request({
    url: `/admin/sysBed/delete/${id}`,
    method: 'post',
    id
  })
}
// 员工管理：根据员工id删除
export function deleteStaffdInfo(id) {
  return request({
    url: `/admin/sysUser/delete/${id}`,
    method: 'post',
    id
  })
}
// 通讯录：根据id删除
export function deleteAddrBook(id) {
  return request({
    url: `/admin/msgPhoneBook/delete/${id}`,
    method: 'post',
    id
  })
}
// 任务管理：删除任务
export function deleteTask(id) {
  return request({
    url: `/admin/sysTask/delete/${id}`,
    method: 'post',
    id
  })
}
// 附件管理：删除
export function deleteAccessory(id) {
  return request({
    url: `/admin/file/delete/${id}`,
    method: 'post',
    id
  })
}
// 应用授权：删除
export function deleteAppAuth(id) {
  return request({
    url: `/admin/sysApp/delete/${id}`,
    method: 'post',
    id
  })
}
// 删除节点
export function deleteNodeCode(nodeCode) {
  return request({
    url: `/flowNode/delete/${nodeCode}`,
    method: 'get',
    nodeCode
  })
}
// 删除角色
export function deleteRoleCode(roleCode) {
  return request({
    url: `/flowRole/delete/${roleCode}`,
    method: 'get',
    roleCode
  })
}
// 删除评价模板
export function deleteQcCode(qcCode) {
  return request({
    url: `/qcTemplate/delete/${qcCode}`,
    method: 'get',
    qcCode
  })
}
// 删除质控评价项目
export function deleteQcItem(qcItemCode) {
  return request({
    url: `/qcItem/delete/${qcItemCode}`,
    method: 'get',
    qcItemCode
  })
}
