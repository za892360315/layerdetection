import { devAPIRequest, addressRequest } from '@/services/base'
export const api: any = {
  formDataUrl: '/xmgis/api/dynamicform/v2/form-template/',
  appointFormDataUrl: '/xmgis/api/dynamicform/form-template',
  collection2: `/xmgis/api/dynamicform/v2/collection`, // 动态表单v2 正式环境（82 73）
  addressUrl: `/get_single_address`,
  addressLikeUrl: `/get_likely_address`,
  addressStreetUrl: `/get_nearest_address_plus`,
}
// 获取指定模板类型
export async function getVformData(name: any) {
  const result: any = await devAPIRequest.get(api.formDataUrl + name)
  return result
}

// 获取全部模板列表
export async function getVformDataAppoint(data: any) {
  const result: any = await devAPIRequest.get(api.appointFormDataUrl, data)
  return result
}
//   向目标表单集合添加数据/xmgis/api/dynamicform/v2/collection/{tableName}/{dataId}
export async function addCollection(data: any, name: any) {
  const result: any = await devAPIRequest.post(
    `${api.collection2}?tableName=${name}`,
    data
  )
  return result
}

//   向目标表单集合添加数据
export async function updateCollection(name: any, ids: any, data: any) {
  const result: any = await devAPIRequest.put(
    `${api.collection2}/${name}/${ids}`,
    data
  )
  return result
}
//   专题-地址搜索（精确查询）
export async function getAddressData(data: any) {
  const result: any = await addressRequest.post(`${api.addressUrl}`, data)
  return result
}
//   专题-地址搜索（精确模糊）
export async function getAddressOnLike(data: any) {
  const result: any = await addressRequest.post(`${api.addressLikeUrl}`, data)
  return result
}
//   专题-获取最近地址
export async function getNearestAddress(data: any) {
  const result: any = await addressRequest.post(`${api.addressStreetUrl}`, data)
  return result
}
// 根据id删除集合中的指定数据
export async function deleteStatConfigs(name: any, ids: any) {
  const result: any = await devAPIRequest.request({
    url: api.collection2 + `/db-delete/${name}`,
    method: 'delete',
    data: [ids],
  })
  return result
}
