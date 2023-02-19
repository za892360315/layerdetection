const layerEnum = {
  MapImage: 0, // 动态图层-0
  Feature: 1, // 要素图层-1
  BuildingScene: 2, // BIM-2
  Scene: 3, // 场景图层-3
  Elevation: 4, // 高程图层-4
  ImageryTile: 5, // 图像切片图层-5
  IntegratedMesh: 6, // 倾斜摄影-6
  Tile: 7, // 瓦片图层-7
  WebTile: 8, // 网络瓦片图层-8
  WMTS: 9, // WMTS图层-9
  WMS: 10, // WMS图层-10
  Imagery: 11, // 图像动态图层-11
  WFS: 12 // WFS图层-12
}
const layerType = {
  MapImageLayer: 0, // 动态图层
  FeatureLayer: 1, // 要素图层
  BuildingSceneLayer: 2, // BIM
  SceneLayer: 3, // 场景图层
  ElavationLayer: 4, // 高程图层
  ImageryTileLayer: 5, // 图像切片图层
  IntegratedMeshLayer: 6, // 倾斜摄影
  TileLayer: 7, // 瓦片图层
  WebTileLayer: 8, // 网络瓦片图层
  WMTSLayer: 9, // WMTS图层
  WMSLayer: 10, // WMS图层
  ImageryLayer: 11, // 图像动态图层
  WFSLayer: 12 // WFS图层
}
const MouseButton = {
  Left: 0, // 左键
  Middle: 1, // 中键
  Right: 2 // 右键
}
const MenuTool = {
  None: 0, // 无
  Slice: 1, // 剖切工具
  Area3D: 2, // 面积测算3D
  Distance3D: 3, // 距离测算3D
  PickLocation: 4, // 坐标拾取
  PickAttribute: 5, // 属性拾取
  Legend: 6, // 图例
  Layers: 7, // 图层顺序
  Files: 8, // 加载本地文件
  Special: 10, // 专题收藏
  Weather: 11, // 天气特效
  Label: 12, // 标绘注记
  LocationSurfaceAndPoint: 13, // 坐标定位点和面
  EditModel: 15, // 模型加载编辑
  ShotScreen: 16, // 全屏截图
  detection: 18,
  ViewshedAnalysis: 17, //
  projectQuery: 19, // 范围扫描项目地块
  Address: 20,
  OutputLayout: 21, // 出图
  Analysis: 22, // 叠加分析
  MaxTool: 999
}
export { layerEnum, layerType, MouseButton, MenuTool }
