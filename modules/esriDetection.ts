// 一键检测专用文件
import { getMainView, getModules } from '~/modules/arcgisAPI'

// 是否占用耕地-只算压盖的面积
export function queryFeaturesLand(
  queryscheme: any,
  inputExtent: any,
  filterFeatures: any
) {
  // eslint-disable-next-line no-async-promise-executor
  return new Promise(async (resolve: any) => {
    try {
      const [Query, QueryTask] = await getModules([
        'esri/tasks/support/Query',
        'esri/tasks/QueryTask',
      ])
      const query = new Query()
      if (queryscheme.subLayerIndex !== null) {
        query.url =
          queryscheme.layer.serviceUrl + '/' + queryscheme.subLayerIndex
      } else {
        query.url = queryscheme.layer.serviceUrl
      }

      query.geometry = inputExtent
      query.returnGeometry = true
      query.outFields = ['*']
      query.where = '1=1'
      if (queryscheme.parameters !== '' && queryscheme.parameters != null) {
        query.where = queryscheme.parameters
      }
      const queryTask = new QueryTask({
        url: query.url,
      })
      // 查询图层与绘制区域内与相交的多边形
      queryTask.execute(query).then(function (queryResults: any) {
        if (queryResults.features.length === 0) {
          resolve({
            state: 'success',
            isOccupy: false, // 是否占用
            analysisResult: [],
          })
          return
        }

        const inFeaMap: any = []
        const DLMC: any = new Set() // 地类名称
        const GDPDJ: any = new Set() // 分等定级
        let isOccupy: boolean = false
        filterFeatures.forEach((item: any) => {
          const geometry = item.geometry
          queryResults.features.forEach(async (feature: any) => {
            if (geometry && feature.geometry) {
              const [geometryEngine] = await getModules([
                'esri/geometry/geometryEngine',
              ])
              const flag = geometryEngine.intersects(geometry, feature.geometry)
              if (flag) {
                const inGeo = geometryEngine.intersect(
                  geometry,
                  feature.geometry
                )
                if (inGeo) {
                  isOccupy = true
                  DLMC.add(feature.attributes[queryscheme.fields[0]])
                  GDPDJ.add(feature.attributes[queryscheme.fields[1]])

                  const mj = geometryEngine.planarArea(inGeo, 'square-meters')
                  const fea = {
                    DLMC: feature.attributes[queryscheme.fields[0]],
                    GDPDJ: feature.attributes[queryscheme.fields[1]],
                    mj,
                  }
                  inFeaMap.push(fea)
                }
              }
            }
          })
        })
        const GDPDJList = [...GDPDJ].sort((a, b) => a - b)
        const paramList: any = []
        GDPDJList.forEach((DJ: any) => {
          const param: any = {}
          param.DJ = DJ
          paramList.push(param)
        })
        paramList.push({ DJ: '小计' })
        paramList.forEach((param: any, index: any, item: any) => {
          Array.from(DLMC).forEach((MC: any) => {
            param[MC] = 0
          })
          param['小计'] = 0
          item[index] = param
        })

        inFeaMap.forEach((item: any) => {
          paramList.forEach((param: any) => {
            const mj = item.mj
            if (item.GDPDJ === param.DJ) {
              param[item.DLMC] += parseFloat(mj.toFixed(2))
            }
            if (param.DJ === '小计') {
              param[item.DLMC] += parseFloat(mj.toFixed(2))
            }
          })
        })
        // 求和
        const keyList = ['DJ', '小计']
        paramList.forEach((item: any) => {
          for (const [key, value] of Object.entries(item)) {
            const a: any = value
            if (!keyList.includes(key)) {
              item['小计'] += parseFloat(a.toFixed(2))
            }
            if (!String(keyList).includes(key)) {
              item[key] = parseFloat(a.toFixed(2))
            }
          }
        })
        resolve({
          state: 'success',
          isOccupy,
          analysisResult: paramList,
        })
      })
    } catch (error) {
      resolve({
        state: 'fail',
        isOccupy: false,
        analysisResult: [],
      })
    }
  })
}
// 是否占用建设项目使用林地审批已批复范围
export function queryFeaturesForest(
  queryscheme: any,
  inputExtent: any,
  filterFeatures: any
) {
  // eslint-disable-next-line no-async-promise-executor
  return new Promise(async (resolve: any) => {
    try {
      const [Query, QueryTask] = await getModules([
        'esri/tasks/support/Query',
        'esri/tasks/QueryTask',
      ])
      const query = new Query()
      if (queryscheme.subLayerIndex !== null) {
        query.url =
          queryscheme.layer.serviceUrl + '/' + queryscheme.subLayerIndex
      } else {
        query.url = queryscheme.layer.serviceUrl
      }
      query.geometry = inputExtent
      query.returnGeometry = true
      query.outFields = ['*']
      query.where = '1=1'
      if (queryscheme.parameters !== '' && queryscheme.parameters != null) {
        query.where = queryscheme.parameters
      }
      const queryTask = new QueryTask({
        url: query.url,
      })
      // 查询图层与绘制区域内与相交的多边形
      queryTask.execute(query).then(function (queryResults: any) {
        if (queryResults.features.length === 0) {
          resolve({
            state: 'success',
            isOccupy: false, // 是否占用
            analysisResult: filterFeatures,
          })
          return
        }

        const inFeaMap: any = []
        let isOccupy: boolean = false
        filterFeatures.forEach((item: any) => {
          const geometry = item.geometry
          queryResults.features.forEach(async (feature: any) => {
            const [geometryEngine] = await getModules([
              'esri/geometry/geometryEngine',
            ])
            if (geometry && feature.geometry) {
              const flag = geometryEngine.intersects(geometry, feature.geometry)
              // 如果有压盖就把多出的存起来，之后拿超出的去跟林地服务比对
              if (flag) {
                const inGeo = geometryEngine.intersect(
                  geometry,
                  feature.geometry
                )
                if (inGeo) {
                  isOccupy = true
                  const fea = {
                    features: inGeo,
                  }
                  inFeaMap.push(fea)
                }
              }
            }
          })
        })
        // 有占用
        if (inFeaMap.length > 0) {
          resolve({
            state: 'success',
            isOccupy,
            analysisResult: [],
          })
        } // 没有占用
        else {
          resolve({
            state: 'success',
            isOccupy: false,
            analysisResult: [],
          })
        }
      })
    } catch (error) {
      resolve({
        state: 'success',
        isOccupy: false,
        analysisResult: [],
      })
    }
  })
}
// 是否占用-只算压盖的面积-一键检测
export async function queryFeaturesOccupy(
  queryscheme: any,
  inputExtent: any,
  filterFeatures: any
) {
  const [QueryTask, Query, GeometryEngine] = await getModules([
    "esri/tasks/QueryTask",
    "esri/tasks/support/Query",
    "esri/geometry/geometryEngine",
  ]);
  return new Promise((resolve: any) => {
    try {
      const query: any = new Query();
      if (queryscheme.subLayerIndex !== null) {
        query.url =
          queryscheme.layer.serviceUrl + "/" + queryscheme.subLayerIndex;
      } else {
        query.url = queryscheme.layer.serviceUrl;
      }

      query.geometry = inputExtent;
      query.returnGeometry = true;
      query.outFields = ["*"];
      query.where = "1=1";
      if (queryscheme.parameters !== "" && queryscheme.parameters != null) {
        query.where = queryscheme.parameters;
      }
      const queryTask = new QueryTask({
        url: query.url,
      });
      // 查询图层与绘制区域内与相交的多边形
      queryTask.execute(query).then(function (queryResults: any) {
        const inFeaMap: any = [];
        let isOccupy = false;
        const inputPolygonList: any = [];
        filterFeatures.forEach((item: any) => {
          const geometry = item.geometry;
          if (geometry.type === "polygon") {
            inputPolygonList.push(geometry);
          }
          queryResults.features.forEach((feature: any) => {
            if (geometry && feature.geometry) {
              const attributes = feature.attributes;
              const flag = GeometryEngine.intersects(
                geometry,
                feature.geometry
              );
              if (flag) {
                const inGeo = GeometryEngine.intersect(
                  geometry,
                  feature.geometry
                );
                if (inGeo) {
                  isOccupy = true;
                  const type = inGeo.type;
                  let mj = 0;
                  switch (type) {
                    case "polyline":
                      mj = GeometryEngine.planarLength(inGeo, "meters");
                      break;
                    case "polygon":
                      mj = GeometryEngine.planarArea(inGeo, "square-meters");
                      break;
                    default:
                      break;
                  }

                  const fea: any = {
                    mj,
                    type,
                    attributes,
                    geometry: inGeo,
                  };
                  inFeaMap.push(fea);
                }
              }
            }
          });
        });
        if (queryResults.features.length === 0) {
          resolve({
            state: "success",
            isOccupy: false, // 是否占用
            analysisResult: [],
            projectList: [],
          });
          return;
        }
        const paramList: any = [];
        let sum = 0;
        let type = "";
        inFeaMap.forEach((item: any) => {
          sum += item.mj;
          if (type.length === 0) {
            type = item.type;
          }
        });
        const projectList = inFeaMap.map((item: any) => item);
        paramList.push({ name: "小计", 小计: sum, type });
        resolve({
          state: "success",
          isOccupy: true,
          analysisResult: paramList,
          projectList,
        });
      });
    } catch (error) {
      console.log(error);
      resolve({
        state: "fail",
        isOccupy: false, // 是否占用
        analysisResult: [],
        projectList: [],
      });
    }
  });
}
// 是否占用-只算点服务的数量-一键检测
export function queryFeaturesPoint(queryscheme: any, inputExtent: any) {
  // eslint-disable-next-line no-async-promise-executor
  return new Promise(async (resolve: any) => {
    try {
      const [Query, QueryTask] = await getModules([
        'esri/tasks/support/Query',
        'esri/tasks/QueryTask',
      ])
      const query = new Query()
      if (queryscheme.subLayerIndex !== null) {
        query.url =
          queryscheme.layer.serviceUrl + '/' + queryscheme.subLayerIndex
      } else {
        query.url = queryscheme.layer.serviceUrl
      }

      query.geometry = inputExtent
      query.returnGeometry = true
      query.outFields = ['*']
      query.where = '1=1'
      if (queryscheme.parameters !== '' && queryscheme.parameters != null) {
        query.where = queryscheme.parameters
      }
      const queryTask = new QueryTask({
        url: query.url,
      })
      // 查询图层与绘制区域内与相交的多边形
      queryTask.execute(query).then(function (queryResults: any) {
        if (queryResults.features.length === 0) {
          resolve({
            state: 'success',
            isOccupy: false, // 是否占用
            analysisResult: [],
          })
          return
        }
        resolve({
          state: 'success',
          isOccupy: true,
          analysisResult: [
            { name: '小计', 小计: queryResults.features.length },
          ],
        })
      })
    } catch (error) {
      console.log(error)
      resolve({
        state: 'fail',
        isOccupy: false, // 是否占用
        analysisResult: [],
      })
    }
  })
}
// 是否占用-算压盖的面积和占用的地块字段-一键检测
export function queryFeaturesGeoAndField(
  queryscheme: any,
  inputExtent: any,
  filterFeatures: any,
  field: string
) {
  // eslint-disable-next-line no-async-promise-executor
  return new Promise(async (resolve: any) => {
    try {
      const [Query, QueryTask] = await getModules([
        'esri/tasks/support/Query',
        'esri/tasks/QueryTask',
      ])
      const query = new Query()
      if (queryscheme.subLayerIndex !== null) {
        query.url =
          queryscheme.layer.serviceUrl + '/' + queryscheme.subLayerIndex
      } else {
        query.url = queryscheme.layer.serviceUrl
      }

      query.geometry = inputExtent
      query.returnGeometry = true
      query.outFields = ['*']
      query.where = '1=1'
      if (queryscheme.parameters !== '' && queryscheme.parameters != null) {
        query.where = queryscheme.parameters
      }
      const queryTask = new QueryTask({
        url: query.url,
      })
      // 查询图层与绘制区域内与相交的多边形
      queryTask.execute(query).then(function (queryResults: any) {
        if (queryResults.features.length === 0) {
          resolve({
            state: 'success',
            isOccupy: false, // 是否占用
            analysisResult: [],
          })
          return
        }
        const inFeaMap: any = []
        let isOccupy: boolean = false
        filterFeatures.forEach((item: any) => {
          const geometry = item.geometry
          queryResults.features.forEach(async (feature: any) => {
            if (geometry && feature.geometry) {
              const [geometryEngine] = await getModules([
                'esri/geometry/geometryEngine',
              ])
              const flag = geometryEngine.intersects(geometry, feature.geometry)
              if (flag) {
                const inGeo = geometryEngine.intersect(
                  geometry,
                  feature.geometry
                )
                if (inGeo) {
                  isOccupy = true
                  const type = inGeo.type
                  let mj = 0
                  const protectionZone = trim(feature.attributes[field])
                  switch (type) {
                    case 'polyline':
                      mj = geometryEngine.planarLength(inGeo, 'meters')
                      break
                    case 'polygon':
                      mj = geometryEngine.planarArea(inGeo, 'square-meters')
                      break
                    default:
                      break
                  }

                  const fea: any = {
                    mj,
                    type,
                    protectionZone,
                  }
                  fea.protectionZone = protectionZone
                  inFeaMap.push(fea)
                }
              }
            }
          })
        })
        const paramList: any = []
        let sum = 0
        let type = ''
        const protectionZoneArr: any = []
        inFeaMap.forEach((item: any) => {
          sum += item.mj
          protectionZoneArr.push(item.protectionZone)
          if (type.length === 0) {
            type = item.type
          }
        })
        const newProtectionZoneArr = [...new Set(protectionZoneArr)]
        let typeStr = ''
        newProtectionZoneArr.forEach((str: any) => {
          if (str.length === 0) {
            return
          }
          typeStr += str + '、'
        })
        if (typeStr.length > 0) {
          typeStr = typeStr.substring(0, typeStr.length - 1)
        }
        paramList.push({ name: '小计', 小计: sum, type, typeStr })
        resolve({
          state: 'success',
          isOccupy,
          analysisResult: paramList,
        })
      })
    } catch (error) {
      console.log(error)
      resolve({
        state: 'fail',
        isOccupy: false, // 是否占用
        analysisResult: [],
      })
    }
  })
}
// 是否符合气象探测保护规划要求-返回是否涉及以及限高多少-一键检测
export function queryFeaturesWeather(queryscheme: any, inputExtent: any) {
  // eslint-disable-next-line no-async-promise-executor
  return new Promise(async (resolve: any) => {
    try {
      const [Query, QueryTask] = await getModules([
        'esri/tasks/support/Query',
        'esri/tasks/QueryTask',
      ])
      const query = new Query()
      if (queryscheme.subLayerIndex !== null) {
        query.url =
          queryscheme.layer.serviceUrl + '/' + queryscheme.subLayerIndex
      } else {
        query.url = queryscheme.layer.serviceUrl
      }

      query.geometry = inputExtent
      query.returnGeometry = true
      query.outFields = ['*']
      query.where = '1=1'
      if (queryscheme.parameters !== '' && queryscheme.parameters != null) {
        query.where = queryscheme.parameters
      }
      const queryTask = new QueryTask({
        url: query.url,
      })
      // 查询图层与绘制区域内与相交的多边形
      queryTask.execute(query).then(function (queryResults: any) {
        if (queryResults.features.length === 0) {
          resolve({
            state: 'success',
            isOccupy: false, // 是否占用
            analysisResult: [],
          })
          return
        }
        let minHeight: any = 0
        queryResults.features.forEach((feature: any) => {
          const attributes = feature.attributes
          if (attributes) {
            const str = attributes.ZGDGCH_M
            const heightArr = str.match(/\d+(.\d+)?/g)
            heightArr.forEach((numStr: any) => {
              const num = parseFloat(numStr)
              if (minHeight === 0) {
                minHeight = num
              } else if (num < minHeight) {
                minHeight = num
              }
            })
          }
        })
        resolve({
          state: 'success',
          isOccupy: true,
          analysisResult: [],
          minHeight,
        })
      })
    } catch (error) {
      console.log(error)
      resolve({
        state: 'fail',
        isOccupy: false, // 是否占用
        analysisResult: [],
      })
    }
  })
}
// 返回压盖外的面积-一键检测
export function queryFeaturesBeyond(
  queryscheme: any,
  inputExtent: any,
  filterFeatures: any
) {
  // eslint-disable-next-line no-async-promise-executor
  return new Promise(async (resolve: any) => {
    try {
      const [Query, QueryTask] = await getModules([
        'esri/tasks/support/Query',
        'esri/tasks/QueryTask',
      ])
      const query = new Query()
      if (queryscheme.subLayerIndex !== null) {
        query.url =
          queryscheme.layer.serviceUrl + '/' + queryscheme.subLayerIndex
      } else {
        query.url = queryscheme.layer.serviceUrl
      }

      query.geometry = inputExtent
      query.returnGeometry = true
      query.outFields = ['*']
      query.where = '1=1'
      if (queryscheme.parameters !== '' && queryscheme.parameters != null) {
        query.where = queryscheme.parameters
      }
      const queryTask = new QueryTask({
        url: query.url,
      })
      // 查询图层与绘制区域内与相交的多边形
      queryTask.execute(query).then(async function (queryResults: any) {
        // 合并输入地块
        const inputPolygonList: any = []
        filterFeatures.forEach((item: any) => {
          const geometry = item.geometry
          if (geometry.type === 'polygon') {
            inputPolygonList.push(geometry)
          }
        })
        const [geometryEngine] = await getModules([
          'esri/geometry/geometryEngine',
        ])
        const inputUnionGeo = geometryEngine.union(inputPolygonList)
        // 没有压盖地块，则都为新增用地
        if (queryResults.features.length === 0) {
          resolve({
            state: 'success',
            isOccupy: true, // 是否属于新增
            analysisResult: inputUnionGeo,
          })
          return
        }
        // 有压盖的地块，则合并输出地块
        const outputPolygonList: any = []
        queryResults.features.forEach((feature: any) => {
          const geometry = feature.geometry
          if (geometry && geometry.type === 'polygon') {
            outputPolygonList.push(geometry)
          }
        })
        const outputUnionGeo = geometryEngine.union(outputPolygonList)
        // 比对是否相交
        const flag = geometryEngine.intersects(inputUnionGeo, outputUnionGeo)
        // 如果相交
        if (flag) {
          // 获取相交重叠的地块
          const inGeo = geometryEngine.intersect(inputUnionGeo, outputUnionGeo)
          let differenceGeo: any = inputUnionGeo
          // 用重叠的部分去跟输入的地块比对，获取输入地块去掉压盖地块的部分
          if (inGeo) {
            differenceGeo = geometryEngine.difference(inputUnionGeo, inGeo)
            // 看看输入是否在输出的里面
            const isContains = geometryEngine.contains(
              outputUnionGeo,
              inputUnionGeo
            )
            // 包含就属于输入在输出内
            if (isContains) {
              resolve({
                state: 'success',
                isOccupy: false,
                analysisResult: inputUnionGeo,
              })
            }
            // 不完全包含就属于输入跟输出相交或者输出在输入内
            else {
              resolve({
                state: 'success',
                isOccupy: true,
                analysisResult: differenceGeo,
              })
            }
          } else {
            resolve({
              state: 'fail',
              isOccupy: true,
              analysisResult: null,
            })
          }
        }
        // 如果不相交，则全为范围外
        else {
          resolve({
            state: 'success',
            isOccupy: true,
            analysisResult: inputUnionGeo,
          })
        }
      })
    } catch (error) {
      resolve({
        state: 'fail',
        isOccupy: true,
        analysisResult: null,
      })
    }
  })
}

