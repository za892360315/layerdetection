import { loadModules, loadCss } from 'esri-loader'
import config from './appConfig'
import { createLayer, getLayer, setLayer } from './esriLayer'
import { getMaps } from '@/services/api/map'
import { layerType } from './appEnum'
const option = {
  api: '/library/4.18/dojo/dojo.js',
  css: '/library/4.18/esri/css/main.css',
  font: '/library/ArcGIS_pbf_Font',
}

// 模块存放
const moduleStore: any = {}

/**
 * 初始化
 **/

export const init = () => {
  loadCss(option.css)
  getModules(['esri/config']).then((modules) => {
    const [config] = modules
    config.fontsUrl = option.font
    config.log.level = 'none'
  })
}
// 获取Map
export function getMainMap() {
  return config.activeView.map
}
export const getMainView = () => {
  return config.activeView
}
/**
 * @param modulePaths arcgis api 模块途径
 **/
export const getModules = (modulePaths: string[]) => {
  const promise = new Promise<any[]>((resolve, reject) => {
    const arr: Promise<any>[] = []
    modulePaths.forEach((path) => {
      arr.push(getModule(path))
    })
    Promise.all(arr)
      .then((modules) => {
        resolve(modules)
      })
      .catch((e) => {
        reject(e)
      })
  })
  return promise
}

// 获取单个模块
export const getModule = (path: string) => {
  const promise = new Promise<any>((resolve, reject) => {
    const name = path.split('/').pop() as string
    if (moduleStore[name]) {
      resolve(moduleStore[name])
    } else {
      loadModules([path], { url: option.api })
        .then((modules: any) => {
          const module = modules[0]
          moduleStore[name] = module
          resolve(module)
        })
        .catch((e: any) => {
          // eslint-disable-next-line prefer-promise-reject-errors
          reject({ msg: `load modules ${name} failed`, err: e })
        })
    }
  })
  return promise
}
// 获取地图参数
export const getMapData = () => {
  return new Promise((resolve: any, reject: any) => {
    getMaps()
      .then((res: any) => {
        config.mapInitParam = res
        resolve()
      })
      .catch((err: any) => {
        reject(err)
      })
  })
}
// 生成二维地图
export async function create2DView(div: string) {
  try {
    const allLayers: any[] = [];
    const mapInitParam = config.mapInitParam;
    const constraints = mapInitParam.constraint
      // eslint-disable-next-line no-eval
      ? eval("(" + mapInitParam.constraint + ")")
      : "";
    // eslint-disable-next-line no-eval
    const spatialReference = eval(
      "(" + mapInitParam.mapConfig.spatialReference + ")"
    );
    const extent = {
      xmin: mapInitParam.extent2D.xMin,
      ymin: mapInitParam.extent2D.yMin,
      xmax: mapInitParam.extent2D.xMax,
      ymax: mapInitParam.extent2D.yMax,
      spatialReference,
    };
    const map2dLayerList = config.basemap2DLayers;
    const [BaseMap, Map, MapView] = await getModules([
      "esri/Basemap",
      "esri/Map",
      "esri/views/MapView",
    ]);
    map2dLayerList.forEach(async (item: any) => {
      item.checked = true;
      const layer = await createLayer(item);
      if (layer) {
        layer.visible = item.checked;
        if (item.checked) {
          config.basemapVue.mapName = item.parentName;
          config.baseMapID.push(item.mapLayer.id);
          config.basemapVue.mapName = item.parentName;
          config.baseMapID.push(item.mapLayer.id);
        }
      }
      allLayers.push(layer);
      // 默认展示电子地图
      allLayers.forEach((item: any) => {
        item.parentName === "电子地图"
          ? (item.visible = true)
          : (item.visible = false);
      });

      if (allLayers.length === map2dLayerList.length) {
        const baseMap = new BaseMap({
          baseLayers: allLayers,
        });
        const map = new Map({
          basemap: baseMap,
        });
        const view2D = new MapView({
          container: div,
          map,
          extent,
          constraints: {
            rotationEnabled: false,
          },
          spatialReference,
          highlightOptions: {
            color: [255, 255, 0, 1],
            haloOpacity: 0.9,
            fillOpacity: 0.2,
          },
        });
        view2D.constraints = constraints;
        view2D.ui.remove("attribution");
        view2D.ui.empty("top-left");
        view2D.ui.empty("top-right");
        view2D.popup.autoOpenEnabled = true;
        config.esriInstance.view2D = view2D;
        config.esriInstance.map2D = map;
        config.activeView = view2D;
        // config.activeView.when(async () => {
        //   // useStore().map.setglobalLoading(false);
        // });
        // bindClickEvt();
        return view2D;
      }
    });
  } catch (error) {
    console.log(error);
  }
}
export async function create3DView(div: string) {
  const altitudeLayers: any = [];
  const imgLayers: any = [];
  const [BaseMap, Map, SceneView] = await getModules([
    "esri/Basemap",
    "esri/Map",
    "esri/views/SceneView",
  ]);
  // eslint-disable-next-line no-eval
  const spatialReference = eval(
    "(" + config.mapInitParam.mapConfig.spatialReference + ")"
  );
  const viewingMode =
    config.mapInitParam.viewingMode === ""
      ? "local"
      : config.mapInitParam.viewingMode;
  const [demLayers, layers] =  createLayers();
  await demLayers[0].then((res: any) => {
    altitudeLayers.push(res);
  });
  await layers[0].then((res: any) => {
    imgLayers.push(res);
  });
  if (imgLayers.length !== 0) {
    // const baseMap = new BaseMap({
    //     baseLayers: imgLayers,
    // });
    const options: any = {};
    options.basemap = new BaseMap();

    // const photography = await createTiltPhotography();

    // imgLayers.push(photography);

    // const layersAll = await createLayerAll();
    // layersAll.forEach((item: any) => {
    //   imgLayers.push(item);
    // });
    options.basemap.baseLayers = imgLayers;
    if (altitudeLayers && altitudeLayers.length > 0) {
      options.ground = {
        layers: altitudeLayers,
        navigationConstraint: {
          type: "none",
        },
        opacity: 1,
      };
    }
    const map = new Map(options);
    // const map = new Map({
    //     basemap: baseMap,
    // });
    const view3D = new SceneView({
      container: div,
      map,
      viewingMode,
      spatialReference,
    });

    // view3D.popup.autoOpenEnabled = config.esriInstance.autoOpenEnabled;
    view3D.qualitySettings.memoryLimit = 2048;
    config.esriInstance.view3D = view3D;
    config.esriInstance.map3D = map;
    config.esriInstance.is3D = true;
    view3D.ui.remove("attribution");
    view3D.ui.empty("top-left");
    view3D.ui.empty("top-right");
    let camera = "";
    // view3D.when(async () => {
    //   useStore().map.setThreeGlobalLoading(false);
    //   console.log("33333");
    // });
    view3D.watch("scale", function (value: any) {
      view3D.layerViews.forEach(function (layerView: any) {
        if (value < 900) {
          view3D.camera = camera;
        } else {
          camera = layerView.view.camera;
        }
        // }
      });
    });
    return view3D;
  }
}

