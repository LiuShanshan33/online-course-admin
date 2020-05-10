import request from '@/utils/request'
import qs from 'qs'
// 登录接口
export function login(username, password) {
  return request({
    url: '/login',
    method: 'post',
    data: qs.stringify({
      username,
      password
    })
  })
}

export function getInfo() {
  return request({
    url: '/hello',
    method: 'get'
  })
}


// 教师信息页面
export function getTeaInfo(page) {
  return request({
    url: `/tea/query/?page=${page}`,
    method: 'get'
  })
}

// 查询教师信息
export function selectTeacher(data) {
  return request({
    url: '/tea/findteacher',
    method: 'post',
    data: qs.stringify(data)
  })
}
// 学生信息页面
export function getStuInfo(data) {
  return request({
    url: '/stu/findstudent',
    method: 'post',
    data: qs.stringify(data)
  })
}
// 公告管理页面
export function getAnnInfo(page) {
  return request({
    url: `/ann/query/?page=${page}`,
    method: 'get'
  })
}


// 护理诊断分页查询接口
export function getPage_2(data, pageIndex, pageSize) {
  return request({
    url: '/admin/busDiagnosis/getPage',
    method: 'post',
    data,
    pageIndex,
    pageSize
  })
}

// 护理任务分页查询接口
export function getPage_3(data, pageIndex, pageSize) {
  return request({
    url: '/admin/busNursingJob/getPage',
    method: 'post',
    data,
    pageIndex,
    pageSize
  })
}

// 护理任务查看
export function checkNursingTask(id) {
  return request({
    url: `/admin/busNursingJob/getById/${id}`,
    method: 'get'
  })
}

// 宣教模板查询接口
export function getPage_4(data) {
  return request({
    url: '/admin/busMissionTemplate/getPage',
    method: 'post',
    data
  })
}
// 宣教模板删除
export function delMissionTemplate(id) {
  return request({
    url: `/admin/busMissionTemplate/delete/${id}`,
    method: 'post',
    id
  })
}
// 护理等级获取护理单元字典列表
export function getDictInfo() {
  return request({
    url: '/admin/busNursingClass/getDictInfo',
    method: 'get'
  })
}
// 护理等级：根据护理等级编码和护理单元编码获取
export function getMeasureList(deptCode, code) {
  return request({
    url: `/admin/busNursingClass/getMeasureList/${deptCode}/${code}`,
    method: 'get'
  })
}
// 护理记录获取护理记录单菜单
export function getRecordMenu() {
  return request({
    url: '/admin/recordRelDept/getMenu',
    method: 'get'
  })
}

// 护理记录：获取记录关联的护理单元
export function getRecordList(recordCode) {
  return request({
    url: `/admin/recordRelDept/getList/${recordCode}`,
    method: 'post'
  })
}

// 表单关联部门获取表单关联部门菜单
export function getformMenu() {
  return request({
    url: '/admin/formRel/getMenu',
    method: 'get'
  })
}

// 表单关联部门：获取表单关联的护理单元
export function getformList(data) {
  return request({
    url: `/admin/formRel/getList/${data.type}/${data.code}`,
    method: 'post'
  })
}

// 科室信息分页查询接口
export function getPage_5(data) {
  return request({
    url: '/admin/sysDept/getPage',
    method: 'post',
    data
  })
}

// 医院信息获取医院信息接口
export function getHospital() {
  return request({
    url: '/admin/sysHospital/getHospital',
    method: 'get'
  })
}

// 床位信息分页查询接口
export function getPage_6(data) {
  return request({
    url: '/admin/sysBed/getPage',
    method: 'post',
    data
  })
}

// 员工信息分页查询接口
export function getSysUser(data) {
  return request({
    url: '/admin/sysUser/getPage',
    method: 'post',
    data
  })
}

// 通讯录分页查询接口
export function getPage_7(data) {
  return request({
    url: '/admin/msgPhoneBook/getPage',
    method: 'post',
    data
  })
}
// 消息管理分页查询接口
export function getPage_8(data) {
  return request({
    url: '/admin/msgMail/getPage',
    method: 'post',
    data
  })
}

