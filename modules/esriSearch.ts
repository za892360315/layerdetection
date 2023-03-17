import Vue from 'vue'
import config from './appConfig'
import { getMainView } from './arcgisAPI'

const vm = new Vue()
let sketchViewModel: any = null
let sketchLayer: any = null
let widget: any = null
let drawType: any = null
export function drawAction(type: string, num: number) {
  widget = num
  drawType = type
  if (!sketchViewModel) {
    const view = getMainView()
    sketchLayer = new config.esriConstructors.GraphicsLayer()
    sketchViewModel = new config.esriConstructors.SketchViewModel({
      layer: sketchLayer,
      defaultUpdateOptions: {
        tool: 'reshape',
        toggleToolOnClick: false
      },
      view
    })
    sketchViewModel.on('create', function (event: any) {
      if (event.state === 'complete') {
        search(event.graphic.geometry)
        drawAction(drawType, widget)
      }
    })
  } else {
    sketchViewModel.view = getMainView()
  }
  clearGeometry()
  sketchViewModel.create(type)
  // sketchViewModel.on('update', function(event) {
  //   if (event.state !== 'cancel' && event.graphics.length) {
  //     searchMap(event.graphics[0].geometry)
  //   }
  // })
}
function search(geometry: any) {
  if (widget === 5) searchMap(geometry)
  else if (widget === 9) searchModel(geometry)
}
export function clearGeometry() {
  if (sketchViewModel) sketchViewModel.cancel()
  if (sketchLayer) sketchLayer.removeAll()
  const view = getMainView()
  view.graphics.removeAll()
}

/**
 *执行 FindTask
 * @param {*} url 服务地址
 * @param {*} params 查询参数
 */
export function executeFindTask(params: any, url: String) {
  // Create a FindTask pointing to a map service
  const findTask = new config.esriConstructors.FindTask({
    url
  })

  // Set parameters for Find
  const findParams = new config.esriConstructors.FindParameters(params)

  return new Promise((resolve, reject) => {
    findTask
      .execute(findParams)
      .then(
        (res: any) => {
          resolve(res.results)
        },
        (err: any) => {
          reject(err)
        }
      )
      .catch((err: any) => {
        vm.$message.error({
          message: "FindTask didn't resolve: " + err.message,
          duration: 2000
        })
      })
  })
}
function searchMap(geometry: any) {
  if (config.MapSecondVue.show3DMonitor) {
    const mapViewDiv: HTMLElement | any = document.getElementById(
      'map3dMonitor'
    )
    mapViewDiv.style.cursor = 'wait'
  } else if (config.MapToolVue.show3D) {
    const mapViewDiv: HTMLElement | any = document.getElementById('map3d')
    mapViewDiv.style.cursor = 'wait'
  } else {
    const mapViewDiv: HTMLElement | any = document.getElementById('map2d')
    mapViewDiv.style.cursor = 'wait'
  }
  const view = getMainView()
  const layerViews = view.map.layers

  let searchFeatures: any = []
  let layerNum = 0
  let resultNum = 0
  for (let i = 0; i < layerViews.length; ++i) {
    const params = new config.esriConstructors.IdentifyParameters()
    params.tolerance = 3
    // params.layerOption = 'visible'
    params.width = view.width
    params.height = view.height
    params.geometry = geometry
    params.mapExtent = view.extent
    params.returnGeometry = true
    const sourceLayer = layerViews.getItemAt(i)
    if (
      sourceLayer.visible &&
      sourceLayer.type !== 'scene' &&
      sourceLayer.type !== 'graphics' &&
      sourceLayer.type !== 'building-scene' &&
      sourceLayer.title !== 'temporary' &&
      sourceLayer.title !== 'integrated-mesh'
    ) {
      layerNum++
      const index = sourceLayer.serverUrl.lastIndexOf('/')
      const id = sourceLayer.serverUrl.substring(
        index + 1,
        sourceLayer.serverUrl.length
      )
      params.layerOption = 'visible'
      if (!isNaN(parseInt(id))) {
        params.layerIds = [parseInt(id)]
      }
      const identifyTask = new config.esriConstructors.IdentifyTask({
        url: sourceLayer.url
      })
      identifyTask
        .execute(params)
        .then(function (response: any) {
          resultNum++
          response.results.forEach((item: any) => {
            item.layerName = sourceLayer.title
          })
          if (response.results.length > 0)
            searchFeatures = searchFeatures.concat(response.results) // searchFeatures.set(sourceLayer.title, response.results)
          if (layerNum === resultNum)
            config.MapToolVue.showSearchResult(searchFeatures)
        })
        .catch(function () {
          resultNum++
          if (layerNum === resultNum)
            config.MapToolVue.showSearchResult(searchFeatures)
        })
    }
  }
  if (layerNum === 0) {
    if (config.MapSecondVue.show3DMonitor) {
      const mapViewDiv: HTMLElement | any = document.getElementById(
        'map3dMonitor'
      )
      mapViewDiv.style.cursor = 'auto'
    } else if (config.MapToolVue.show3D) {
      const mapViewDiv: HTMLElement | any = document.getElementById('map3d')
      mapViewDiv.style.cursor = 'auto'
    } else {
      const mapViewDiv: HTMLElement | any = document.getElementById('map2d')
      mapViewDiv.style.cursor = 'auto'
    }
    vm.$message.warning({
      duration: 1000,
      message: '没有可查询的二维图层'
    })
  }
}
let sceneLayerViews: any = []

