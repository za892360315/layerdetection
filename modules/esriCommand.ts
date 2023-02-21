import _ from 'lodash'
import config from './appConfig'
export function clearConfig() {
  config.esriInstance.layers.clear()
  config.activeView?.destroy()
  config.basemap2DCatalogs = [] // 清除电子地图数据
}

// 扩展面范围
export function changeExtent(extent: any) {
  const x = extent.xmax - extent.xmin
  const y = extent.ymax - extent.ymin
  extent.xmin = extent.xmin - x / 4
  extent.xmax = extent.xmax + x / 4
  extent.ymin = extent.ymin - y / 4
  extent.ymax = extent.ymax + y / 4
  return extent
}