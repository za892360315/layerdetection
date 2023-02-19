import _ from 'lodash'
import config from './appConfig'
import { getMainView, getModules } from './arcgisAPI'

import { getLayer, setLayer } from './esriLayer'
import { getLayersListByTableName } from '~/services/api/common'

const street1 = require('@/assets/images/map/zhanshi.png')
const street2 = require('@/assets/images/map/dingwei.png')
const street3 = require('@/assets/images/map/biaoji.png')
const blueimg = require('@/assets/images/block.png') // 背景图片地址

let ponintGraphic: any = []
let point: any = []
const polylineGraphic: any = []
const graphicPoint: any = []
const graphicPolygon: any = []
const focusName: string = '【空间采集系统】巡查重点'
const routeName: string = '【空间采集系统】巡查路线'
const scopeName: string = '【空间采集系统】管辖范围'
const defautALL: any = {}
// const params: any = {
//     MaxResultCount: 999,
//   skipCount: 0,
//   sorting: 'string',
// }
const maxCount: any = 999
const skipCount: any = 0
const sorting: any = 'string'
const symbol: any = {
  type: 'picture-marker',
  width: '',
  height: '40px',
  xoffset: 3,
  yoffset: 24,
  url: blueimg,
}
const textSymbol: any = {
  type: 'text',
  color: '#333',
  xoffset: 3,
  yoffset: 20,
  text: '',
  font: {
    family: 'Arial Unicode MS',
    size: 12,
    weight: 'normal',
  },
}
export function clearConfig() {
  config.esriInstance.layers.clear()
  config.activeView?.destroy()
  config.basemap2DCatalogs = [] // 清除电子地图数据
}

