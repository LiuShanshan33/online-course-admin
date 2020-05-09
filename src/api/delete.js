import request from '@/utils/request'
// 教师信息删除
export function deleteTeaInfo(id) {
  return request({
    url: `/tea/delete/${id}`,
    method: 'get',
    id
  })
}
// 学生信息删除
export function deleteStuInfo(id) {
  return request({
    url: `/stu/delete/${id}`,
    method: 'get',
    id
  })
}
// 公告删除
export function deleteAnnInfo(id) {
  return request({
    url: `/ann/delete/${id}`,
    method: 'get',
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