// 字典管理：获取字典菜单
export function getdictTable() {
  return request({
    url: '/admin/sysDict/getMenu',
    method: 'get'
  })
}
// 字典管理：获取字典菜单
export function getDictItem(id) {
  return request({
    url: `/admin/sysDict/getDictItem/${id}`,
    method: 'get'
  })
}
// 字典管理：添加保存字典
export function saveDictItem(data) {
  return request({
    url: '/admin/sysDict/save',
    method: 'post',
    data
  })
}
// 字典管理：添加删除字典
export function deleteDictItem(data) {
  return request({
    url: '/admin/sysDict/delete',
    method: 'post',
    data
  })
}
// MEWS评分规则菜单列表
export function getMewsForm() {
  return request({
    url: '/admin/mewsFormCode/getList',
    method: 'get'
  })
}
// MEWS具体评分规则项目
export function getScoreRule(formCode) {
  return request({
    url: `/admin/mewsScoreRule/getRuleByFormCode/${formCode}`,
    method: 'post',
    formCode
  })
}
// 病区动态数据库配置
export function getConfigureType(configureCode) {
  return request({
    url: `/admin/boardRelationProcessConfigure/getByConfigureType/${configureCode}`,
    method: 'post',
    params: {
      configureCode
    }
  })
}
// 病区动态显示：获取护理单元所有动态配置项
export function getwhiteBoard(code) {
  return request({
    url: `/admin/whiteBoard/getByDeptCode/${code}`,
    method: 'post',
    params: {
      code
    }
  })
}
// 科室护理对照：按护理单元编号获取所有科室和病区
export function getAllDeptVsWard() {
  return request({
    url: `/admin/sysDeptVsWard/getAllDeptVsWard`,
    method: 'get'
  })
}
// 模块管理：分页查询
export function getPage_9(data) {
  return request({
    url: '/admin/sysMoudle/getPage',
    method: 'post',
    data
  })
}
// 角色管理
export function getRolePage(data) {
  return request({
    url: '/admin/sysRole/getPage',
    method: 'post',
    data
  })
}

// 任务管理
export function getPage_10(data) {
  return request({
    url: '/admin/sysTask/getPage',
    method: 'post',
    data
  })
}

// 附件管理
export function getPage_11(data) {
  return request({
    url: '/admin/sysAttachment/getPage',
    method: 'post',
    data
  })
}
// 应用授权
export function getAuthorizeInfo(data) {
  return request({
    url: '/admin/sysApp/getPage',
    method: 'post',
    data
  })
}
// 应用授权访问分页查询
export function visitAuthorizeInfo(data) {
  return request({
    url: '/admin/sysApp/getTokenPage',
    method: 'post',
    data
  })
}
// 版本管理
export function getVersion(data) {
  return request({
    url: '/admin/sysFileVersion/getPage',
    method: 'post',
    data
  })
}

// 获取病区
export function getWardList(deptCode) {
  return request({
    url: `/admin/changeShiftDeptCode/getList/${deptCode}`,
    method: 'post',
    params: {
      deptCode
    }
  })
}