// 创建图层组3D
export function createLayers() {

  const demLayers = [];
  const layers = [];

  for (const data of config.basemap3DLayers) {
    let layer = getLayer(data.mapLayer.id);
    // if (!layer) {
    layer = createLayer(data);
    if (layer) {
      setLayer(data.mapLayer.id, layer);
      if (data.mapLayer.layerConfig.layerType === layerType.ElavationLayer) {
        demLayers.push(layer);
      } else {
        layers.push(layer);
      }
    }
    // }
  }

  return [demLayers, layers];
}

export async function createGraphics(data: any[], symbol?: any) {
  const [Graphic] = await getModules(['esri/Graphic'])
  const graphics: any[] = []
  data.forEach((item) => {
    let xsimpleLineSymbol = {}
    if (item.symbol) {
      xsimpleLineSymbol = {
        ...item.symbol,
      }
    }
    if (symbol) {
      xsimpleLineSymbol = symbol
    }
    const polylineGraphic = new Graphic({
      geometry: item.geometry,
      symbol: xsimpleLineSymbol,
      attributes: item.attributes,
    })
    graphics.push(polylineGraphic)
  })
  return graphics
}

export async function createBaseLayer() {
  const [GraphicsLayer] = await getModules(['esri/layers/GraphicsLayer'])
  const layer = new GraphicsLayer()
  return layer
}

// 地图查询
export async function queryMap(
  url: any,
  field: any,
  where?: any,
  graphic?: any
) {
  const [FeatureLayer] = await getModules(['esri/layers/FeatureLayer'])
  const featureLayer = new FeatureLayer({ url })
  const query = featureLayer.createQuery()
  query.returnGemetry = false
  query.where = '1=1'
  if (where) {
    query.where = where
  }
  if (field) {
    query.groupByFieldsForStatistics = field
    query.outStatistics = [
      {
        statisticType: 'count',
        onStatisticField: field,
        outStatisticFieldName: 'num',
      },
    ]
  } else {
    query.outFields = '*'
  }
  if (graphic) {
    query.geometry = graphic
  }
  try {
    const results = await featureLayer.queryFeatures(query)

    return results
  } catch (error) {
    return {
      features: [],
    }
  }
}
