<template>
  <div
    v-loading="uploadState"
    :element-loading-text="uploadStateTitle"
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(255, 255, 255, 0.8)"
  >
    <el-row class="panel-item">
      <el-row style="font-size: 14px">
        <i
          class="iconmodule iconfont"
          style="color: #3977f4; margin-right: 5px"
        />检测范围
      </el-row>
      <el-row style="font-size: 14px">
        <el-row class="row-box" style="margin: 10px 0">
          <el-col :span="7" class="row-box-left">外部导入 : </el-col>
          <el-col :span="17" class="row-box-right">
            <el-row :gutter="10" style="margin-bottom: 5px" type="flex">
              <el-col :span="8">
                <el-upload
                  ref="upload"
                  :show-file-list="false"
                  :auto-upload="true"
                  :before-upload="selectFile"
                  :on-success="handleShpSuccess"
                  :on-remove="handleFileRemove"
                  class="upload-demo"
                  accept=".zip,.rar"
                  action="/GisApi/services/app/Gis/ParseShapeFile"
                >
                  <el-button class="form-btn btn-start" size="small"
                    >shape文件</el-button
                  >
                </el-upload>
              </el-col>
              <el-col :span="8">
                <el-upload
                  ref="upload"
                  :show-file-list="false"
                  :auto-upload="true"
                  :before-upload="selectFile"
                  :on-success="handleMDBSuccess"
                  :on-remove="handleFileRemove"
                  class="upload-demo"
                  accept=".mdb"
                  action="/GisApi/services/app/Gis/ParseMDBFile"
                >
                  <el-button
                    class="form-btn btn-start"
                    size="small"
                    style="background: #cfe5ff"
                    >mdb文件</el-button
                  >
                </el-upload>
              </el-col>
            </el-row>
          </el-col>
        </el-row>
      </el-row>
      <el-row style="font-size: 14px">
        <el-row class="row-box row-box-bottom">
          <el-col :span="7" class="row-box-left">图层列表 : </el-col>
          <el-col :span="17" class="row-box-right">
            <el-select
              v-model="featuresName"
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
                :label="feature.name + '(' + feature.features.length + '块)'"
                :value="feature.name"
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
                :render-after-expand="false"
                :props="defaultProps"
                :default-expand-all="true"
                node-key="id"
                show-checkbox
                @check-change="handleCheckChange"
              >
                <span
                  slot-scope="{ node }"
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
                    >{{ node.label }}</span
                  >
                </span>
              </el-tree>
            </el-scrollbar>
          </el-col>
        </el-row>
      </el-row>
    </el-row>
    <el-row :gutter="10" style="margin-bottom: 16px">
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
      <el-col :span="12">
        <el-button
          size="small"
          class="btn-search form-btn"
          style="background: #fc7146; color: #fff"
          title="预览"
          @click="openPanel"
          >预览数据</el-button
        >
      </el-col>
      <el-col :span="12">
        <el-button
          size="small"
          class="btn-search form-btn"
          title="导出"
          @click="exportTable"
          >导出EXCEL</el-button
        >
      </el-col>
    </el-row>
    <el-row class="panel-item"
      ><el-row style="font-size: 14px">
        <i
          class="iconmodule iconfont"
          style="color: #3977f4; margin-right: 5px"
        />检测进度：{{ currentFeatureName }}</el-row
      ><el-col
        ><el-progress
          :stroke-width="20"
          :percentage="
            queryIndex === 0
              ? queryIndex
              : ((queryIndex / allData.length) * 100).toFixed(2)
          "
        ></el-progress></el-col
    ></el-row>
    <base-panel
      v-if="registerVisible"
      class="detailLayer"
      @close="registerVisible = false"
    >
      <div slot="header" class="panel-header">批量检测结果</div>
      <div slot="content">
        <el-table
          :data="tableData"
          :height="500"
          align="center"
          @row-click="handleClick"
        >
          <el-table-column
            type="index"
            label="序号"
            width="50"
            align="center"
          ></el-table-column>
          <el-table-column
            v-for="column in selectColums"
            :key="column.value"
            :prop="column.prop"
            :label="column.label"
            align="center"
          >
          </el-table-column>
        </el-table>
        <el-table
          v-show="false"
          id="batchInspectionTable"
          :data="featuresList"
          align="center"
        >
          <el-table-column
            type="index"
            label="序号"
            width="50"
            align="center"
          ></el-table-column>
          <el-table-column
            v-for="column in selectColums"
            :key="column.value"
            :prop="column.prop"
            :label="column.label"
            align="center"
          >
          </el-table-column>
        </el-table>
        <el-pagination
          :total="featuresList.length"
          :layout="layout"
          :current-page.sync="currentPage"
          :page-size.sync="pageSize"
          :pager-count="7"
          small
          background
          style="text-align: center; margin-top: 10px"
          @current-change="handleCurrentChange"
        />
      </div>
    </base-panel>
  </div>