// 科室护理对照：根据护理单元获取科室
export function getDeptByWardCode(code) {
  return request({
    url: `/admin/sysDeptVsWard/getDeptByWardCode/${code}`,
    method: 'post',
    params: {
      code
    }
  })
}
// 大屏交接班
export function changeShiftDeptCode(deptCode) {
  return request({
    url: `/admin/changeShiftDeptCode/getList/${deptCode}`,
    method: 'get',
    deptCode
  })
}
// 交班排序
export function changeShiftSortMode(deptCode) {
  return request({
    url: `/admin/changeShiftSortMode/getList/${deptCode}`,
    method: 'post',
    params: {
      deptCode
    }
  })
}
// Mews表单关联部门
export function getmewsFormRelDept(formCode) {
  return request({
    url: `/admin/mewsFormRelDept/getList/${formCode}`,
    method: 'post',
    formCode
  })
}
// Mews评分监护
export function getmewsScore(formCode) {
  return request({
    url: `/admin/mewsScoreProgramme/getList/${formCode}`,
    method: 'get',
    formCode
  })
}
// 获取表单列表
export function getFormList() {
  return request({
    url: '/admin/form/getList',
    method: 'get'
  })
}
// 登录日志
export function getLoginLog(data) {
  return request({
    url: '/admin/logLogin/getPage',
    method: 'post',
    data
  })
}
// 操作日志
export function getOperateLog(data) {
  return request({
    url: '/admin/logOperate/getPage',
    method: 'post',
    data
  })
}
// 任务日志
export function getTaskLog(data) {
  return request({
    url: '/admin/logTask/getPage',
    method: 'post',
    data
  })
}
export function logout() {
  return request({
    url: '/user/logout',
    method: 'post'
  })
}
// 流程节点分页查询接口
export function getProcessNode(data) {
  return request({
    url: '/flowNode/getPage',
    method: 'post',
    data
  })
}
// 流程角色分页查询接口
export function getProcessRole(data) {
  return request({
    url: '/flowRole/getPage',
    method: 'post',
    data
  })
}
// 获取所有员工职称
export function getTitleInfo() {
  return request({
    url: '/admin/sysUser/getTitleInfo',
    method: 'get'
  })
}
// 根据员工职称获取员工信息
export function getRoleInfo(title) {
  return request({
    url: `/admin/sysUser/getListByTitle/${title}`,
    method: 'get',
    title
  })
}
// 根据员工号获取员工病区
export function getRoleDept(empNo) {
  return request({
    url: `/admin/sysUser/getUserByEmpNo/${empNo}`,
    method: 'get',
    empNo
  })
}
// 流程链分页查询接口
export function getProcessChain(data) {
  return request({
    url: '/flowChain/getPage',
    method: 'post',
    data
  })
}
// 模板管理分页查询
export function getTemplateMg(data) {
  return request({
    url: '/qcTemplate/getPage',
    method: 'post',
    data
  })
}
// 获取所有质控组
export function getQcTemplateGroup() {
  return request({
    url: '/qcTemplate/getQcTemplateGroup',
    method: 'get'
  })
}
// 质控评价项目分页查询
export function getQCEPM(data) {
  return request({
    url: '/qcItem/getPage',
    method: 'post',
    data
  })
}
//  获取所有质控项目类型
export function getqcItemType() {
  return request({
    url: '/qcItemType/getList',
    method: 'get'
  })
}
// 获取所有质控模板表
export function getqcTemplate() {
  return request({
    url: '/qcTemplate/getList',
    method: 'get'
  })
}
// 根据模板编号获取项目列表
export function getTemplateVsItem(qcCode) {
  return request({
    url: `/qcTemplateVsItem/getList/${qcCode}`,
    method: 'get',
    qcCode
  })
}
// 获取角色关联用户列表
export function getListByRoleCode(roleCode) {
  return request({
    url: `/flowRoleUser/getListByRoleCode/${roleCode}`,
    method: 'get',
    roleCode
  })
}

// 根据项目编号获取项目
export function getTempItem(qcItemCode) {
  return request({
    url: `/qcItem/getItem/${qcItemCode}`,
    method: 'get',
    qcItemCode
  })
}
// 根据项目类型获取项目列表
export function getListByType(itemtype) {
  return request({
    url: `/qcItem/getListByType/${itemtype}`,
    method: 'get',
    itemtype
  })
}

// 获取科室字典编码
export function getWardDict(wardCode, dictCode) {
  return request({
    url: `/wardDict/getList/${wardCode}/${dictCode}`,
    method: 'get',
    wardCode,
    dictCode
  })
}
// 获取科室
export function getWard(data) {
  return request({
    url: `/admin/sysDeptVsWard/getPickDept`,
    method: 'post',
    data
  })
}
//  字典编码：按组获取所有字典编码
export function getAllDictCd() {
  return request({
    url: '/dictTable/getAllDictCode',
    method: 'get'
  })
}
//  字典编码：保存更新
export function saveDictCd(data) {
  return request({
    url: '/dictTable/saveOrUpdate',
    method: 'post',
    data
  })
}
// 字典编码排序： 获取字典排序
export function getDictSort(dictCode, templateCode) {
  return request({
    url: `/dictCodeOrder/getList/${dictCode}/${templateCode}`,
    method: 'get',
    dictCode,
    templateCode
  })
}