//  创建图层 点
export const createPointLayers = async (maxResultCount = maxCount, allQuery = defautALL) => {
  const AllQuery = _.cloneDeep(allQuery)
  AllQuery.maxResultCount = 999
  AllQuery.skipCount = 0
  const res = await getLayersListByTableName(focusName, AllQuery)
  let graphicPoint: any = []
  const view = await getMainView()
  const layer1 = getLayer('Layer-points')
  const [GraphicsLayer] = await getModules(['esri/layers/GraphicsLayer'])
  // graphicPoint = await highLightPointAll(res.items)
  graphicPoint && createPointTitle(graphicPoint) // 创建名称图层

  if (layer1) {
    layer1.graphics = []
    layer1.graphics.addMany(graphicPoint)
  } else {
    const layer = new GraphicsLayer()
    layer.visible = false
    layer.graphics.addMany(graphicPoint)
    setLayer('Layer-points', layer)
    view.map.add(layer)
  }
  AllQuery.maxResultCount = maxResultCount
  return res
}
//  创建图层 点名称
export const createPointTitle = async (graphicPoint: any) => {
  let graphicPointTit: any = []
  const view = await getMainView()
  const layer = getLayer('Layer-points-title')
  const [GraphicsLayer] = await getModules(['esri/layers/GraphicsLayer'])
  // graphicPointTit = await highLightPointTitle(graphicPoint) // 创建名称图层
  if (layer) {
    layer.graphics = []
    layer.graphics.addMany(graphicPointTit)
  } else {
    const layer = new GraphicsLayer()
    layer.visible = false
    layer.graphics.addMany(graphicPointTit)
    setLayer('Layer-points-title', layer)
    view.map.add(layer)
  }
}
// 创建图层  线
export const createLineLayers = async (maxResultCount = maxCount, allQuery = defautALL) => {
  const AllQuery = _.cloneDeep(allQuery)
  AllQuery.maxResultCount = 999
  AllQuery.skipCount = 0
  const res = await getLayersListByTableName(routeName, AllQuery)
  let graphicLines: any = []
  const view = await getMainView()
  const layer2 = getLayer('Layer-lines')
  const [GraphicsLayer] = await getModules(['esri/layers/GraphicsLayer'])
  // graphicLines = await highLightGraphicAll(res.items)
  graphicLines && createLinesTitle(graphicLines) // 创建名称图层
  const points: any = []
  res.items.forEach((cur: any) => {
    points.push(
      ...cur.overlay.coordinates.map((ele: any) => {
        const point: any = {
          overlay: { coordinates: [...ele] },
          parentsAttr: cur,
        }
        return point
      })
    )
  })
  // const graphicPoints = await highLightPointAll(points)
  if (layer2) {
    layer2.graphics = []
    layer2.graphics.addMany(graphicLines)
    // layer2.graphics.addMany(graphicPoints)
  } else {
    const layer = new GraphicsLayer()
    layer.visible = false
    layer.graphics.addMany(graphicLines)
    // layer.graphics.addMany(graphicPoints)
    setLayer('Layer-lines', layer)
    view.map.add(layer)
  }
  AllQuery.maxResultCount = maxResultCount
  return res
}
//  创建图层 线名称
export const createLinesTitle = async (graphicLines: any) => {
  let graphicPointTit: any = []
  const view = await getMainView()
  const layer = getLayer('Layer-lines-title')
  const [GraphicsLayer] = await getModules(['esri/layers/GraphicsLayer'])
  // graphicPointTit = await highLightLinesTitle(graphicLines)
  if (layer) {
    layer.graphics = []
    layer.graphics.addMany(graphicPointTit)
  } else {
    const layer = new GraphicsLayer()
    layer.visible = false
    layer.graphics.addMany(graphicPointTit)
    setLayer('Layer-lines-title', layer)
    view.map.add(layer)
  }
}
// 创建图层 面
export const createPolygonLayers = async (maxResultCount = maxCount, allQuery = defautALL) => {
  const AllQuery = _.cloneDeep(allQuery)
  AllQuery.maxResultCount = 999
  AllQuery.skipCount = 0
  const res = await getLayersListByTableName(scopeName, AllQuery)
  let graphicPolygon: any = []
  const view = await getMainView()
  const layer3 = getLayer('Layer-Polygons')
  const [GraphicsLayer] = await getModules(['esri/layers/GraphicsLayer'])
  // graphicPolygon = await highLightLandAll(res.items)
  graphicPolygon && createPolygonTitle(graphicPolygon)
  const points: any = []
  res.items.forEach((cur: any) => {
    cur.overlay.coordinates.forEach((ele: any) => {
      points.push(
        ...ele.map((e: any) => {
          const point: any = {
            overlay: { coordinates: [...e] },
            parentsAttr: cur,
          }
          return point
        })
      )
    })
  })
  // const graphicPoints = await highLightPointAll(points)
  if (layer3) {
    layer3.graphics = []
    layer3.graphics.addMany(graphicPolygon)
    // layer3.graphics.addMany(graphicPoints)
  } else {
    const layer = new GraphicsLayer()
    layer.visible = false
    layer.graphics.addMany(graphicPolygon)
    // layer.graphics.addMany(graphicPoints)
    setLayer('Layer-Polygons', layer)
    view.map.add(layer)
  }
  AllQuery.maxResultCount = maxResultCount
  return res
}
//  创建图层 面名称
export const createPolygonTitle = async (graphicPolygon: any) => {
  let graphicPolygonTit: any = []
  const view = await getMainView()
  const layer = getLayer('Layer-Polygon-title')
  const [GraphicsLayer] = await getModules(['esri/layers/GraphicsLayer'])
  // graphicPolygonTit = await highLightPolygonTitle(graphicPolygon)
  if (layer) {
    layer.graphics = []
    layer.graphics.addMany(graphicPolygonTit)
  } else {
    const layer = new GraphicsLayer()
    layer.visible = false
    layer.graphics.addMany(graphicPolygonTit)
    setLayer('Layer-Polygon-title', layer)
    view.map.add(layer)
  }
}
// 点位高亮展示
export const highLightPoint = async (x: any, y: any, bcgImg = street2) => {
  if (config.activeView) {
    const view = await getMainView()
    const [Point, Graphic] = await getModules([
      'esri/geometry/Point',
      'esri/Graphic',
    ])
    const markerSymbol = {
      type: 'picture-marker',
      color: [255, 51, 51],
      outline: {
        color: [255, 255, 255],
        width: 1,
      },
      width: '16px',
      height: '22px',
      url: bcgImg,
    }
    point = new Point({
      x,
      y,
      spatialReference: view.spatialReference,
    })
    ponintGraphic = new Graphic({
      geometry: point,
      symbol: markerSymbol,
    })
    return ponintGraphic
  }
}

// 线高亮展示
export async function highLightLine(event: any, temp: Boolean = false) {
  const view = await getMainView()
  const [Graphic] = await getModules(['esri/Graphic'])
  const graphicLine = new Graphic({
    geometry: {
      type: 'polyline',
      paths: event,
      spatialReference: view.spatialReference,
    },
    symbol: {
      type: 'simple-line', // autocasts as new SimpleFillSymbol
      style: 'short-dash',
      color: [255, 60, 60],
      width: 1,
      cap: 'round',
      join: 'round',
    },
  })
  return graphicLine
}

