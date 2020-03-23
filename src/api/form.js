import request from '@/utils/request'
import qs from 'qs'

/* ------------------------------------表单管理--------------------------------*/

// 表单分页查询
export function getFormPage(data) {
  return request({
    url: '/admin/formItemSetting/getPage',
    method: 'post',
    data
  })
}

// 保存表单复评设置
export function saveReEval(data) {
  return request({
    url: '/admin/formItemSetting/saveOrUpdateReEval',
    method: 'post',
    data
  })
}

// 获取复评设置列表
export function getReEvalList(formCode, itemCode) {
  return request({
    url: `/admin/formItemSetting/getReEvalList/${formCode}/${itemCode}`,
    method: 'get'
  })
}

// 删除表单
export function deleteForm(formCode) {
  return request({
    url: `/admin/form/delete/${formCode}`,
    method: 'post'
  })
}

/* ------------------------------------表单项目管理--------------------------------*/

// 表单项目分页查询
export function getFormItemPage(data) {
  return request({
    url: '/admin/formItem/getPage',
    method: 'post',
    data
  })
}

// 保存表单项目内容设置
export function saveItemValue(data) {
  return request({
    url: '/admin/formItem/saveOrUpdateValue',
    method: 'post',
    data
  })
}

// 获取项目内容设置列表
export function getItemValueList(itemCode) {
  return request({
    url: `/admin/formItem/getItemValue/${itemCode}`,
    method: 'get'
  })
}

// 保存或更新项目基本信息
export function saveOrUpdateItem(data) {
  return request({
    url: '/admin/formItem/saveOrUpdate',
    method: 'post',
    data
  })
}

export function getItem(itemCode) {
  return request({
    url: `/formItem/getItem/${itemCode}`,
    method: 'get'
  })
}

// 删除表单项目
export function deleteItem(itemCode) {
  return request({
    url: `/admin/formItem/delete/${itemCode}`,
    method: 'post'
  })
}

// 获取表单列表
export function getItemList() {
  return request({
    url: '/admin/formItem/getList',
    method: 'get'
  })
}

// 根据项目类型获取项目列表
export function getListByType(itemType) {
  return request({
    url: `/formItem/getListByType/${itemType}`,
    method: 'get'
  })
}

/* ------------------------------------表单关联项目--------------------------------*/

// 保存表单关联项目
export function saveFormVsItem(data) {
  return request({
    url: '/admin/formItemSetting/saveOrUpdate',
    method: 'post',
    data
  })
}

// 保存表单诊断表达式
export function saveFormExp(data) {
  return request({
    url: '/admin/form/saveOrUpdateExp',
    method: 'post',
    data
  })
}

// 获取表单项目关联列表
export function getFormItemList(formCode) {
  return request({
    url: `/admin/formItemSetting/getListByFormCode/${formCode}`,
    method: 'get'
  })
}

// 获取表单诊断表达式列表
export function getDiagsExpList(formCode) {
  return request({
    url: `/admin/form/getDiagsExpList/${formCode}`,
    method: 'get'
  })
}

// 获取表单列表
export function getFormList() {
  return request({
    url: '/admin/form/getList',
    method: 'get'
  })
}

export const TypeOptions = [
  { key: 'I', value: '评估项目' },
  { key: 'M', value: '措施项目' },
  { key: 'C', value: '公共项目' },
  { key: 'K', value: '扩展字段' },
  { key: 'S', value: '存放分数' },
  { key: 'E', value: '其他评估单ID项目' }
]


