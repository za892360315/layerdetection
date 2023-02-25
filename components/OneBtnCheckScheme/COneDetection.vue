<template>
  <div>
    <el-row class="panel-item">
      <el-row style="font-size: 14px">
        <i
          class="iconmodule iconfont"
          style="color: #3977f4; margin-right: 5px"
        />项目信息</el-row
      >
      <el-row class="row-box" style="font-size: 14px; margin: 10px 0">
        <el-col :span="7" class="row-box-left">项目名称 : </el-col>
        <el-col :span="17" class="row-box-right intelligent">
          <el-input
            v-model="form.name"
            size="small"
            style="width: 100%; height: 32px"
            placeholder="请输入项目名称"
          ></el-input>
        </el-col>
      </el-row>
      <el-row style="font-size: 14px">
        <el-row class="row-box row-box-bottom" style="font-size: 14px">
          <el-col :span="7" class="row-box-left">建设单位 : </el-col>
          <el-col :span="17" class="row-box-right intelligent">
            <el-input
              v-model="form.department"
              size="small"
              style="width: 100%; height: 32px"
              placeholder="请输入建设单位"
            ></el-input>
          </el-col>
        </el-row>
      </el-row>
    </el-row>
    <el-row class="panel-item">
      <el-row style="font-size: 14px">
        <i
          class="iconmodule iconfont"
          style="color: #3977f4; margin-right: 5px"
        />检测范围
      </el-row>
      <el-row style="font-size: 14px">
        <el-row class="row-box" style="margin-top: 10px">
          <el-col :span="7" class="row-box-left">手工绘制 : </el-col>
          <el-col :span="17" class="row-box-right">
            <el-row :gutter="10" style="margin-bottom: 5px" type="flex">
              <el-col :span="8">
                <el-button
                  class="form-btn btn-start"
                  size="small"
                  icon="iconfont el-iconthird-painting-rectangle"
                  @click="drawClick('rectangle')"
                ></el-button>
              </el-col>
              <el-col :span="8">
                <el-button
                  class="form-btn btn-start"
                  size="small"
                  icon="iconfont el-iconthird-painting-round"
                  @click="drawClick('circle')"
                ></el-button>
              </el-col>
              <el-col :span="8">
                <el-button
                  class="form-btn btn-start"
                  size="small"
                  icon="iconfont el-iconthird-painting-polygon"
                  @click="drawClick('polygon')"
                ></el-button>
              </el-col>
            </el-row>
          </el-col>
        </el-row>
        <el-row class="row-box" style="margin: 10px 0">
          <el-col :span="7" class="row-box-left">外部导入 : </el-col>
          <el-col :span="17" class="row-box-right">
            <el-row :gutter="10" style="margin-bottom: 5px" type="flex">
              <el-col :span="12">
                <el-upload
                  ref="upload"
                  :show-file-list="false"
                  :auto-upload="true"
                  :before-upload="selectShpFile"
                  class="upload-demo"
                  accept=".shp"
                  action="/"
                >
                  <el-button
                    :class="activeList === 'importShp' ? 'btn-select' : ''"
                    class="form-btn btn-start"
                    size="small"
                    >shape文件</el-button
                  >
                </el-upload>
              </el-col>
              <el-col :span="12">
                <el-upload
                  ref="upload"
                  :show-file-list="false"
                  :auto-upload="true"
                  :before-upload="selectCadFile"
                  :on-success="handleCadSuccess"
                  :on-remove="handleCadRemove"
                  class="upload-demo"
                  accept=".dwg"
                  action="http://192.9.200.86:7001/api/services/app/Gis/ParseCADFileWithoutAE"
                >
                  <el-button
                    :class="activeList === 'importCad' ? 'btn-select' : ''"
                    class="form-btn btn-start"
                    size="small"
                    style="background: #cfe5ff"
                    >cad文件</el-button
                  >
                </el-upload>
              </el-col>
              <!-- <el-col :span="8">
                <el-button
                  :class="activeList === 'layer' ? 'btn-select' : ''"
                  class="form-btn btn-start"
                  size="small"
                  style="background: #cfe5ff"
                  @click="getLayerTree"
                  >地块拾取</el-button
                >
              </el-col> -->
            </el-row>
          </el-col>
        </el-row>
      </el-row>
      <el-row style="font-size: 14px">
        <el-row
          v-show="activeList === 'importShp' || activeList === 'importCad'"
          class="row-box row-box-bottom"
        >
          <el-col :span="7" class="row-box-left">地块列表 : </el-col>
          <el-col :span="17" class="row-box-right">
            <el-select
              v-model="form.geometry"
              multiple
              size="small"
              class="intelligent"
              placeholder="请选择地块"
              style="width: 100%; height: 32px"
              collapse-tags
              @change="changeSelectGeo"
            >
              <el-option
                v-for="(feature, index) of inputFileFeaure"
                :key="index"
                :label="'地块' + index"
                :value="index"
              ></el-option>
              <el-row style="height: 17px"></el-row>
            </el-select>
          </el-col>
        </el-row>
      </el-row>
    </el-row>
    <el-row class="panel-item">
      <el-row style="font-size: 14px">
        <i
          class="iconmodule iconfont"
          style="color: #3977f4; margin-right: 5px"
        />检测指标
      </el-row>
      <el-row style="font-size: 14px">
        <el-row class="row-box row-box-bottom" style="margin-top: 10px">
          <el-col :span="24" class="row-box-right">
            <el-scrollbar style="height: calc(100vh - 568px)">
              <el-tree
                ref="tree"
                :data="schemeCatalogs"
                :props="defaultProps"
                :render-after-expand="false"
                :default-expand-all="true"
                node-key="id"
                show-checkbox
              >
                <span
                  slot-scope="{ node, data }"
                  class="custom-tree-node"
                  style="padding-right: 10px"
                >
                  <span
                    :title="node.label"
                    :style="{
                      width:
                        node.level > 1
                          ? node.level > 2
                            ? node.level > 3
                              ? node.level > 4
                                ? node.level > 5
                                  ? '80px'
                                  : '100px'
                                : '120px'
                              : '140px'
                            : '160px'
                          : '',
                    }"
                    class="tree-label"
                    @click="handleNodeClick(data)"
                    >{{ node.label }}</span
                  >
                </span>
              </el-tree>
            </el-scrollbar>
          </el-col>
        </el-row>
      </el-row>
    </el-row>
    <el-row :gutter="10">
      <el-col :span="12">
        <el-button
          size="small"
          class="btn-search form-btn"
          style="background: #fc7146; color: #fff"
          title="开始检测"
          @click="doAnalysis"
          >开始检测</el-button
        >
      </el-col>
      <el-col :span="12">
        <el-button
          size="small"
          class="btn-search form-btn"
          title="重置"
          style="background: #e2e2e2"
          @click="reset"
          >重置</el-button
        >
      </el-col>
      <!-- <el-col :span="8">
        <el-button
          size="small"
          class="btn-search form-btn"
          style="background: #fc7146; color: #fff"
          title="检测结果截图"
          @click="screenshot"
          >截图工具</el-button
        >
      </el-col> -->
    </el-row>
    <base-panel
      v-if="showResult"
      class="detailLayer"
      @close="showResult = false"
    >
      <div slot="header" class="panel-header">一键检测结果</div>
      <OneDetectionResult
        slot="content"
        ref="DetectionResult"
        :form="form"
        :geometry-area="geometryArea"
        :geometry-ydxz="geometryYDXZ"
        :geometry-xzq="geometryXZQ"
        :results-content="resultsContent"
        @setGeometryCenter="setGeometryCenter"
      ></OneDetectionResult>
    </base-panel>
  </div>
