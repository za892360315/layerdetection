import config from './appConfig'
import { getMainView, getModule } from './arcgisAPI'
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

// 鼠标拖拽
export function mouseDownRight(
  event: any,
  id: string,
  sTop: number,
  sRight: number
) {
  try {
    const oldX = event.pageX
    const oldY = event.pageY
    const contain: HTMLElement | any = document.getElementById(id)
    const oldTop = contain.style.top
    const oldRinght = contain.style.right
    document.onmousemove = function (e) {
      // 通过事件委托，计算移动的距离
      const left = e.pageX - oldX
      const top = e.pageY - oldY
      moveDivRight(oldTop, oldRinght, left, top, contain, sTop, sRight)
    }
    document.onmouseup = function () {
      document.onmousemove = null
      document.onmouseup = null
    }
  } catch (error) {}
}
function moveDivRight(
  oldTop: any,
  oldRinght: any,
  left: number,
  top: number,
  contain: HTMLElement | any,
  sTop: number,
  sRight: number
) {
  // if (oldTop === '' || oldRinght === '') {
  //   contain.style.top = sTop + top + 'px'
  //   contain.style.right = sRight - left + 'px'
  // } else {
  //   contain.style.top = parseInt(oldTop) + top + 'px'
  //   contain.style.right = parseInt(oldRinght) - left + 'px'
  // }
  if (oldTop === '' || oldRinght === '') {
    const newTop = sTop + top
    const newLeft = sRight - left
    if (newTop > 80 && newTop < window.innerHeight - 30) {
      contain.style.top = newTop + 'px'
    }
    if (newLeft > 0 && newLeft < window.innerWidth - 20) {
      contain.style.right = newLeft + 'px'
    }
  } else {
    const newTop = parseInt(oldTop) + top
    const newLeft = parseInt(oldRinght) - left
    if (newTop > 80 && newTop < window.innerHeight - 30) {
      contain.style.top = newTop + 'px'
    }
    if (newLeft > 0 && newLeft < window.innerWidth - 20) {
      contain.style.right = newLeft + 'px'
    }
  }
}

// 回到原点
export async function originalViewCommand() {
  const view = getMainView()
  const mapInitParam = config.mapInitParam
  const extent = {
    xmin: mapInitParam.extent2D.xMin,
    ymin: mapInitParam.extent2D.yMin,
    xmax: mapInitParam.extent2D.xMax,
    ymax: mapInitParam.extent2D.yMax,
    spatialReference: view.spatialReference
  }
  const Extent = await getModule("esri/geometry/Extent");
  if (extent) view.extent = new Extent(extent)
  view.goTo(extent, {
    duration: 1000,
  });
 
}