// 线长度计算需实例化中改坐标系
export async function lineCalculation(event: any) {
  const view = await getMainView()
  const [Graphic] = await getModules(['esri/Graphic'])
  const graphicLine = new Graphic({
    geometry: {
      type: 'polyline',
      paths: event,
      spatialReference: {
        wkid: 4326,
      },
    },
    symbol: {
      type: 'simple-line', // autocasts as new SimpleFillSymbol
      color: [0, 83, 204],
      width: 2,
      cap: 'round',
      join: 'round',
    },
  })
  return graphicLine
}

// 线高亮展示批量
export async function highLightGraphic(event: any) {
  let graphicLine: any = []
  //   const graphicLineArr: any = []
  const view = await getMainView()
  const [Graphic] = await getModules(['esri/Graphic'])
  graphicLine = new Graphic({
    geometry: {
      type: 'polyline',
      paths: event,
      spatialReference: view.spatialReference,
    },
    symbol: {
      type: 'simple-line', // autocasts as new SimpleFillSymbol
      color: [102, 153, 255],
      width: 2,
      cap: 'round',
      join: 'round',
    },
  })
  return graphicLine
}

// 面高亮展示
export const highLightLand = async (res: any, temp: Boolean = false,bcgColor = [255,60,60]) => {
  const layer = getLayer('temp-layer')
  layer && layer.graphics.removeAll()
  res = JSON.parse(JSON.stringify(res))
  for (const point of res) {
    const graphic = await highLightPoint(point[0], point[1])
    add2TempLayer(graphic)
  }
  let polylineGraphic = null
  try {
    const [Polygon] = await getModules(['esri/geometry/Polygon'])
    const view = await getMainView()
    const fillSymbol = {
      type: 'simple-fill',
      color: [...bcgColor, 0.3],
      outline: {
        color: [...bcgColor],
        width: 1,
        style: 'short-dash',
      },
    }
    const polygon = new Polygon({
      type: 'Polygon',
      rings: res,
      spatialReference: view.spatialReference,
    })
    const [Graphic] = await getModules(['esri/Graphic'])
    polylineGraphic = new Graphic({
      geometry: polygon,
      symbol: fillSymbol,
    })
  } catch (error) {
    console.log(error)
  }
  return polylineGraphic
}
// 面高亮展示(面积计算需要)
export const createGraphicPolygon = async (res: any) => {
  const view = await getMainView()
  view.graphics.removeAll()
  let polylineGraphic = null
  try {
    const [Polygon] = await getModules(['esri/geometry/Polygon'])
    const fillSymbol = {
      type: 'simple-fill',
      color: [0, 83, 204, 0.4],
      outline: {
        color: [0, 255, 248],
        width: 2,
      },
    }
    const polygon = new Polygon({
      type: 'Polygon',
      rings: res,
      spatialReference: {
        wkid: 4326,
      },
    })
    const [Graphic] = await getModules(['esri/Graphic'])
    polylineGraphic = new Graphic({
      geometry: polygon,
      symbol: fillSymbol,
    })
  } catch (error) {
    console.log(error)
  }
  return polylineGraphic
}
// // 线名称高亮展示
export const highLightPolygonTitle = async (event: any, fieldName: string) => {
  let graphicBcg: any = []
  let graphicTit: any = []
  let point: any = []
  const ponintGraphicTit: any = []
  const view = await getMainView()
  const [Point, Graphic] = await getModules([
    'esri/geometry/Point',
    'esri/Graphic',
  ])
  event.forEach((item: any) => {
    const text: string = item.attributes && item.attributes[fieldName]
    symbol.width = text ? `${text.length * 20}px` : '16px'
    textSymbol.text = text

    point = new Point({
      x: item.geometry.extent.center.x,
      y: item.geometry.extent.center.y,
      spatialReference: view.spatialReference,
    })
    graphicBcg = new Graphic({
      geometry: point,
      symbol,
    })
    graphicTit = new Graphic({
      geometry: point,
      symbol: textSymbol,
    })
    ponintGraphicTit.push(graphicBcg)
    ponintGraphicTit.push(graphicTit)
  })
  return ponintGraphicTit
}
// // 线名称高亮展示
export const highLightLinesTitle = async (event: any, fieldName: string) => {
  let graphicBcg: any = []
  let graphicTit: any = []
  let point: any = []
  const ponintGraphicTit: any = []
  const view = await getMainView()
  const [Point, Graphic] = await getModules([
    'esri/geometry/Point',
    'esri/Graphic',
  ])
  event.forEach((item: any) => {
    const text: string = item.attributes && item.attributes[fieldName]
    symbol.width = text ? `${text.length * 20}px` : '16px'
    textSymbol.text = text

    point = new Point({
      x: item.attributes.overlay.coordinates[0][0],
      y: item.attributes.overlay.coordinates[0][1],
      spatialReference: view.spatialReference,
    })
    graphicBcg = new Graphic({
      geometry: point,
      symbol,
    })
    graphicTit = new Graphic({
      geometry: point,
      symbol: textSymbol,
    })
    ponintGraphicTit.push(graphicBcg)
    ponintGraphicTit.push(graphicTit)
  })
  return ponintGraphicTit
}
// // 点位名称高亮展示
export const highLightPointTitle = async (event: any, fieldName: string) => {
  let graphicBcg: any = []
  let graphicTit: any = []
  let point: any = []
  const ponintGraphicTit: any = []
  const view = await getMainView()
  const [Point, Graphic] = await getModules([
    'esri/geometry/Point',
    'esri/Graphic',
  ])
  event.forEach((item: any) => {
    const text: string = item.attributes && item.attributes[fieldName]
    symbol.width = text ? `${text.length * 20}px` : '16px'
    textSymbol.text = text

    point = new Point({
      x: item.attributes.overlay.coordinates[0],
      y: item.attributes.overlay.coordinates[1],
      spatialReference: view.spatialReference,
    })
    graphicBcg = new Graphic({
      geometry: point,
      symbol,
    })
    graphicTit = new Graphic({
      geometry: point,
      symbol: textSymbol,
    })
    ponintGraphicTit.push(graphicBcg)
    ponintGraphicTit.push(graphicTit)
  })
  return ponintGraphicTit
}
// // 点位高亮展示
export const highLightPointAll = async (
  id: any,
  event: any,
  highLight: boolean = false
) => {
  let markerSymbol = {
    type: 'picture-marker',
    color: [255, 51, 51],
    outline: {
      color: [255, 255, 255],
      width: 1,
    },
    width: '16px',
    height: '22px',
    url: !highLight ? street3 : street1,
  }
  let forms = JSON.parse(sessionStorage.getItem('forms') as any)
  if (forms && Array.isArray(forms)) {
    const idx = forms.findIndex((cur: any) => cur.id === id)
    if (idx > -1 && forms[idx].render) {
      markerSymbol.url = forms[idx].render.images[!highLight ? 'normal' : 'highlight']
    }
  }
  let ponintGraphic: any = []
  let point: any = []
  const ponintGraphicArr: any = []
  const view = await getMainView()
  const [Point, Graphic] = await getModules([
    'esri/geometry/Point',
    'esri/Graphic',
  ])
  
  event.forEach((item: any) => {
    
    point = new Point({
      x: item.overlay.coordinates[0],
      y: item.overlay.coordinates[1],
      spatialReference: view.spatialReference,
    })
    ponintGraphic = new Graphic({
      geometry: point,
      symbol: markerSymbol,
      attributes: item,
    })
    ponintGraphicArr.push(ponintGraphic)
  })

  return ponintGraphicArr
}

