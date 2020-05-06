import request from '@/utils/request'
// 系统信息
export function systemInfo() {
  return request({
    url: '/admin/sysProp/getInfo',
    method: 'get'
  })
}
