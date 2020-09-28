import request from '@/services/request'

export function _login (data) {
  return request({
    method: 'post',
    url: '/login/data',
    data
  })
}