// 线高亮展示
export async function highLightGraphicAll(
  id: any,
  event: any,
  highLight: boolean = false
) {
  let graphicLine: any = []
  const graphicLineArr: any = []
  const view = await getMainView()
  const [Graphic] = await getModules(['esri/Graphic'])
  let markerSymbol = {
    type: 'simple-line', // autocasts as new SimpleFillSymbol
    color: !highLight ? [51, 102, 255] : [102, 153, 255],
    width: 1,
    style: 'short-dash',
    cap: 'round',
    join: 'round',
  }
  const forms = JSON.parse(sessionStorage.getItem('forms') as any)
  if (forms && Array.isArray(forms)) {
    const idx = forms.findIndex((cur: any) => cur.id === id)
    if (idx > -1 && forms[idx].render) {
      markerSymbol.color = forms[idx].render[!highLight ? 'color' : 'highlightColor']
      forms[idx].render.lineStyle && forms[idx].render.lineStyle != '' && (markerSymbol.style = forms[idx].render.lineStyle)
    }
  }
  event.forEach((item: any) => {
    graphicLine = new Graphic({
      geometry: {
        type: 'polyline',
        paths: item.overlay.coordinates,
        spatialReference: view.spatialReference,
      },
      symbol: markerSymbol,
      attributes: item,
    })
    graphicLineArr.push(graphicLine)
  })

  return graphicLineArr
}

