import request from '@/utils/request'
export function systemInfo() {
  return request({
    url: '/admin/sysProp/getInfo',
    method: 'get'
  })
}
