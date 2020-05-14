import request from '@/utils/request'
import qs from 'qs'
// tphone,tcampus,tid,tname,tsex,positon,tcollege
// 添加教师信息
export function addTeaInfo(tname, tsex, tid, tphone, tcampus, tcollege, positon) {
  return request({
    url: '/tea/add',
    method: 'post',
    data: qs.stringify({ tname, tsex, tid, tphone, tcampus, tcollege, positon })
  })
}

// 修改教师信息
export function updateTeaInfo(id, tname, tsex, tid, tphone, tcampus, tcollege, positon) {
  return request({
    url: '/tea/update',
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
// 医院信息：保存接口
export function saveHospital(data) {
  return request({
    url: '/admin/sysHospital/save',
    method: 'post',
    data
  })
}

// 科室信息：保存接口
export function saveDeptInfo(data) {
  return request({
    url: '/admin/sysDept/save',
    method: 'post',
    data
  })
}

// 床位信息：保存接口
export function saveBedInfo(data) {
  return request({
    url: '/admin/sysBed/save',
    method: 'post',
    data
  })
}

// 员工信息：保存接口
export function saveUser(data) {
  return request({
    url: '/admin/sysUser/save',
    method: 'post',
    data
  })
}

// 通讯录：保存接口
export function saveAddrBook(data) {
  return request({
    url: '/admin/msgPhoneBook/save',
    method: 'post',
    data
  })
}

// 消息管理：查看邮件
export function getMsgMail(id) {
  return request({
    url: `/admin/msgMail/getMailById/${id}`,
    method: 'post',
    id
  })
}
// 监护方案：保存添加的监护方案
export function savemewsTutelage(data) {
  return request({
    url: `/admin/mewsScoreProgramme/save`,
    method: 'post',
    data
  })
}
// 大屏交接班科室：保存
export function savechangeShift(data) {
  return request({
    url: `/admin/changeShiftDeptCode/save`,
    method: 'post',
    data
  })
}
//  病区动态数据库：保存患者流转和医嘱项目
export function saveWardDatabase(data) {
  return request({
    url: `/admin/boardRelationProcessConfigure/save`,
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

// 流程链管理：获取的流程链
export function checkChainList(chainCode) {
  return request({
    url: `/flowChain/getChain/${chainCode}`,
    method: 'get'
  })
}

// 根据角色编码获取
export function getRoleByCode(roleCode) {
  return request({
    url: `/flowRole/getByCode/${roleCode}`,
    method: 'get'
  })
}

// 获取所有角色
export function getAllRole() {
  return request({
    url: '/flowRole/getList',
    method: 'get'
  })
}
// 获取拥有查看APP管理权限的角色
export function getAppManage() {
  return request({
    url: '/flowRole/getList',
    method: 'get'
  })
}
// 流程链管理的保存：流程链关联节点和角色用户
export function updateChainList(data) {
  return request({
    url: '/flowChain/saveOrUpdateAll',
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

// 获取所有节点
export function getAllNode() {
  return request({
    url: '/flowNode/getList',
    method: 'get'
  })
}
// 保存流程节点
export function saveProcessNode(data) {
  return request({
    url: '/flowNode/saveOrUpdate',
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
