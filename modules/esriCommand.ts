import _ from 'lodash'
import config from './appConfig'
export function clearConfig() {
  config.esriInstance.layers.clear()
  config.activeView?.destroy()
  config.basemap2DCatalogs = [] // 清除电子地图数据
}

