import request from '@/utils/request'
// 教师信息删除
export function deleteTeaInfo(id) {
  return request({
    url: `/root/tea/delete/${id}`,
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
// 课程信息删除
export function deleteCourse(id) {
  return request({
    url: `/course/delete/${id}`,
    method: 'get',
    id
  })
}
// 课件文件夹删除
export function deleteCourseware(id) {
  return request({
    url: `/courseware/delete/${id}`,
    method: 'get',
    id
  })
}
// 删除课件
export function deleteCwFile(id) {
  return request({
    url: `/file/delete/${id}`,
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
// 删除角色
export function deleteRoleCode(roleCode) {
  return request({
    url: `/flowRole/delete/${roleCode}`,
    method: 'get',
    roleCode
  })
}
