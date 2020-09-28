
import cookie from 'component-cookie'
import axios from 'axios'

const TokenKey = 'vue-project-h5'
const maxTime = 365 * 24 * 60 * 60 * 1000

// 获取token
export function getToken () {
  let token
  token = cookie(TokenKey) ? cookie(TokenKey) : null
  try {
    if (!token) {
      const storages = localStorage[TokenKey] ? localStorage[TokenKey].split('|') : []
      const storageToken = storages[0]
      const storageTime = storages[1]
      const isEffect = storageTime ? new Date().getTime() < storageTime : false
      if (!isEffect) {
        removeToken()
      } else {
        token = storageToken
      }
    }
  } catch (err) {
  }
  return token
}

// 设置token
export function setToken (token) {
  cookie(TokenKey, token, { 'maxage': maxTime, 'path': '/' })
  try {
    localStorage[TokenKey] = `${token}|${new Date().getTime() + maxTime}`
  } catch (err) {
  }
}

// 移除token
export function removeToken () {
  cookie(TokenKey, null, { 'path': '/' })
  try {
    localStorage.removeItem(TokenKey)
  } catch (err) {
  }
}

// 是否登录
export function isLogin () {
  return !!getToken()
}

// 判断是否需要登录
export function needLogin () {
  const token = getToken()
  if (token) {
    axios.defaults.headers.common['Authorization'] = token
    return true
  } else {
    window.location.replace(`./login.html?url=${window.encodeURIComponent(window.location.href)}`)
    return false
  }
}
