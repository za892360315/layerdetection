import { getMainView, getModules } from './arcgisAPI'
import config from './appConfig'
import { layerEnum } from './appEnum'
export function getLayer(id: string) {
  return config.esriInstance.layers.get(id)
}
export function setLayer(id: string, layer: any) {
  config.esriInstance.layers.set(id, layer)
}
export function deleteLayer(id: string) {
  return config.esriInstance.layers.delete(id)
}
export function getLayerOpacity(id: string) {
  return config.esriInstance.layersOpacity.get(id)
}
export function addLayer(layer: any) {
  return config.activeView.map.add(layer)
}
export async function getLayerModule(layerType: any) {
  let module = null
  switch (layerType) {
    // MapImageLayer-0
    case layerEnum.MapImage:
      ;[module] = await getModules(['esri/layers/MapImageLayer'])
      break
    // FeatureLayer-1
    case layerEnum.Feature:
      ;[module] = await getModules(['esri/layers/FeatureLayer'])
      break
    // BuildingSceneLayer-2
    case layerEnum.BuildingScene:
      ;[module] = await getModules(['esri/layers/BuildingSceneLayer'])
      break
    // SceneLayer-3
    case layerEnum.Scene:
      ;[module] = await getModules(['esri/layers/SceneLayer'])
      break
    // ElavationLayer-4
    case layerEnum.Elevation:
      ;[module] = await getModules(['esri/layers/ElevationLayer'])
      break
    // ImageryTileLayer-5
    case layerEnum.ImageryTile:
      ;[module] = await getModules(['esri/layers/ImageryTileLayer'])
      break
    // IntegratedMeshLayer-6
    case layerEnum.IntegratedMesh:
      ;[module] = await getModules(['esri/layers/IntegratedMeshLayer'])
      break
    // TileLayer-7
    case layerEnum.Tile:
      ;[module] = await getModules(['esri/layers/TileLayer'])
      break
    // WebTileLayer-8
    case layerEnum.WebTile:
      ;[module] = await getModules(['esri/layers/WebTileLayer'])
      break
    // WMTSLayer-9
    case layerEnum.WMTS:
      ;[module] = await getModules(['esri/layers/WMTSLayer'])
      break
    // WMSLayer-10
    case layerEnum.WMS:
      ;[module] = await getModules(['esri/layers/WMSLayer'])
      break
    // ImageryLayer-11
    case layerEnum.Imagery:
      ;[module] = await getModules(['esri/layers/ImageryLayer'])
      break
    // WFSLayer-12
    case layerEnum.WFS:
      ;[module] = await getModules(['esri/layers/WFSLayer'])
      break
    default:
      ;[module] = ''
      break
  }
  return module
}
// 图层替换
export function changeLayers(arr: any) {
  const map: any = getMainView().map
  for (let i = arr.length - 1; i >= 0; i--) {
    const layer = getLayer(arr[i].id)
    map.layers.remove(layer)
    map.layers.add(layer)
  }
}
// 临时图层删除并还原正式图层透明度
export function removeLayers(arr: any) {
  const map: any = getMainView().map
  for (let i = 0; i < arr.length; i++) {
    map.layers.remove(arr[i].layer)
  }
  const items = map.layers.items
  for (let i = 0; i < items.length; i++) {
    const layer = items[i]
    const layerOpacity = getLayerOpacity(layer.id)
    if (layerOpacity) {
      layer.opacity = layerOpacity
    }
  }
}
// 图例开关
export function changeLegendVisible(data: any) {
  if (data.checked) {
    let layer = getLayer(data.nodeId.slice(0, -2))
    if (layer.opacity === 0) {
      // const layerOpacity = getLayerOpacity(data.nodeId);
      // if (layerOpacity) {
      layer.opacity = 1
      // }
    } else {
      layer = getLayer(data.nodeId.substring(0, data.nodeId.length - 2))
      if (layer) {
        const layerOpacity = getLayerOpacity(
          data.nodeId.substring(0, data.nodeId.length - 2)
        )
        if (layerOpacity) {
          layer.opacity = layerOpacity
        }
      }
    }
  } else {
    let layer = getLayer(data.nodeId.slice(0, -2))
    if (layer) {
      const layerOpacity = getLayer(data.nodeId.slice(0, -2))
      if (layerOpacity) {
        layer.opacity = 0
      }
    } else {
      layer = getLayer(data.nodeId.substring(0, data.nodeId.length - 2))
      if (layer) {
        const layerOpacity = getLayerOpacity(
          data.nodeId.substring(0, data.nodeId.length - 2)
        )
        if (layerOpacity) {
          layer.opacity = 0
        }
      }
    }
  }
}
// 图层显隐
export function ChangeLayerVisible(data: any) {
  const layer = getLayer(data.id)
  layer.visible = !layer.visible
}
// 图层透明度
export function ChangeLayerOpacity(id: string, opacity: number) {
  const layer = getLayer(id)
  layer.opacity = opacity
}
// 创建图层
export async function createLayer(data: {
  id: any
  serviceUrl: any
  formal?: any
  title: any
  type?: string
  layerType: any
  opacity: any
  spatialReference: any
  visible: any
  lods?: any
  elevationInfo?: number
  nodeId?: any
  labelEnabled?: any
  parentName?: any
  categoryId?: any
}) {
  try {
    let layer = null
    const options: any = {
      url: data.serviceUrl,
      outFields: ['*'],
      spatialReference: data.spatialReference || {
        wkid: 4490,
      },
    }
    const Layer = await getLayerModule(data.layerType)
    switch (data.layerType) {
      case layerEnum.MapImage:
        // eslint-disable-next-line no-case-declarations
        const index: any = data.serviceUrl.lastIndexOf('/')
        const id = data.serviceUrl.substring(index + 1, data.serviceUrl.length)
        if (!isNaN(parseInt(id))) {
          layer = new Layer({
            url: data.serviceUrl.substring(0, index),
            sublayers: [
              {
                id: parseInt(id),
                visible: true,
              },
            ],
          })
        } else {
          layer = new Layer({
            url: data.serviceUrl,
          })
        }
        break
      case layerEnum.Scene:
        layer = new Layer({ url: options.url })
        break
      case layerEnum.Tile:
        // options.version = 10.5;
        layer = new Layer(options)
        break
      case layerEnum.WebTile:
        // if (config.constraint) {
        // eslint-disable-next-line no-eval
        const spatialReference = data.spatialReference
        const tileInfo = {
          dpi: 90.71428571427429,
          rows: 128,
          cols: 128,
          compressionQuality: 0,
          origin: {
            x: -180,
            y: 90,
          },
          spatialReference,
          lods: data.lods || [],
        }
        layer = new Layer({
          urlTemplate: data.serviceUrl,
          tileInfo,
          spatialReference: tileInfo.spatialReference,
          fullExtent: {
            xmin: 117.88222075578335,
            ymin: 24.42248132435367,
            xmax: 118.4541662028081,
            ymax: 24.907266362752466,
            spatialReference,
          },
          getTileUrl(level: number, row: any, col: any) {
            return this.urlTemplate
              .replace('{level}', level + 1)
              .replace('{row}', row)
              .replace('{col}', col)
          },
        })
        // } else {
        //   layer = new Layer({
        //     urlTemplate: data.serviceUrl,
        //     getTileUrl(level, row, col) {
        //       return this.urlTemplate
        //         .replace("{level}", level)
        //         .replace("{row}", row)
        //         .replace("{col}", col);
        //     },
        //   });
        // }
        break
      default:
        layer = new Layer(options)
        break
    }
    layer.serverUrl = data.serviceUrl
    layer.id = data.id
    layer.nodeId = data.nodeId || ''
    layer.title = data.title
    layer.opacity = data.opacity / 100
    layer.visible = data.visible
    layer.labelsVisible = data.labelEnabled
    layer.dataType = data.layerType
    layer.parentName = data.parentName ? data.parentName : ''
    layer.categoryId = data.categoryId ? data.categoryId : ''
    return layer
  } catch (error) {
    console.log(error)
    return null
  }
}