function searchModel(geometry: any) {
  const mapViewDiv: HTMLElement | any = document.getElementById('map3d')
  mapViewDiv.style.cursor = 'wait'
  const view = getMainView()
  const layerViews = view.map.layers
  let layerNum = 0
  mapViewDiv.style.cursor = 'auto'
  let geo: any = null
  if (geometry.type === 'polygon') {
    geo = new config.esriConstructors.Polygon({
      rings: geometry.rings,
      spatialReference: view.spatialReference
    })
  } else if (geometry.type === 'polyline') {
    geo = new config.esriConstructors.Polyline({
      paths: geometry.paths,
      spatialReference: view.spatialReference
    })
  } else if (geometry.type === 'point') {
    geo = new config.esriConstructors.Point({
      x: geometry.x,
      y: geometry.y,
      spatialReference: view.spatialReference
    })
  }
  layerViews.forEach(function (layer: any) {
    if (layer.type === 'scene' && layer.visible) {
      layerNum++
      view
        .whenLayerView(layer)
        .then(function (layerView: any) {
          const featureFilter = new config.esriConstructors.FeatureFilter({
            geometry: geo,
            spatialRelationship: 'disjoint'
          })
          layerView.filter = featureFilter
          sceneLayerViews.push(layerView)
        })
        .catch(console.error)
    }
  })
  if (layerNum === 0) {
    vm.$message.warning({
      duration: 1000,
      message: '没有可选择的模型'
    })
  }
}
export function clearFilter() {
  if (sceneLayerViews.length > 0) {
    for (let i = 0; i < sceneLayerViews.length; i++) {
      sceneLayerViews[i].filter = null
    }
  }
  sceneLayerViews = []
}
export function searchCityDesign(geometry: any, ids: any, callback: any) {
  const view = getMainView()
  const params = new config.esriConstructors.IdentifyParameters()
  params.tolerance = 5
  params.layerOption = 'visible'
  params.width = view.width
  params.height = view.height
  params.geometry = geometry
  params.mapExtent = view.extent
  params.returnGeometry = true
  params.layerIds = ids

  const identifyTask = new config.esriConstructors.IdentifyTask({
    url: (window as any).cityDesign.cssjUrl
  })
  identifyTask.execute(params).then(function (response: any) {
    callback(response.results)
  })
}
export function searchCityDesignByText(
  text: any,
  ids: any,
  fields: any,
  callback: any
) {
  const view = getMainView()
  const params = new config.esriConstructors.FindParameters()
  params.layerIds = ids
  params.searchFields = fields
  params.returnGeometry = true
  params.outSpatialReference = view.spatialReference
  params.searchText = text
  const findTask = new config.esriConstructors.FindTask({
    url: (window as any).cityDesign.cssjUrl
  })
  findTask.execute(params).then(function (response: any) {
    callback(response.results)
  })
}
