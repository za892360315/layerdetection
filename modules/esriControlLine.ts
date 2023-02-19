import { getModule, getMainView } from '@/modules/arcgisAPI'

/**
 * 平面算面积
 * */
export function calculateAreas(geo: any) {
  let tempArea = 0
  if (geo.type === 'polygon') {
    const pgon = geo
    for (let mp = 0; mp < pgon.rings.length; mp++) {
      let x1 = 0
      let x2 = 0
      let y1 = 0
      let y2 = 0
      const rings = pgon.rings[mp]
      for (let i = 0; i < rings.length - 1; i++) {
        x1 = rings[i][0]
        x2 = rings[i + 1][0]
        y1 = rings[i][1]
        y2 = rings[i + 1][1]
        tempArea += (x1 + x2) * (y1 - y2)
      }
    }
  } else {
    tempArea = 0
  }
  return Math.abs(tempArea) / 2
}
// 用地性质统计
export async function queryYDXZ(geo: any) {
  let geometryYDXZ = ''
  const view = getMainView()
  const FeatureLayer = await getModule('esri/layers/FeatureLayer')
  const featureLayer = new FeatureLayer({
    url: (window as any).oneDetection.yzltUrl,
  })
  const query = featureLayer.createQuery()
  query.geometry = geo
  query.returnGeometry = false
  query.where = '1=1'
  query.outSpatialReference = view.spatialReference
  query.groupByFieldsForStatistics = '规划用地性质名称'
  query.outStatistics = [
    {
      statisticType: 'count',
      onStatisticField: '规划用地性质名称',
      outStatisticFieldName: 'count',
    },
  ]
  featureLayer.queryFeatures(query).then(function (results: any) {
    if (results.features.length > 0) {
      geometryYDXZ = ''
      for (let i = 0; i < results.features.length; i++) {
        geometryYDXZ += results.features[i].attributes['规划用地性质名称']
        if (i + 1 === results.features.length) {
          geometryYDXZ += ','
        }
      }
    }
  })
  return geometryYDXZ
}
