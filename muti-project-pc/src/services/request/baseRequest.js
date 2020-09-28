import axios from 'axios'
import { isLogin, getToken, removeToken, needLogin } from '@/utils/token'

// axios配置
function callApi (baseURL = '') {
  // 自定义配置
  const service = axios.create({
    baseURL: baseURL, // 基本路径
    timeout: 10000 // 请求超时毫秒数
  })

  // 添加请求头 config为请求的配置
  service.interceptors.request.use(config => {
    if (isLogin()) {
      const token = getToken()
      config.headers.common.Authorization = token // 获取token
    }
    console.log('====config', config)
    return config
  }, err => {
    console.error(err)// for debug
    return Promise.reject(err)
  })

  // 添加相应拦截器，用于处理需要在请求返回后的操作
  service.interceptors.response.use(res => {
    // 可在此添加对返回数据的格式化处理
    console.log('======res', res)
    return res.data
  }, err => {
    console.log('=====err', err)
    // 断网 或者 请求超时 状态
    if (!err.response) {
      // 请求超时状态
      if (err.message.includes('timeout')) {
        console.error('超时了')
        window.alert('请求超时，请检查网络是否连接正常')
      } else {
      // 可以展示断网组件
        console.error('断网了')
        window.alert('请求失败，请检查网络是否已连接')
      }
      return
    }
    // 服务器返回不是 2 开头的情况，会进入这个回调
    // 可以根据后端返回的状态码进行不同的操作
    const { response = {} } = err
    const { status, data = {} } = response
    console.log(err.response)
    switch (Number(status)) {
      // 401 未登录
      case 401:
        needLogin()
        break

      // 403 token过期
      case 403:
        window.alert('登录信息过期，请重新登录')// 弹出错误信息
        removeToken()
        needLogin()
        break

      // 404 不存在
      case 404:
        window.alert('网络请求不存在')
        break

      // 429 请求太多次数
      case 429:
        window.alert('服务繁忙，请稍后再试')
        break
    }

    // >= 500
    if (Number(status) >= 500) {
      window.alert('网络错误，请检查网络连接后重试')
    }

    const error = data.message ? data.message : err.message
    if (error.includes('timeout')) { // 超时
      window.alert('请求超时，请检查网络是否连接正常')
    } else if (error.includes('Network Error')) { // 网络错误
      window.alert('网络错误，请检查网络设置')
    } else {
      window.alert(error)
    }
    return Promise.reject(err)
  })
  return service
}

export default callApi()
