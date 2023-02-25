import _ from 'lodash'
import config from './appConfig'
import { getMainView } from './arcgisAPI'
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

// 默认底图范围截图
export function defaultScreenshot(callbackOk: any, callbackCancel: any) {
  const view = getMainView();
  const area = {
    x: 0,
    y: 0,
    width: view.width,
    height: view.height,
  };
  try {
    if (area.width > 0 && area.height > 0) {
      view
        .takeScreenshot({ area, format: "png" })
        .then(function (screenshot: any) {
          const shotScreenObject = {
            width: area.width,
            height: area.height,
            imgUrl: screenshot.dataUrl,
          };
          callbackOk(shotScreenObject);
        });
    }
  } catch (ex) {
    callbackCancel();
    console.log(ex);
  }
}