// 面高亮展示
export const highLightLandAll = async (
  id: any,
  res: any,
  highLight: boolean = false
) => {
  const polylineGraphicArr: any = []
  let polylineGraphic: any = []
  const view = await getMainView()
  const [Polygon] = await getModules(['esri/geometry/Polygon'])
  const [Graphic] = await getModules(['esri/Graphic'])
  const fillSymbol = {
    type: 'simple-fill',
    color: !highLight ? [51, 102, 255, 0.3] : [102, 153, 255, 0.3],
    outline: {
      color: !highLight ? [51, 102, 255] : [102, 153, 255],
      width: 1,
      style: 'short-dash',
    },
  }
  const forms = JSON.parse(sessionStorage.getItem('forms') as any)
  if (forms && Array.isArray(forms)) {
    const idx = forms.findIndex((cur: any) => cur.id === id)
    if (idx > -1 && forms[idx].render) {
      fillSymbol.color = forms[idx].render[!highLight ? 'color' : 'highlightColor']
      fillSymbol.outline.color = forms[idx].render[!highLight ? 'color' : 'highlightColor']
    }
  }
  res.forEach((item: any) => {
    try {
      const polygon = new Polygon({
        type: 'Polygon',
        rings: item.overlay.coordinates[0],
        spatialReference: view.spatialReference,
      })
      polylineGraphic = new Graphic({
        geometry: polygon,
        symbol: fillSymbol,
        attributes: item,
      })
      polylineGraphicArr.push(polylineGraphic)
    } catch (error) {
      console.log(error)
    }
  })

  return polylineGraphicArr
}

// 点位高亮展示
export const highLightPointAddress = async (x: any, y: any) => {
  const view = await getMainView()
  const [Point, Graphic] = await getModules([
    'esri/geometry/Point',
    'esri/Graphic',
  ])
  const markerSymbol = {
    type: 'picture-marker',
    color: [255, 51, 51],
    outline: {
      color: [255, 255, 255],
      width: 1,
    },
    width: '16px',
    height: '22px',
    url: street2,
  }
  point = new Point({
    x,
    y,
    spatialReference: view.spatialReference,
  })
  ponintGraphic = new Graphic({
    geometry: point,
    symbol: markerSymbol,
  })
  return ponintGraphic
}

//   图层列表--高亮展示某一条数据
export const handleRowHighLight = async (val: any,id: any) => {
  // handleRowHighLight(val)
  let graphics: any = []

  const view = await getMainView()
  view.graphics.removeAll()
  if (val.overlay.type === 'Point') {
    graphics = await highLightPointAll(id,[val],true)
  }
  if (val.overlay.type === 'LineString') {
    graphics = await highLightGraphicAll(id,[val],true)
  }
  if (val.overlay.type === 'Polygon') {
    graphics = await highLightLandAll(id,[val],true)
  }
  console.log(graphics,"graphics")
  view.graphics.add(graphics[0])
  await view.goTo(graphics[0])
  await view.goTo({
    extent:graphics[0].geometry.extent,
    zoom: 14,
  })
}

export async function removeGraphics() {
  const view = await getMainView()
  view && view.graphics.removeAll()
}

// 添加到临时图层
export const add2TempLayer = async (graphics: any) => {
  const view = await getMainView()
  const [GraphicsLayer] = await getModules(['esri/layers/GraphicsLayer'])
  const layer = getLayer('temp-layer')
  if (layer) {
    layer.graphics.add(graphics)
    layer.visible = true
  } else {
    const layer = new GraphicsLayer()
    layer.visible = false
    layer.graphics.add(graphics)
    layer.visible = true
    setLayer('temp-layer', layer)
    view.map.add(layer)
  }
}

// 从历史图层中删除
export const remove2TempLayer = async (graphics: any) => {
  const [GraphicsLayer] = await getModules(['esri/layers/GraphicsLayer'])
  const layer = getLayer('temp-layer')
  layer && layer.graphics.remove(graphics)
}

// 清除临时图层标记
export const clearTempLayer = async () => {
  const layer = getLayer('temp-layer')
  layer && layer.graphics.removeAll()
}

// 临时图层隐藏
export const hideTempLayer = async () => {
  const layer = getLayer('temp-layer')
  layer && (layer.visible = false)
}
