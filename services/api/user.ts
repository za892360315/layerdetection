import jwtDecode from 'jwt-decode'

import { setToken } from '@/modules/auth'
import { userAPIRequest, devAPIRequest } from '@/services/base'
// 获取公钥
export async function getPublicKey() {
  const result = await userAPIRequest
    .get('/authenticate/public-key')
    .catch((err: any) => err)
  return result
}
// 获取token
export async function getLoginToken(loginData: any) {
  const result: any = await userAPIRequest
    .post('/connect/token', loginData, {
      'Content-Type': 'application/x-www-form-urlencoded',
    })
    .catch((err) => err)
  if (result.access_token) {
    const token = result.access_token
    setToken(token)
    return token
  }
}
// 解析用户信息
export async function getUserInfo2token(token: any) {
  const jwtInfo: any = jwtDecode(token)
  return jwtInfo
}
// 获取用户信息
export async function getUserProfile(id:any) {
  const result = await devAPIRequest.get(`/xmgis/api/identity/users/${id}`)
  return result
}

// 获取用户组织机构
export async function getUserOrgsById(id: string) {
  const result = await devAPIRequest.get(
    `/xmgis/api/identity/users/${id}/organization-units`
  )
  return result
}
// 获取权限树
export async function grantTree(value: any) {
  const result = await devAPIRequest
    .get(`/xmgis/api/platform/menu-categories/grant-tree/` + value)
    .catch((err: any) => err)
  return result
}
//获取用户角色
export async function getUserRole(id: string) {
  const result = await devAPIRequest.get(`/xmgis/api/identity/users/${id}`)
  return result
}

//获取所有角色
export async function rolesAll() {
  const result = await devAPIRequest.get('/xmgis/api/identity/roles/all')
  return result
}