</template>
<script>
import OneDetectionResult from './COneDetectionResult.vue'
import basePanel from '@/components/templates/templatePanels.vue'
import { getStatdetectData } from '~/services/api/common'
import {
  queryFeaturesLand,
  queryFeaturesOccupy,
  queryFeaturesByStatic,
  queryFeaturesBeyond,
  queryFeaturesPoint,
  queryFeaturesGeoAndField,
  queryFeaturesWeather,
} from '~/modules/esriDetection'
import { calculateAreas } from '~/modules/esriControlLine'
import config from '~/modules/appConfig'
import { getMainView, getModules } from '~/modules/arcgisAPI'

import { changeExtent } from '~/modules/esriCommand'
export default {
  // 一键检测模块
  name: 'COneDetection',
  components: {
    OneDetectionResult,
    basePanel,
  },
  data() {
    return {
      defaultProps: {
        children: 'children',
        label: 'displayName',
      },
      form: {
        name: '',
        department: '',
        scheme: '',
        geotype: '1',
        geometry: [],
      },
      uploadState: false,
      uploadStateTitle: '正在解析数据...',
      schemeCatalogs: [],
      uploadFile: null,
      shpFile: null,
      inputFileFeaure: [],
      sketchLayer: null,
      sketchViewModel: null,
      polygonGraphic: null,
      fillSymbol: {
        type: 'simple-fill',
        color: [227, 139, 79, 0.2],
        outline: {
          color: [255, 0, 0],
          width: 2,
        },
      },
      queryscheme: null,
      schemeName: '',
      resultMap: [],
      isShape: true,
      graphic: null,
      layerMap: new Map(),
      showResult: false,
      showTypeText: '一键检测结果',
      geometryArea: 0,
      geometryYDXZ: '',
      geometryXZQ: '',
      allData: [], // 将数据扁平化
      queryIndex: 0, // 请求的次数
      queryList: [], // 已勾选的列表
      resultsContent: '', // 传入结果页的格式
      layerData: [],
      activeList: '',
      layerIndex: null, // 选择的拾取图层序号
      borderPickUp: false,
      pickUpFeatures: [],
    }
  },
  mounted() {
    this.inputFileFeaure = []
    this.getControlLineCatalog()
  },
  beforeDestroy() {
    this.closeLayer()
  },
  methods: {
    selectLayerPanel(visible) {
      this.borderPickUp = visible
      if (!visible) {
        this.closeLayer()
        this.layerIndex = null
      }
    },
    screenshot() {
      this.$notify({
        title: '提示',
        message: '请在地图上拖拽区域进行截图',
        duration: 2000,
      })
      this.$store.commit('onlineMap/setShowScreenshot', true)
    },
    closeDetectionResult() {
      this.$refs.DetectionResult.removeLayers()
      this.showResult = false
    },
    getControlLineCatalog() {
      if (this.schemeCatalogs.lenth > 0) return
      getStatdetectData()
        .then((res) => {
          if (res.children) {
            res.displayName = '全选'
            this.schemeCatalogs = [res]
          }
        })
        .catch((err) => {
          console.log('获取一键检测方案失败', err)
        })
    },
    selectCadFile(file) {
      this.activeList = 'importCad'
      this.selectLayerPanel(false)
      this.inputFileFeaure = []
      this.form.geometry = ''
      this.isShape = false
      if (file) {
        if (file.name.substring(file.name.length - 4) !== '.dwg') {
          this.$message({
            message: '只能上传dwg文件',
            type: 'warning',
          })
          return false
        }
        this.uploadStateTitle = '正在解析数据...'
        this.uploadState = true
        return true
      }
    },
    handleCadSuccess(response) {
      if (response.success) {
        const result = response.result
        this.inputFileFeaure = result.Polygon
        this.$message('文件导入成功，请在地块列表中选择检测地块')
      } else {
        this.$message.error('文件解析错误')
      }
      this.uploadState = false
    },
    handleCadRemove(err) {
      this.$message.error('文件上传失败')
      this.uploadState = false
      console.log(err)
    },
    selectShpFile(file) {
      this.isShape = true
      this.activeList = 'importShp'
      this.form.geometry = ''
      this.selectLayerPanel(false)
      this.shpFile = file
      if (this.shpFile) {
        const that = this
        if (
          this.shpFile.name.substring(this.shpFile.name.length - 4) !== '.shp'
        ) {
          this.$message({
            message: '只能上传shp文件',
            type: 'warning',
          })
          return false
        } else {
          const fileReader = new FileReader()
          fileReader.readAsArrayBuffer(this.shpFile)
          fileReader.onload = function () {
            const shapefile = require('shapefile')
            shapefile.read(this.result).then((geoJson) => {
              geoJson.fileName = that.shpFile.name
              that.inputFileFeaure = geoJson.features
              if (that.inputFileFeaure.length === 0) {
                that.$message('该文件没有可用的面图形')
              } else {
                that.$message('文件导入成功，请在地块列表中选择检测地块')
              }
            })
          }
        }
        return false
      }
    },
    clearGeometry() {
      if (this.sketchViewModel) this.sketchViewModel.cancel()
      if (this.sketchLayer) this.sketchLayer.removeAll()
      const view = getMainView()
      view.graphics.removeAll()
    },
    async drawClick(type) {
      this.form.geotype = '2'
      this.clearGeometry()
      const that = this
      const view = getMainView()
      const [GraphicsLayer, SketchViewModel] = await getModules([
        'esri/layers/GraphicsLayer',
        'esri/widgets/Sketch/SketchViewModel',
      ])
      this.sketchLayer = new GraphicsLayer()
      this.sketchViewModel = new SketchViewModel({
        layer: this.sketchLayer,
        defaultUpdateOptions: {
          tool: 'reshape',
          toggleToolOnClick: false,
        },
        view,
      })
      this.sketchViewModel.on('create', function (event) {
        if (event.state === 'complete') {
          event.graphic.symbol = that.fillSymbol
          view.graphics.add(event.graphic)
          that.polygonGraphic = event.graphic
        }
      })
      this.sketchViewModel.create(type)
    },
    async changeSelectGeo() {
      this.form.geotype = '1'
      const view = getMainView()
      const [Polygon, Graphic] = await getModules([
        'esri/geometry/Polygon',
        'esri/Graphic',
      ])
      view.graphics.removeAll()
      let polygon = null
      this.form.geometry.forEach((i) => {
        if (this.isShape) {
          polygon = new Polygon({
            rings: this.inputFileFeaure[i].geometry.coordinates,
            spatialReference: view.spatialReference,
          })
        } else {
          polygon = new Polygon({
            rings: this.inputFileFeaure[i].geometry.rings,
            spatialReference: view.spatialReference,
          })
        }
        const graphic = new Graphic({
          geometry: polygon,
          symbol: this.fillSymbol,
        })
        view.graphics.add(graphic)
        view.extent = changeExtent(polygon.extent.clone())
      })
    },
    async doAnalysis() {
      this.queryList = []
      const view = getMainView()
      let rings = []
      let polygon = null
      const [Polygon, Graphic] = await getModules([
        'esri/geometry/Polygon',
        'esri/Graphic',
      ])
      if (this.form.geotype === '1') {
        if (this.form.geometry.length > 0) {
          this.form.geometry.forEach((i) => {
            if (this.isShape) {
              if (this.inputFileFeaure[i].geometry.coordinates.length > 1) {
                this.inputFileFeaure[i].geometry.coordinates.forEach((c) => {
                  rings = rings.concat(c)
                })
              } else
                rings = rings.concat(
                  this.inputFileFeaure[i].geometry.coordinates
                )
            } else rings = rings.concat(this.inputFileFeaure[i].geometry.rings)
          })
          polygon = new Polygon({
            rings,
            spatialReference: view.spatialReference,
          })
          this.polygonGraphic = new Graphic({
            geometry: polygon,
          })
        } else {
          this.$message('请输入检测范围')
        }
      }
      if (!this.polygonGraphic) {
        this.$message('请输入检测范围')
        return
      }
      // const ckeckedKeys = this.$refs.tree.getCheckedKeys() // 已勾选节点
      // const halfKeys = this.$refs.tree.getHalfCheckedKeys() // 已半选节点
      const selectAllNode = this.$refs.tree.getNode(this.schemeCatalogs[0].id) // 全选节点
      // console.log(ckeckedKeys, halfKeys)
      if (!selectAllNode.checked && !selectAllNode.indeterminate) {
        this.$message('请选择检测方案')
        return
      }
      this.uploadStateTitle = '正在进行分析...'
      // this.uploadState = true
      this.geometryArea = calculateAreas(this.polygonGraphic.geometry).toFixed(
        2
      ) // 用地面积
      this.geometryYDXZ = ''
      this.geometryXZQ = ''
      this.queryIndex = 0
      this.queryYDXZ(this.polygonGraphic.geometry) // 用地性质
      // this.queryXZQ(this.polygonGraphic.geometry) // 所属行政区
      this.showResult = true
      this.setGeometryCenter()
      this.needQueryList()
    },
    reset() {
      this.form = {
        name: '',
        department: '',
        scheme: '',
        geotype: '1',
        geometry: [],
      }
      this.inputFileFeaure = []
      const view = getMainView()
      view.graphics.removeAll()
      // view.map.layers.forEach((item) => {
      //   if (item.id === 'screenshotID') {
      //     item.visible = false
      //   }
      // })
      this.polygonGraphic = null
      if (this.sketchViewModel) this.sketchViewModel.destroy()
      // this.clear()
      this.$refs.tree.setCheckedKeys([])
      this.showResult = false;
    },
    async showTemporaryLayer(layerData) {
      if (this.layerMap.has(layerData.layer.id + '-temporary')) {
        const layer = this.layerMap.get(layerData.layer.id + '-temporary')
        layer.visible = true
      } else {
        const view = getMainView()
        let url = ''
        let id = ''
        if (layerData.subLayerIndex === null) {
          url = layerData.layer.serviceUrl.substring(
            0,
            layerData.layer.serviceUrl.length - 2
          )
          id = layerData.layer.serviceUrl.substring(
            layerData.layer.serviceUrl.length - 1,
            layerData.layer.serviceUrl.length
          )
        } else {
          url = layerData.layer.serviceUrl
          id = layerData.subLayerIndex
        }
        const [MapImageLayer] = await getModules(['esri/layers/MapImageLayer'])
        const layer = new MapImageLayer({
          title: 'temporary',
          id: layerData.layer.id + '-temporary',
          url,
          imageFormat: 'png8',
          sublayers: [
            {
              id,
              visible: true,
              definitionExpression: '1=1',
            },
          ],
        })
        this.layerMap.set(layerData.layer.id + '-temporary', layer)
        view.map.layers.add(layer)
      }
    },
    clear() {
      this.layerMap.forEach((layer) => {
        layer.visible = false
      })
    },
    async queryYDXZ(geo) {
      const view = getMainView()
      const [FeatureLayer] = await getModules(['esri/layers/FeatureLayer'])
      const featureLayer = new FeatureLayer({
        url: window.oneDetection.yzltUrl,
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
      const that = this
      featureLayer.queryFeatures(query).then(function (results) {
        if (results.features.length > 0) {
          that.geometryYDXZ = ''
          for (let i = 0; i < results.features.length; i++) {
            that.geometryYDXZ +=
              results.features[i].attributes['规划用地性质名称']
            if (i + 1 === results.features.length) {
              that.geometryYDXZ += ','
            }
          }
        }
      })
    },

    // 勾选的结果进行汇总
    needQueryList() {
      this.allData = []
      const ckeckedKeys = this.$refs.tree.getCheckedKeys() // 已勾选节点
      // 过滤已勾选的检测指标
      this.schemeCatalogs[0].children.forEach((item) => {
        const param = item.children.filter((element) => {
          element.loading = true
          element.analysis = ''
          element.result = {}
          return ckeckedKeys.includes(element.id)
        })
        this.queryList.push({ displayName: item.displayName, data: param })
        this.allData = [...this.allData, ...param]
      })
      this.resultsContent = JSON.stringify(this.queryList) // 传入到结果页
      if (this.allData.length > 0) {
        this.queryData(this.allData[0])
      }
    },
    queryData(item) {
      if (item.detectControlPlanCategoryItems.length === 0) {
        this.$message.warning('图层检测失败')
        this.queryList.forEach((element) => {
          element.data.forEach((project) => {
            if (project.id === item.id) {
              project.result = {}
              project.analysis = 'fail'
              project.loading = false
            }
          })
        })
        this.resultsContent = JSON.stringify(this.queryList) // 更新结果页
        console.log(1)
        this.queryIndex++
        if (this.queryIndex < this.allData.length) {
          this.queryData(this.allData[this.queryIndex])
        }
        return
      }
      const inputFeatures = { geometry: this.polygonGraphic.geometry }
      const extent = this.polygonGraphic.geometry
      const promiseList = []
      item.detectControlPlanCategoryItems.forEach((res) => {
        switch (item.displayName) {
          case '是否占用耕地':
            promiseList.push(queryFeaturesLand(res, extent, [inputFeatures]))
            break
          case '是否占用永久基本农田':
            promiseList.push(queryFeaturesOccupy(res, extent, [inputFeatures]))
            break
          case '是否占用林地':
            // 检测空间上是否与林地保护范围以及林业资源调查范围重叠，若重叠则视为占用林地，需扣除建设项目使用林地审批已批复范围
            switch (res.displayName) {
              case '建设项目使用林地审批':
                this.getBeyondForest(res, extent, inputFeatures, item)
                break
              default:
                break
            }
            break
          case '是否涉及用海':
            // 检测空间上是否与海岸线重叠，若重叠则视为涉及用海，需扣除海域使用权许可已批复范围
            switch (res.displayName) {
              case '海域使用权许可':
                this.getBeyondSea(res, extent, inputFeatures, item)
                break
              default:
                break
            }
            break
          case '是否涉及新增建设用地':
            promiseList.push(queryFeaturesBeyond(res, extent, [inputFeatures]))
            break
          case '是否占用湿地':
            promiseList.push(
              queryFeaturesGeoAndField(
                res,
                extent,
                [inputFeatures],
                '自然保护区'
              )
            )
            break
          case '是否涉及古树名木':
            promiseList.push(queryFeaturesPoint(res, extent))
            break
          case '是否涉及已供应土地':
            promiseList.push(queryFeaturesOccupy(res, extent, [inputFeatures]))
            break

          case '是否位于城市建设用地范围内':
            promiseList.push(queryFeaturesOccupy(res, extent, [inputFeatures]))
            break
          case '是否位于建设用地管制区范围内':
            switch (res.displayName) {
              case '土地利用用途区':
                promiseList.push(
                  queryFeaturesByStatic(res, extent, '土地用途分区名称', [
                    inputFeatures,
                  ])
                )
                break
              case '建设用地管制区':
                promiseList.push(
                  queryFeaturesByStatic(res, extent, '管制分区名称', [
                    inputFeatures,
                  ])
                )
                break
              default:
                break
            }
            break
          case '控制性详细规划检测':
            switch (res.displayName) {
              case '一张蓝图':
                promiseList.push(
                  queryFeaturesByStatic(res, extent, '规划用地性质名称', [
                    inputFeatures,
                  ])
                )
                break
              case '道路红线':
                promiseList.push(
                  queryFeaturesOccupy('', extent, [inputFeatures])
                )
                break
              case '在编控规范围':
                promiseList.push(
                  queryFeaturesBeyond(res, extent, [inputFeatures])
                )
                break
              default:
                break
            }
            break

          case '是否涉及海洋功能区划':
            promiseList.push(
              queryFeaturesByStatic(res, extent, '功能区类型', [inputFeatures])
            )
            break
          case '是否涉及生态保护红线':
            switch (res.displayName) {
              case '海洋生态红线':
                promiseList.push(
                  queryFeaturesByStatic(res, extent, '类型', [inputFeatures])
                )
                break
              case '陆域生态红线':
                promiseList.push(
                  queryFeaturesOccupy(res, extent, [inputFeatures])
                )
                break
              default:
                promiseList.push(
                  queryFeaturesOccupy('', extent, [inputFeatures])
                )
                break
            }
            break
          case '是否涉及生态控制线':
            promiseList.push(queryFeaturesOccupy(res, extent, [inputFeatures]))
            break
          case '是否涉及国家自然保护区':
            promiseList.push(
              queryFeaturesByStatic(res, extent, '保护区类型', [inputFeatures])
            )
            break
          case '是否涉及厦门国家级海洋公园总体规划':
            promiseList.push(
              queryFeaturesByStatic(res, extent, '区域', [inputFeatures])
            )
            break
          case '是否位于地质灾害易发区':
            promiseList.push(queryFeaturesOccupy(res, extent, [inputFeatures]))
            break
          case '是否涉及轨道收储平衡用地':
            switch (res.displayName) {
              case '轨道平衡用地':
                promiseList.push(
                  queryFeaturesGeoAndField(
                    res,
                    extent,
                    [inputFeatures],
                    '规划用途'
                  )
                )
                break
              case '轨道收储范围':
                promiseList.push(
                  queryFeaturesOccupy(res, extent, [inputFeatures])
                )
                break
              default:
                break
            }

            break
          case '是否涉及文物保护范围':
            promiseList.push(queryFeaturesOccupy(res, extent, [inputFeatures]))
            break
          case '是否涉及气象探测环境保护规划要求':
            promiseList.push(queryFeaturesWeather(res, extent))
            break
          case '是否位于风景名胜区内':
            promiseList.push(
              queryFeaturesByStatic(res, extent, '用地性质名称', [
                inputFeatures,
              ])
            )
            break
          case '是否涉及轨道保护线':
            promiseList.push(queryFeaturesOccupy(res, extent, [inputFeatures]))
            break
          case '是否涉及铁路安全保护区':
            promiseList.push(queryFeaturesOccupy(res, extent, [inputFeatures]))
            break
          case '是否涉及河道水系生态蓝线保护范围':
            switch (res.displayName) {
              case '原水管线':
                promiseList.push(
                  queryFeaturesOccupy(res, extent, [inputFeatures])
                )
                break
              default:
                promiseList.push(
                  queryFeaturesGeoAndField(
                    res,
                    extent,
                    [inputFeatures],
                    '控制类型'
                  )
                )
                break
            }
            break
          case '是否涉及安全控制区域':
            promiseList.push(queryFeaturesOccupy(res, extent, [inputFeatures]))
            break
          case '是否位于工业控制线内':
            promiseList.push(queryFeaturesOccupy(res, extent, [inputFeatures]))
            break
          case '是否位于特别控制区':
            promiseList.push(queryFeaturesOccupy(res, extent, [inputFeatures]))
            break
        }
        console.log(res.displayName)
      })
      this.queryPromiseAll(promiseList, item)
    },
    queryPromiseAll(promiseList, item) {
      if (promiseList.length === 0) {
        return
      }
      Promise.all(promiseList).then((result) => {
        this.dealData(result, item)
      })
    },
    dealData(result, item) {
      this.queryList.forEach((element) => {
        element.data.forEach((project) => {
          if (project.id === item.id) {
            project.result = result
            project.analysis = 'success'
            project.loading = false
          }

        })
      })
      this.resultsContent = JSON.stringify(this.queryList) // 更新结果页
      this.queryIndex++
      if (this.queryIndex < this.allData.length) {
        this.queryData(this.allData[this.queryIndex])
      }
    },
    // 先获取除去审批用林的，再去算压盖
    getBeyondForest(res, extent, inputFeatures, item) {
      try {
        queryFeaturesBeyond(res, extent, [inputFeatures]).then((result) => {
          const inputGeo = result.analysisResult
          if (inputGeo) {
            const inputExtent = inputGeo.extent
            const promiseList = []
            item.detectControlPlanCategoryItems.forEach((item) => {
              const displayName = item.displayName
              if (displayName === '林地保护等级范围与分类') {
                promiseList.push(
                  queryFeaturesByStatic(item, inputExtent, 'BH_DJ', [
                    inputFeatures,
                  ])
                )
              } else if (displayName !== '建设项目使用林地审批') {
                promiseList.push(
                  queryFeaturesOccupy(item, inputExtent, [inputFeatures])
                )
              } else {
                promiseList.push(
                  queryFeaturesOccupy('', inputExtent, [inputFeatures])
                )
              }
            })
            this.queryPromiseAll(promiseList, item)
          } else {
            this.dealData(result, item)
          }
        })
      } catch (error) {
        console.log(error)
      }
    },
    // 先获取除去审批用海的，再去算压盖
    getBeyondSea(res, extent, inputFeatures, item) {
      try {
        queryFeaturesBeyond(res, extent, [inputFeatures]).then((result) => {
          const inputGeo = result.analysisResult
          if (inputGeo) {
            const inputExtent = inputGeo.extent
            const promiseList = []
            item.detectControlPlanCategoryItems.forEach((item) => {
              promiseList.push(
                queryFeaturesOccupy(item, inputExtent, [inputFeatures])
              )
            })
            this.queryPromiseAll(promiseList, item)
          } else {
            this.dealData(result, item)
          }
        })
      } catch (error) {
        console.log(error)
      }
    },
    setGeometryCenter() {
      const view = getMainView()
        view.extent = changeExtent(this.polygonGraphic.geometry.extent.clone())
    },
    handleNodeClick() {},
    closeLayer() {
      if (config.temporaryLayer) {
        const map = getMainMap()
        map.layers.remove(config.temporaryLayer)
        config.temporaryLayer = null
      }
    },
  },
}
</script>
<style lang="scss" scoped>
/deep/ .el-dialog__body {
  padding: 0 20px 20px;
}
.upload-demo {
  width: 100%;
}
.el-upload {
  width: 100%;
}
.btn-start {
  border-radius: 8px;
  border: 0px;
  :hover {
    font-weight: bolder;
    color: #1696ef;
  }
}
.btn-select {
  font-weight: 600;
  color: #1696ef;
}
.btn-search {
  font-size: 14px;
  border-radius: 8px;
  margin-top: 10px;
}
.panel-item {
  background: white;
  border: 0px;
  border-radius: 8px;
  padding: 10px;
  margin-bottom: 10px;
}
.row-box {
  height: 32px;
  margin-bottom: 5px;
  .row-box-left {
    line-height: 32px;
    padding-left: 10px;
    text-align: right;
  }
  .row-box-right {
    padding-left: 10px;
    padding-top: 2px;
  }
}
.form-btn {
  height: 32px;
  line-height: 2px;
  font-size: 14px;
  background: #cfe5ff;
  width: 100%;
  border-radius: 4px;
  cursor: pointer;
  text-align: center;
}
.btn-upload {
  width: 100px;
}
.btn-clear {
  height: 28px;
  line-height: 2px;
  font-size: 14px;
  background: #c0bdbd;
  border: 1px solid #c0bdbd;
  color: #fff;
  border-radius: 4px;
  cursor: pointer;
  text-align: center;
  width: 130px;
}
.schemeTitle {
  background-color: #1696ef;
  color: #fff;
  font-size: 14px;
  padding-left: 10px;
  margin-bottom: 5px;
  border-radius: 4px;
}
.activeTitle {
  background-color: #1696ef !important;
  color: #fff;
  font-size: 14px;
  line-height: 20px;
}
.itemTitle {
  background-color: rgba(132, 176, 212, 1);
  cursor: pointer;
  color: #ffffff;
  font-size: 14px;
  border-radius: 4px;
  font-weight: bold;
  line-height: 20px;
}
.featureTitle {
  margin-left: 10px;
  background-color: #1696ef;
  color: white;
  text-align: center;
  border-radius: 4px;
  font-size: 14px;
}
.featureItem {
  margin-left: 10px;
  margin-top: 3px;
  background-color: rgba(39, 87, 165, 0.17);
  text-align: center;
  cursor: pointer;
  font-size: 14px;
  font-weight: bold;
}
.content-panel {
  background-color: rgba(255, 255, 255, 0.65);
  height: 350px;
  padding: 10px;
  border-bottom: 1px solid #e5ebfc;
}
.title1 {
  margin-left: 10px;
  background-color: #1696ef;
  padding-left: 15px;
  color: white;
  border-radius: 4px;
  font-size: 14px;
}
.title2 {
  margin-left: 10px;
  margin-bottom: 5px;
  padding-left: 15px;
  background-color: rgba(39, 87, 165, 0.17);
  font-size: 14px;
  font-weight: bold;
}
.rowIcon {
  display: flex;
  align-items: center;
  text-align: center;
  i {
    font-size: 20px;
  }
}
.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.tree-label {
  font-size: 14px;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}
.detailLayer {
  position: fixed;
  right: 505px;
  top: 162px;
  width: 1020px;
}
/deep/.el-button--small,
.el-button--small.is-round {
  padding: 9px 12px;
}
/deep/.el-upload {
  width: 100%;
}
/deep/ .el-scrollbar__wrap {
  overflow: auto;
}
</style>
