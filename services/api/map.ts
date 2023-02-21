import { devAPIRequest } from '@/services/base'
import config from '~/modules/appConfig';

const win: any = window

export const api: any = {
  RouteXmgisPlatformSettingPrefix: '/xmgis/api/platform'
}
// 获取地图参数
export async function getMaps() {
  const result: any = await devAPIRequest.get(
    api.RouteXmgisPlatformSettingPrefix + '/maps/by-name/' + win.mapName
  )
  config.mapInitParam = result;
  return result
}
// 获取2d地图参数
export async function get2dMapCatalog(id: string) {
  const result: any = await devAPIRequest.get(
    api.RouteXmgisPlatformSettingPrefix + '/base2dmap-categories/tree-by-id/' + id
  )
  return result
}
// 获取3d地图参数
export async function get3dMapCatalog(id: string) {
  const result: any = await devAPIRequest.get(
    api.RouteXmgisPlatformSettingPrefix + '/base3dmap-categories/tree-by-id/' + id
  )
  return result
}
// 获取图层目录树
export async function getLayerCategoriesTree(id: string) {
  const result = await devAPIRequest.get(`/xmgis/api/platform/layer-categories/grant-tree-by-id/${id}`)
  return result
}
