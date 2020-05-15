import request from '@/utils/request'
import qs from 'qs'
// tphone,tcampus,tid,tname,tsex,positon,tcollege
// 添加教师信息
export function addTeaInfo(tname, tsex, tid, tphone, tcampus, tcollege, positon) {
  return request({
    url: '/root/tea/add',
    method: 'post',
    data: qs.stringify({ tname, tsex, tid, tphone, tcampus, tcollege, positon })
  })
}

// 修改教师信息
export function updateTeaInfo(id, tname, tsex, tid, tphone, tcampus, tcollege, positon) {
  return request({
    url: '/root/tea/update',
    method: 'post',
    data: qs.stringify({ id, tname, tsex, tid, tphone, tcampus, tcollege, positon })
  })
}
// 添加学生信息
export function addStuInfo(scollege, sid, scampus, grade, major, sphone, sname, ssex) {
  return request({
    url: '/stu/add',
    method: 'post',
    data: qs.stringify({ scollege, sid, scampus, grade, major, sphone, sname, ssex })
  })
}
// 修改学生信息
export function updateStuInfo(id, scollege, sid, scampus, grade, major, sphone, sname, ssex) {
  return request({
    url: '/stu/update',
    method: 'post',
    data: qs.stringify({ id, scollege, sid, scampus, grade, major, sphone, sname, ssex })
  })
}
// 添加课程
export function addCourseInfo(coursename, introduction, type, principal, subject) {
  return request({
    url: '/course/add',
    method: 'post',
    data: qs.stringify({ coursename, introduction, type, principal, subject })
  })
}

// 修改课件文件夹信息
export function updateCourseware(id, cwname, cwtype, cwintroduction,courseid ) {
  return request({
    url: '/courseware/save',
    method: 'post',
    data: qs.stringify({id, cwname, cwtype, cwintroduction,courseid})
  })
}

// 添加课程文件夹下文件
export function addCwFile(data) {
  return request({
    url: '/file/save',
    method: 'post',
    data
  })
}
// 添加公告
export function addAnnInfo(content, title) {
  return request({
    url: '/ann/add',
    method: 'post',
    data: qs.stringify({ content, title })
  })
}
// 修改公告
export function updateAnnInfo(id, content, title) {
  return request({
    url: '/ann/add',
    method: 'post',
    data: qs.stringify({ id, content, title })
  })
}
// 修改密码
export function updatePwd(password) {
  return request({
    url: '/modify',
    method: 'post',
    data: qs.stringify({ password })
  })
}
// 管理员修改用户角色和密码
export function updateRolePwd(username, password, role) {
  return request({
    url: '/root/modify',
    method: 'post',
    data: qs.stringify({ username, password, role })
  })
}
// 新建管理员
export function addRole(username, password, role) {
  return request({
    url: '/root/register',
    method: 'post',
    data: qs.stringify({ username, password, role })
  })
}
// 医院信息：保存接口
export function saveHospital(data) {
  return request({
    url: '/admin/sysHospital/save',
    method: 'post',
    data
  })
}


// 模块管理：保存或修改
export function saveMoudle(data) {
  return request({
    url: '/admin/sysMoudle/save',
    method: 'post',
    data
  })
}
// 模块管理：选择父模块
export function ModuleSelect() {
  return request({
    url: '/admin/sysMoudle/getParentMoudle',
    method: 'get'
  })
}

// 模块管理：获取所有是菜单的模块
export function getAllMenu() {
  return request({
    url: '/admin/sysMoudle/getAllMenu',
    method: 'get'
  })
}
// 角色管理：获取所有模块
export function AllModuleSelect() {
  return request({
    url: '/admin/sysMoudle/getAllMoudle',
    method: 'get'
  })
}
// 角色管理：保存或修改
export function saveRole(data) {
  return request({
    url: '/admin/sysRole/save',
    method: 'post',
    data
  })
}
// 任务管理：添加/修改任务
export function saveTask(data) {
  return request({
    url: '/admin/sysTask/save',
    method: 'post',
    data
  })
}

// 应用授权：保存或修改
export function saveAppAuthorization(data) {
  return request({
    url: '/admin/sysApp/save',
    method: 'post',
    data
  })
}

// 版本管理：添加文件
export function saveVersion(data) {
  return request({
    url: '/admin/sysFileVersion/save',
    method: 'post',
    data
  })
}

// MEWS表单关联保存
export function saveMewsFormRelDept(data) {
  return request({
    url: '/admin/mewsFormRelDept/save',
    method: 'post',
    data
  })
}
// 病区动态显示：保存白板动态项
export function savewhiteBoard(data) {
  return request({
    url: '/admin/whiteBoard/save',
    method: 'post',
    data
  })
}
// 交接班保存
export function saveShiftSortMode(data) {
  return request({
    url: '/admin/changeShiftSortMode/save',
    method: 'post',
    data
  })
}


// 质控：修改角色
export function getListByRoleCode(roleCode) {
  return request({
    url: `/flowRoleUser/getListByRoleCode/${roleCode}`,
    method: 'get',
    roleCode
  })
}

// 流程角色保存
export function saveProcessRole(data) {
  return request({
    url: `/flowRoleUser/saveOrUpdate`,
    method: 'post',
    data
  })
}
// 保存模板管理
export function saveqcTemplate(data) {
  return request({
    url: '/qcTemplate/saveOrUpdate',
    method: 'post',
    data
  })
}
// 保存质控评价项目
export function saveqcItem(data) {
  return request({
    url: '/qcItem/saveOrUpdate',
    method: 'post',
    data
  })
}
// 保存/更新全部模板关联的项目
export function saveTemplateVsItem(data) {
  return request({
    url: '/qcTemplateVsItem/saveOrUpdateAll',
    method: 'post',
    data
  })
}

// 科室字典：保存或更新整个字典项目
export function saveOrUpdateAllByWard(data) {
  return request({
    url: '/wardDict/saveOrUpdateAllByWard',
    method: 'post',
    data
  })
}

// 模板字典编码排序：保存更新
export function saveOrUpdateDictSort(data) {
  return request({
    url: '/dictCodeOrder/saveOrUpdate',
    method: 'post',
    data
  })
}