// 是否占用-返回类型统计-一键检测
export function queryFeaturesByStatic(
  queryscheme: any,
  inputExtent: any,
  field: any,
  filterFeatures: any
) {
  // eslint-disable-next-line no-async-promise-executor
  return new Promise(async (resolve: any) => {
    try {
      const [Query, QueryTask] = await getModules([
        'esri/tasks/support/Query',
        'esri/tasks/QueryTask',
      ])
      const query = new Query()
      if (queryscheme.subLayerIndex !== null) {
        query.url =
          queryscheme.layer.serviceUrl + '/' + queryscheme.subLayerIndex
      } else {
        query.url = queryscheme.layer.serviceUrl
      }
      query.geometry = inputExtent
      query.returnGeometry = true
      query.outFields = ['*']
      query.where = '1=1'
      if (queryscheme.parameters !== '' && queryscheme.parameters != null) {
        query.where = queryscheme.parameters
      }
      const queryTask = new QueryTask({
        url: query.url,
      })

      // 查询图层与绘制区域内与相交的多边形
      queryTask.execute(query).then(function (queryResults: any) {
        const inFeaMap: any = []
        let isOccupy: boolean = false
        const inputPolygonList: any = []
        filterFeatures.forEach((item: any) => {
          const geometry = item.geometry
          if (geometry.type === 'polygon') {
            inputPolygonList.push(geometry)
          }
          queryResults.features.forEach(async (feature: any) => {
            if (geometry && feature.geometry) {
              const attributes = feature.attributes
              const [geometryEngine] = await getModules([
                'esri/geometry/geometryEngine',
              ])
              const flag = geometryEngine.intersects(geometry, feature.geometry)
              if (flag) {
                const inGeo = geometryEngine.intersect(
                  geometry,
                  feature.geometry
                )
                if (inGeo) {
                  isOccupy = true
                  const type = inGeo.type
                  let mj = 0
                  switch (type) {
                    case 'polyline':
                      mj = geometryEngine.planarLength(inGeo, 'meters')
                      break
                    case 'polygon':
                      mj = geometryEngine.planarArea(inGeo, 'square-meters')
                      break
                    default:
                      break
                  }

                  const fea: any = {
                    mj,
                    type,
                    field: attributes[field],
                  }
                  inFeaMap.push(fea)
                }
              }
            }
          })
        })
        if (queryResults.features.length === 0) {
          resolve({
            state: 'success',
            isOccupy: false, // 是否占用
            analysisResult: [],
          })
          return
        }
        const paramList: any = []
        let type = ''
        const fieldMap = new Map()
        inFeaMap.forEach((item: any) => {
          if (type.length === 0) {
            type = item.type
          }
          let area = fieldMap.get(item.field)
          if (area) {
            area += item.mj
          } else {
            area = item.mj
          }
          fieldMap.set(item.field, area)
        })
        for (const key of fieldMap) {
          const a: any = {}
          a[field] = key[0]
          a.area = key[1]
          paramList.push(a)
        }
        const isContain = isContainGeo(filterFeatures, queryResults.features)
        resolve({
          state: 'success',
          isOccupy,
          isContain,
          analysisResult: paramList,
        })
      })
    } catch (error) {
      console.log(error)
      resolve({
        state: 'fail',
        isOccupy: false, // 是否占用
        analysisResult: [],
      })
    }
  })
}
function trim(str: string) {
  return (str = str.replace(/\s+/g, ''))
}
// a是否包含在B里面，是的话属于边界一致
async function isContainGeo(filterFeatures: any, queryFeatures: any) {
  // 合并输入地块
  const inputPolygonList: any = []
  filterFeatures.forEach((item: any) => {
    const geometry = item.geometry
    if (geometry.type === 'polygon') {
      inputPolygonList.push(geometry)
    }
  })
  const [geometryEngine] = await getModules(['esri/geometry/geometryEngine'])
  const inputUnionGeo = geometryEngine.union(inputPolygonList)
  // 合并输出地块
  const outputPolygonList: any = []
  queryFeatures.forEach((feature: any) => {
    const geometry = feature.geometry
    if (geometry && geometry.type === 'polygon') {
      outputPolygonList.push(geometry)
    }
  })
  const outputUnionGeo = geometryEngine.union(inputPolygonList)
  // 判断输出的地块是否包含输入地块
  const isContains = geometryEngine.contains(outputUnionGeo, inputUnionGeo)
  return isContains
}
// 批量检测-判断每一个地块是否压盖到服务里面的地块
//queryscheme 已勾选的图层
//inputExtent 导入的或绘制的图形geometry
//filterFeatures 导入的或绘制的图形features
//indexName 当前勾选的图层名称
export async function queryFeaturesOccupyByEvery(
  queryscheme: any,
  inputExtent: any,
  filterFeatures: any,
  indexName: string,
  type: string
) {
  const [QueryTask, Query, GeometryEngine] = await getModules([
    "esri/tasks/QueryTask",
    "esri/tasks/support/Query",
    "esri/geometry/geometryEngine",
  ]);
  return new Promise((resolve: any) => {
    try {
      const query = new Query();
      if (queryscheme.subLayerIndex !== null) {
        query.url =
          queryscheme.layer.serviceUrl + "/" + queryscheme.subLayerIndex;
      } else {
        query.url = queryscheme.layer.serviceUrl;
      }

      query.geometry = inputExtent;
      query.returnGeometry = true;
      query.outFields = ["*"];
      query.where = "1=1";
      if (queryscheme.parameters !== "" && queryscheme.parameters != null) {
        query.where = queryscheme.parameters;
      }
      const queryTask = new QueryTask({
        url: query.url,
      });
      const view = getMainView();
      // 查询图层与绘制区域内与相交的多边形
      queryTask.execute(query).then(function (queryResults: any) {
        filterFeatures.forEach((item: any) => {
          let isContinue = true;
          const geometry = item.geometry;
          geometry.spatialReference = view.spatialReference;
          for (const feature of queryResults.features) {
            if (!isContinue) {
              break;
            }
            if (geometry && feature.geometry) {
              const attributes = feature.attributes;
              // 判断相交
              const flag = GeometryEngine.intersects(
                geometry,
                feature.geometry
              );
              if (flag) {
                switch (type) {
                  // 占用
                  case "isOppcupy":
                    item[indexName] = {
                      oppcupy: flag,
                    };
                    isContinue = false;
                    break;
                  // 需要获取属性
                  case "getAttributes":
                    // eslint-disable-next-line no-case-declarations
                    const inGeo1 = GeometryEngine.intersect(
                      geometry,
                      feature.geometry
                    );
                    if (inGeo1) {
                      if (item[indexName]) {
                        item[indexName].attributes.push(attributes);
                      } else {
                        item[indexName] = {
                          oppcupy: flag,
                          attributes: [attributes],
                        };
                      }
                    }

                    break;
                  // 获取是否包含
                  case "isOppcupyOrContain":
                    item[indexName] = {
                      oppcupy: flag,
                    };
                    // eslint-disable-next-line no-case-declarations
                    const isContains = GeometryEngine.contains(
                      geometry,
                      feature.geometry
                    );
                    if (isContains) {
                      item[indexName].contain = isContains;
                      isContinue = false;
                    }
                    break;

                  // 获取相交的地块
                  case "getIntersect":
                    // eslint-disable-next-line no-case-declarations
                    const inGeo = GeometryEngine.intersect(
                      geometry,
                      feature.geometry
                    );
                    if (item[indexName]) {
                      item[indexName].geometry.push(inGeo);
                    } else {
                      item[indexName] = {
                        oppcupy: flag,
                        geometry: [inGeo],
                      };
                    }
                    break;
                  default:
                    break;
                }
              }
            }
          }
        });
        resolve(filterFeatures);
      });
    } catch (error) {
      console.log(error);
      resolve(filterFeatures);
    }
  });
}
