const gisConstructor: { [key: string]: any } = {}

// 全局配置
const config: { [key: string]: any } = {
  esriInstance: {
    map2D: null, // 2D场景
    view2D: null, // MapView视图
    layers: new Map(), // 3D场景中的layers,用于在需要使用layer的地方进行检索
  }, // gis实例
  view: null,
  esriConstructors: gisConstructor, // gis构造函数
  openLocation: false, // 坐标拾取
  measurementWidget: null, // 测量组件
  isBaseYX: false, // 是否影像图
  videoMap: new Map(), // 自建视频数据
}
export function clearConfig() {
  config.esriInstance.layers.clear()
  config.activeView?.destroy()
  config.sceneView?.destroy()
  config.mapView?.destroy()
}

export default config
