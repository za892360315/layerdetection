import { getFormTree } from '@/services/api/common'
const TokenKey = 'Abp.AuthToken'
export function getToken() {
  const win: any = window
  const token = win.sessionStorage.getItem(TokenKey)
  if (token !== TokenKey) {
    return token
  } else return null
}
export function setToken(token: any) {
  if (token && token !== TokenKey) {
    window.sessionStorage.setItem(TokenKey, token)
  }
}

export function clearToken() {
  window.sessionStorage.clear()
}
export function auth() {
  const token = getToken()
  if (!token) {
    clearToken()
    window.location.replace('/')
  }
}
export function getUserId() {
  const userId: any = window.sessionStorage.getItem('userId')
  return userId
}
export function setUserId(value: any) {
  window.sessionStorage.setItem('userId', value)
}
export function getUserInfo() {
  const userInfo: any = window.sessionStorage.getItem('userInfo')
  if (userInfo) {
    const userInfoObj = JSON.parse(userInfo)
    if (userInfoObj) {
      return userInfoObj
    } else return {}
  } else return {}
}
export function setUserInfo(value: any) {
  const info = JSON.stringify(value)
  window.sessionStorage.setItem('userInfo', info)
}
// 获取组织id
export function getuserOrgs() {
  const orgsInfo: any = window.sessionStorage.getItem('userOrgs')
  if (orgsInfo) {
    const userOrgs = JSON.parse(orgsInfo)
    if (userOrgs.items) {
      return userOrgs.items
    }
  }
}
// 获取组织id
export function setuserOrgs(value: any) {
  window.sessionStorage.setItem('userOrgs', value)
}
// 存储目录树
export function setMenus(menu: any) {
  window.sessionStorage.setItem('AuthTokeMenus', menu)
}
export function getMenus() {
  const userInfo: any = sessionStorage.getItem('AuthTokeMenus')
  return userInfo
}

// 存储权限树
export async function setFormTree() {
  let res = await getFormTree()
  window.sessionStorage.setItem('FormTree', res)
}
