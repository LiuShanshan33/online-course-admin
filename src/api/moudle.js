import request from '@/utils/request'
import qs from 'qs'

//获取所有可选模块
export function getAllOptionsMenu() {
  return request({
    url: '/admin/sysMoudle/getAllOptionsMenu',
    method: 'get'
  })
}

//获取已添加模块
export function getMoudleOptions(empNo) {
  return request({
    url: `/admin/sysMoudle/getMoudleOptions/${empNo}`,
    method: 'get'
  })
}

//保存更新已选项
export function saveMoudleOptions(data) {
  return request({
    url: '/admin/sysMoudle/saveMoudleOptions',
    method: 'post',
    data
  })
}