</template>
<script>
// import XLSX from 'xlsx'
import FileSaver from 'file-saver'
import {
  queryFeaturesOccupyByEvery,
  queryFeaturesBeyond,
} from '~/modules/esriDetection'
import config from '~/modules/appConfig'
import { getMainView } from '@/modules/arcgisAPI'
// import { changeExtent, getMainView } from '~/modules/esriCommand'
import basePanel from '@/components/templates/templatePanels.vue'
// import { getControlLineCatalog } from '~/modules/service'
export default {
  name: 'COneDetection',
  components: {
    basePanel,
  },
  data() {
    return {
      defaultProps: {
        children: 'children',
        label: 'displayName',
      },
      uploadState: false,
      uploadStateTitle: '正在解析数据...',
      indicatorCatalogs: [],
      schemeCatalogs: [],
      uploadFile: null,
      shpFile: null,
      featuresName: '',
      inputFileFeaure: [],
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
      allData: [], // 将数据扁平化
      selectLayers: [],
      queryIndex: 0, // 请求的次数
      resultsContent: '', // 传入结果页的格式
      templateData: [], // 临时字段
      schemeMap: new Map(), //  方案存储
      graphicArr: [],
      currentFeatureName: '',
      list: [],
      featuresLis: [],
      tableData: [],
      currentPage: 1,
      pageSize: 10,
      layout: 'total, prev, pager, next, jumper',
      registerVisible: false,
      columns: [],
      selectColums: [],
      dkfw: null,
    }
  },
  mounted() {
    this.columns = window.oneDetection.catalog
    this.clearVisible()
    this.getControlLineCatalog()
  },
  beforeDestroy() {},
  methods: {
    getControlLineCatalog() {
      if (this.schemeCatalogs.lenth > 0) return
      const nodeId = window.oneDetection.BatchInspectionCatalogName
      console.log(
        '%c [ nodeId ]-334',
        'font-size:13px; background:pink; color:#bf2c9f;',
        nodeId
      )
      //   getControlLineCatalog(nodeId, (res) => {
      //     if (res.children) {
      //       res.displayName = '全选'
      //       this.schemeCatalogs = [res]
      //     } else {
      //       console.log('获取批量检测方案失败')
      //     }
      //   })
    },
    clearVisible() {
      this.columns.forEach((item) => {
        item.visible = false
      })
    },
    selectFile(file) {
      this.inputFileFeaure = []
      this.featuresName = ''
      if (file) {
        this.uploadStateTitle = '正在解析数据...'
        this.uploadState = true
        return true
      }
    },
    handleFileRemove(err) {
      this.$message.error('文件上传失败')
      this.uploadState = false
      console.log(err)
    },
    handleMDBSuccess(response) {
      try {
        if (response.success) {
          const inputFileFeaure = []
          const result = response.result
          Object.keys(response.result).forEach((item) => {
            Object.keys(result[item]).forEach((layer) => {
              const layerData = result[item][layer]
              const a = { name: layer, features: layerData }
              inputFileFeaure.push(a)
            })
          })
          this.inputFileFeaure = inputFileFeaure
          this.isShape = false
        } else {
          this.$message.error('文件解析错误')
        }
      } catch (error) {
        this.$message.error('文件解析错误')
        console.log(error)
      }
      this.uploadState = false
    },
    handleShpSuccess(response) {
      try {
        if (response.success) {
          const result = JSON.parse(response.result)
          const arr = []
          for (const item of result) {
            arr.push({ name: item.filename, features: item.features })
          }
          this.inputFileFeaure = arr
        } else {
          this.$message.error('文件解析错误')
        }
      } catch (error) {
        this.$message.error('文件解析错误')
        console.log(error)
      }
      this.uploadState = false
    },
    clearGeometry() {
      const view = config.getMainView()
      view.graphics.removeAll()
    },
    changeSelectGeo() {
      try {
        const view = config.getMainView()
        const spatialReference = view.spatialReference
        view.graphics.removeAll()
        let polygon = null
        this.list = []
        for (const item of this.inputFileFeaure) {
          if (item.name === this.featuresName) {
            this.list = item.features
          }
        }
        this.graphicArr = []
        this.list.forEach((item, index) => {
          const title = item.attributes['地块编号']
            ? item.attributes['地块编号']
            : index
          if (item.geometry.coordinates) {
            polygon = new config.esriConstructors.Polygon({
              rings: item.geometry.coordinates,
              spatialReference,
              title,
            })
          } else {
            polygon = new config.esriConstructors.Polygon({
              rings: item.geometry.rings,
              spatialReference,
              title,
            })
          }
          this.graphicArr.push(polygon)
        })
        const allPolygons = config.esriConstructors.geometryEngine.union(
          this.graphicArr
        )
        this.polygonGraphic = new config.esriConstructors.Graphic({
          geometry: allPolygons,
          symbol: this.fillSymbol,
        })
        view.graphics.add(this.polygonGraphic)
      } catch (error) {
        console.log(error)
        this.$message.error(error)
      }
    },
    handleClick(row) {
      try {
        const view = getMainView()
        const polygon = new config.esriConstructors.Polygon({
          rings: row.geometry.rings,
          spatialReference: view.spatialReference,
        })
        const fillSymbol = {
          type: 'simple-fill',
          color: [227, 139, 79, 0.8],
          outline: {
            color: [0, 0, 0],
            width: 2,
          },
        }
        const graphic = new config.esriConstructors.Graphic({
          geometry: polygon,
          symbol: fillSymbol,
          id: new Date().getTime(),
        })
        if (this.dkfw) {
          view.graphics.remove(this.dkfw)
        }
        view.graphics.add(graphic)
        this.dkfw = graphic
        // view.extent = changeExtent(polygon.extent.clone())
      } catch (error) {
        console.log(error)
      }
    },
    reset() {
      this.inputFileFeaure = []
      const view = config.getMainView()
      view.graphics.removeAll()
      this.polygonGraphic = null
      this.$refs.tree.setCheckedKeys([])
    },
    showTemporaryLayer(layerData) {
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
        const layer = new config.esriConstructors.MapImageLayer({
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
    doAnalysis() {
      if (!this.polygonGraphic) {
        this.$message('请导入数据或者选择图层列表')
        return
      }
      this.uploadStateTitle = '正在进行分析...'
      this.queryIndex = 0
      this.showResult = true
      this.setGeometryCenter()
      this.needQueryList()
    },
    // 勾选的结果进行汇总
    needQueryList() {
      try {
        this.allData = []
        this.clearVisible()
        this.featuresList = JSON.parse(JSON.stringify(this.list))
        const ckeckedKeys = this.$refs.tree.getCheckedKeys() // 已勾选节点
        const selectNode = this.$refs.tree.getCheckedNodes(true)
        this.selectLayers = selectNode.map((item) => item.displayName)
        this.allData = this.schemeCatalogs[0].children.filter((element) => {
          if (ckeckedKeys.includes(element.id)) {
            element.loading = true
            element.analysis = ''
            element.result = {}
            return ckeckedKeys.includes(element.id)
          }
        })
        if (this.allData.length > 0) {
          this.queryData(this.allData[0])
        }
      } catch (error) {
        console.log(error)
        this.$message.warning(error)
      }
    },
    queryData(item) {
      if (item.detectControlPlanCategoryItems.length === 0) {
        this.$message.warning(item.displayName + '未配置检测图层')
        item.result = {}
        item.analysis = 'fail'
        item.loading = false
        this.queryIndex++
        if (this.queryIndex < this.allData.length) {
          this.queryData(this.allData[this.queryIndex])
        }
        return
      }
      this.currentFeatureName = '正在检测' + item.displayName
      const inputFeatures = { geometry: this.polygonGraphic.geometry }
      const extent = this.polygonGraphic.geometry
      const promiseList = []
      item.detectControlPlanCategoryItems.forEach((res) => {
        try {
          switch (item.displayName) {
            case '一张蓝图':
              promiseList.push(
                queryFeaturesOccupyByEvery(
                  res,
                  extent,
                  this.featuresList,
                  item.displayName,
                  'getAttributes'
                )
              )
              break
            case '是否涉及耕地':
              promiseList.push(
                queryFeaturesOccupyByEvery(
                  res,
                  extent,
                  this.featuresList,
                  item.displayName,
                  'isOppcupy'
                )
              )
              break
            case '是否涉及林地':
              // 检测空间上是否与林地保护范围以及林业资源调查范围重叠，若重叠则视为占用林地，需扣除建设项目使用林地审批已批复范围
              switch (res.displayName) {
                case '建设项目使用林地审批':
                  this.getBeyondForest(res, extent, inputFeatures, item)
                  break
                default:
                  break
              }
              break
            case '用海情况':
              // 检测空间上是否与海岸线重叠，若重叠则视为涉及用海，需扣除海域使用权许可已批复范围
              switch (res.displayName) {
                case '海域使用权许可':
                  this.getBeyondSea(res, extent, inputFeatures, item)
                  break
                default:
                  break
              }
              break
            case '是否符合总规':
              promiseList.push(
                queryFeaturesOccupyByEvery(
                  res,
                  extent,
                  this.featuresList,
                  item.displayName,
                  'isOppcupyOrContain'
                )
              )
              break
            case '是否符合土规':
              promiseList.push(
                queryFeaturesOccupyByEvery(
                  res,
                  extent,
                  this.featuresList,
                  item.displayName,
                  'getAttributes'
                )
              )
              break
            case '农转用情况':
              promiseList.push(
                queryFeaturesOccupyByEvery(
                  res,
                  extent,
                  this.featuresList,
                  item.displayName,
                  'getIntersect'
                )
              )
              break
            case '是否涉及安全控制区':
              promiseList.push(
                queryFeaturesOccupyByEvery(
                  res,
                  extent,
                  this.featuresList,
                  item.displayName,
                  'isOppcupy'
                )
              )
              break
            case '是否涉及文物保护':
              promiseList.push(
                queryFeaturesOccupyByEvery(
                  res,
                  extent,
                  this.featuresList,
                  item.displayName,
                  'isOppcupy'
                )
              )
              break
            case '收储情况':
              promiseList.push(
                queryFeaturesOccupyByEvery(
                  res,
                  extent,
                  this.featuresList,
                  item.displayName,
                  'isOppcupy'
                )
              )
              break
            case '是否有控规依据':
              promiseList.push(
                +queryFeaturesOccupyByEvery(
                  res,
                  extent,
                  this.featuresList,
                  item.displayName,
                  'isOppcupy'
                )
              )
              break
          }
        } catch (error) {
          console.log(error)
        }
      })
      this.queryPromiseAll(promiseList)
    },
    queryPromiseAll(promiseList) {
      if (promiseList.length === 0) {
        return
      }
      const that = this
      Promise.all(promiseList).then((result) => {
        console.log(result)
        this.queryIndex++
        if (that.queryIndex < that.allData.length) {
          that.queryData(that.allData[that.queryIndex])
        } else {
          that.currentFeatureName = '检测完成'
          this.dealData()
        }
      })
    },
    handleCheckChange(data, checked) {
      if (data.displayName === '是否有控规依据' && checked) {
        this.$refs.tree.setChecked('3a027fa6-92d8-8cf2-2eeb-fac8bc8e6422', true)
      }
    },
    // 处理压盖面积数据
    dealData() {
      this.featuresList.forEach((item) => {
        // 地块编号
        try {
          const id = '地块编号'
          const attributes = item.attributes
          item.ID = attributes[id]
          this.setColumns(id)
        } catch (error) {
          console.log(error)
          console.log('地块编号出错', item)
          item.ID = '地块编号出错'
        }
        // 一张蓝图
        try {
          if (this.selectLayers.includes('一张蓝图')) {
            this.setColumns('容积率上限')
            this.setColumns('容积率下限')
            this.setColumns('建筑高度上限')
            this.setColumns('建筑高度下限')
            if (item['一张蓝图'] && item['一张蓝图'].attributes) {
              const layerAttributes = item['一张蓝图'].attributes
              item.type = this.getField(layerAttributes, '', '规划用地性质名称') // 规划用地性质
              item.plotRatioMax = this.getField(
                layerAttributes,
                '',
                '容积率上限'
              ) // 容积率上限
              item.plotRatioMin = this.getField(
                layerAttributes,
                '',
                '容积率下限'
              ) // 容积率下限
              item.buildingHeightMax = this.getField(
                layerAttributes,
                '',
                '建筑高度上限'
              ) // 建筑高度上限
              item.buildingHeightMin = this.getField(
                layerAttributes,
                '',
                '建筑高度下限'
              ) // 建筑高度下限
            } else {
              item.type = '不涉及'
              item.plotRatioMax = '不涉及'
              item.plotRatioMin = '不涉及'
              item.buildingHeightMax = '不涉及'
              item.buildingHeightMin = '不涉及'
            }
          }
        } catch (error) {
          console.log(error)
          item.type = '出错'
          item.plotRatioMax = '出错'
          item.plotRatioMin = '出错'
          item.buildingHeightMax = '出错'
          item.buildingHeightMin = '出错'
        }
        // 是否涉及耕地
        try {
          if (this.selectLayers.includes('是否涉及耕地')) {
            this.setColumns('是否涉及耕地')
            item.plowland = item['是否涉及耕地'] ? '涉及' : '不涉及'
          }
        } catch (error) {
          item.plowland = '出错'
        }
        // 是否涉及林地
        try {
          if (this.selectLayers.includes('是否涉及林地')) {
            this.setColumns('是否涉及林地')
            let isOppcupyForest = false
            for (const key in item) {
              if (key.includes('林')) {
                isOppcupyForest = true
                break
              }
            }
            item.forest = isOppcupyForest ? '涉及' : '不涉及'
          }
        } catch (error) {
          console.log(error)
          item.forest = '出错'
        }
        // 用海情况
        try {
          if (this.selectLayers.includes('用海情况')) {
            this.setColumns('用海情况')
            let isOppcupySea = false
            for (const key in item) {
              if (key.includes('海')) {
                isOppcupySea = true
                break
              }
            }
            item.sea = isOppcupySea ? '涉及' : '不涉及'
          }
        } catch (error) {
          console.log(error)
          item.sea = '出错'
        }
        //   是否符合总规
        try {
          if (this.selectLayers.includes('是否符合总规')) {
            this.setColumns('是否符合总规')
            let str = ''
            if (item['是否符合总规'] && item['是否符合总规'].occupy) {
              str = '部分位于开发边界外'
              if (item['是否符合总规'].contain) {
                str = '位于开发边界内'
              }
            } else {
              str = '位于开发边界外'
            }
            item.comprehensivePlanning = str
          }
        } catch (error) {
          console.log(error)
          item.comprehensivePlanning = '出错'
        }
        // 是否符合土规
        try {
          if (this.selectLayers.includes('是否符合土规')) {
            this.setColumns('是否符合土规')
            const landPlanning = item['是否符合土规']
            if (landPlanning && landPlanning.attributes) {
              item.landPlanning = this.getField(
                landPlanning.attributes,
                '位于',
                '管制分区名称'
              )
            } else {
              item.landPlanning = '不涉及'
            }
          }
        } catch (error) {
          item.landPlanning = '出错'
        }
        // 农转用情况
        try {
          if (this.selectLayers.includes('农转用情况')) {
            this.setColumns('农转用情况')
            const farm = item['农转用情况']
            if (farm && farm.geometry) {
              const proportion = this.getFarmGeoMsg(
                item.geometry,
                farm.geometry
              )
              if (proportion >= 1) {
                item.farm = '已农转用'
              } else if (proportion >= 0.75) {
                item.farm = '未农转用面积小于等于四分之一'
              } else {
                item.farm = '未农转用面积超过四分之一'
              }
            } else {
              item.farm = '不涉及'
            }
          }
        } catch (error) {
          item.farm = '出错'
        }
        // 是否涉及安全控制区
        try {
          if (this.selectLayers.includes('是否涉及安全控制区')) {
            this.setColumns('是否涉及安全控制区')
            item.safetyZone = item['是否涉及安全控制区'] ? '涉及' : '不涉及'
          }
        } catch (error) {
          item.safetyZone = '出错'
        }
        // 是否涉及文物保护
        try {
          if (this.selectLayers.includes('是否涉及文物保护')) {
            this.setColumns('是否涉及文物保护')
            let isOccpyCulturalRelic = false
            for (const key in item) {
              if (key.includes('文物')) {
                isOccpyCulturalRelic = true
                break
              }
            }
            item.culturalRelic = isOccpyCulturalRelic ? '涉及' : '不涉及'
          }
        } catch (error) {
          item.culturalRelic = '出错'
        }

        // 收储情况
        try {
          if (this.selectLayers.includes('收储情况')) {
            this.setColumns('收储情况')
            item.stockpile = item['收储情况'] ? '涉及' : '不涉及'
          }
        } catch (error) {
          item.stockpile = '出错'
        }
        // 是否有控规依据
        try {
          if (this.selectLayers.includes('是否有控规依据')) {
            this.setColumns('是否有控规依据')
            let controlPlanningStr = ''
            controlPlanningStr += item['是否有控规依据'] ? '控规在编' : ''
            if (!item['一张蓝图']) {
              if (controlPlanningStr.length === 0) {
                controlPlanningStr = '一张蓝图未覆盖'
              } else {
                controlPlanningStr += ' 一张蓝图未覆盖'
              }
            }
            item.controlPlanning = controlPlanningStr
          }
        } catch (error) {
          item.stockpile = '出错'
        }
      })
      console.log(this.featuresList)
      this.createColumns()
      this.openPanel()
    },
    openPanel() {
      if (this.allData.length === 0) {
        return this.$message.warning('请先检测')
      }
      this.currentPage = 1
      this.handleCurrentChange()
      this.$nextTick(() => {
        this.registerVisible = true
      })
    },
    createColumns() {
      const newArr = []
      this.columns.forEach((item) => {
        if (item.visible) {
          newArr.push(item)
        }
      })
      this.selectColums = newArr
    },
    setColumns(name) {
      for (const item of this.columns) {
        if (item.value === name) {
          item.visible = true
        }
      }
    },
    // 计算压盖面积占比
    getFarmGeoMsg(geometry, inGeo) {
      const AllInGeo = config.esriConstructors.geometryEngine.union(inGeo)
      const geoArea = config.esriConstructors.geometryEngine.planarArea(
        geometry,
        'square-meters'
      )
      const AllGeoArea = config.esriConstructors.geometryEngine.planarArea(
        AllInGeo,
        'square-meters'
      )
      return geoArea / AllGeoArea
    },
    // 获取字段，把属性的字段拼成数组取出来
    getField(attributes, fieldStr, fields) {
      const fieldMap = new Map()
      for (const item of attributes) {
        const fieldValue = fieldMap.get(item[fields])
        if (!fieldValue && item[fields]) {
          fieldMap.set(item[fields], item[fields])
        }
      }
      for (const item of fieldMap) {
        fieldStr += item[1] + '，'
      }
      fieldStr = fieldStr.substring(0, fieldStr.length - 1)
      return fieldStr
    },
    // 先获取除去审批用林的，再去算压盖
    getBeyondForest(res, extent, inputFeatures, item) {
      try {
        queryFeaturesBeyond(res, extent, [inputFeatures]).then((result) => {
          const inputGeo = result.analysisResult
          const inputExtent = inputGeo
          const promiseList = []
          item.detectControlPlanCategoryItems.forEach((categoryItem) => {
            const displayName = categoryItem.displayName
            if (displayName === '林地保护等级范围与分类') {
              promiseList.push(
                queryFeaturesOccupyByEvery(
                  res,
                  inputExtent,
                  this.featuresList,
                  displayName,
                  'isOppcupy'
                )
              )
            } else if (displayName !== '建设项目使用林地审批') {
              promiseList.push(
                queryFeaturesOccupyByEvery(
                  res,
                  inputExtent,
                  this.featuresList,
                  displayName,
                  'isOppcupy'
                )
              )
            }
          })
          this.queryPromiseAll(promiseList, item)
        })
      } catch (error) {}
    },
    // 先获取除去审批用海的，再去算压盖
    getBeyondSea(res, extent, inputFeatures, item) {
      try {
        queryFeaturesBeyond(res, extent, [inputFeatures]).then((result) => {
          const inputExtent = result.analysisResult
          const promiseList = []
          item.detectControlPlanCategoryItems.forEach((categoryItem) => {
            const displayName = categoryItem.displayName
            promiseList.push(
              queryFeaturesOccupyByEvery(
                res,
                inputExtent,
                this.featuresList,
                displayName,
                'isOppcupy'
              )
            )
          })
          this.queryPromiseAll(promiseList, item)
        })
      } catch (error) {
        console.log(error)
      }
    },
    exportTable() {
      if (this.tableData.length === 0) {
        return this.$message.warning('请先检测')
      }
      this.uploadState = true
      //   const wb = XLSX.utils.table_to_book(
      //     document.querySelector('#batchInspectionTable')
      //   )
      //   const wbout = XLSX.write(wb, {
      //     bookType: 'xlsx',
      //     bookSST: true,
      //     type: 'array',
      //   })
      try {
        FileSaver.saveAs(
          new Blob([wbout], { type: 'application/octet-stream' }),
          '批量检测结果.xlsx'
        )
        this.uploadState = false
      } catch (e) {
        if (typeof console !== 'undefined') console.log(e, wbout)
        this.uploadState = false
      }
      return wbout
    },
    setGeometryCenter() {
      const view = getMainView()
      //   view.extent = changeExtent(this.polygonGraphic.geometry.extent.clone())
    },
    handleCurrentChange() {
      const start =
        (this.currentPage - 1) * this.pageSize === this.featuresList.length
          ? 0
          : (this.currentPage - 1) * this.pageSize
      const end =
        this.currentPage * this.pageSize <= this.featuresList.length
          ? this.currentPage * this.pageSize
          : this.featuresList.length
      this.tableData = this.featuresList.slice(start, end)
    },
  },
}
</script>
<style lang="scss" scoped>
/deep/.el-progress__text {
  font-size: 14px !important;
  padding-left: 20px;
}
/deep/ .el-dialog__body {
  padding: 0 20px 20px;
}
/deep/ .el-progress-bar {
  margin-right: -69px;
  width: 95%;
}
/deep/ .el-table th {
  background: #ade3fe;
  text-align: center;
  color: #333;
}
/deep/.el-table--enable-row-transition .el-table__body td {
  text-align: center;
}
/deep/.el-table tr:nth-child(even) {
  background: #e2f0fd;
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
  width: calc(100vw - 588px);
}
</style>
