import { devAPIRequest } from '@/services/base'

// 获取全部图层列表
export async function getLayersListByTableName(name: any, params: any) {
  const result: any = await devAPIRequest.post(
    '/xmgis/api/dynamicform/v2/collection/' + name,
    params
  )
  return result
}

// 获取指定模板类型
export async function getVformData(name: any) {
  const result: any = await devAPIRequest.get(
    '/xmgis/api/dynamicform/v2/form-template/' + name
  )
  return result
}
// 获取指定模板类型
export async function getFormTree() {
  const result: any = await devAPIRequest.get(
    '/xmgis/api/dynamicform/form-categories/grant-tree-by-id/6eaf5e74-3a31-2513-14a9-3a091e32dd17?withForm=true' 
  )
  return result
}
