<template>
  <div>
    <el-row class="top-tool" type="flex" justify="end">
      <!-- <districtStreetComponent /> -->
      <!-- <baseMapSwitch @handleShowWidget="handleShowWidget" @close="handleReset">
      </baseMapSwitch> -->
      <el-col style="width: 104px; margin: 0 5px">
        <el-button
          :disabled="switchDisabled"
          class="toolTextBtn"
          @click="handleSwitch3D"
        >
          <i class="iconfont el-iconthird-map-earth" />
          二三维切换
        </el-button>
      </el-col>
      <!-- <el-button class="toolTextBtn" @click="handleShowWidget('Legend')">
        <i class="iconfont el-iconthird-search-attribute" />图例
      </el-button>
      <el-col style="width: 86px; margin: 0 5px">
        <el-button class="toolTextBtn" @click="handleShowWidget('Layers')">
          <i class="iconfont el-iconthird-layer-order" />当前图层
        </el-button>
      </el-col>
      <el-button class="toolTextBtn" @click="handleClearMap">
        <i class="iconfont el-iconthird-zidongqingli" />图层清理
      </el-button> -->
      <!-- <el-select
        v-model="searchType"
        placeholder="请选择查询类型"
        class="searchType"
        style="width: 100px"
        @change="changePlaceholder"
      >
        <el-option label="地名地址" value="1"></el-option>
      </el-select> -->
      <!-- <el-input
        v-model.trim="address"
        :placeholder="placeholder"
        size="small"
        class="thematic-change"
        @keyup.enter.native="selectSearchType"
      >
        <el-button
          slot="append"
          icon="el-icon-search"
          @click="selectSearchType"
        ></el-button> -->
      <!-- </el-input> -->
    </el-row>
    <el-row class="bottom-tool" type="flex" justify="start">
      <el-row
        class="cantainer"
        v-show="!show3DTool"
        style="pointer-events: auto"
      >
        <el-row style="display: flex">
          <el-row
            class="bottom-tool-btn"
            @click.native="handleCommandView('OriginalView')"
          >
            <el-row class="tool-btn-icon">
              <i class="iconfont el-iconthird-map-home"></i>
            </el-row>
            <el-row class="tool-btn-label">回到原点</el-row>
          </el-row>
          <el-row class="bottom-tool-btn" @click.native="handleReset">
            <el-row class="tool-btn-icon">
              <i class="iconfont el-iconthird-map-reset"></i>
            </el-row>
            <el-row class="tool-btn-label">重置</el-row>
          </el-row>
          <el-row
            :class="
              panelType === 'ShotScreen'
                ? 'bottom-tool-btn-active'
                : 'bottom-tool-btn'
            "
            @click.native="handleCommandView('ShotScreen')"
          >
            <el-row class="tool-btn-icon">
              <i class="iconfont el-iconthird-map-camera"></i>
            </el-row>
            <el-row class="tool-btn-label">截图</el-row>
          </el-row>
          <el-row
            class="bottom-tool-btn"
            @mouseenter.native="mouseenter"
            @mouseleave.native="mouseleave"
          >
            <el-row>
              <el-row class="tool-btn-icon">
                <i class="iconfont el-icon-more"></i>
              </el-row>
              <el-row class="tool-btn-label">地图缩放</el-row>
            </el-row>
            <div v-show="showZoomBtn" class="foldPanel">
              <el-row class="bottom-tool-btn" @click.native="handleZoomIn">
                <el-row class="tool-btn-icon">
                  <i class="iconfont el-iconthird-map-enlarge"></i>
                </el-row>
                <el-row class="tool-btn-label">放大</el-row>
              </el-row>
              <el-row class="bottom-tool-btn" @click.native="handleZoomOut">
                <el-row class="tool-btn-icon">
                  <i class="iconfont el-iconthird-map-lessen"></i>
                </el-row>
                <el-row class="tool-btn-label">缩小</el-row>
              </el-row>
            </div>
          </el-row>
          <el-row class="bottom-tool-btn" @click.native="handlePickLocation">
            <el-row class="tool-btn-icon">
              <i class="iconfont el-iconthird-map-location"></i>
            </el-row>
            <el-row class="tool-btn-label">坐标拾取</el-row>
          </el-row>
          <el-row
            :class="
              panelType === 'PickAttribute'
                ? 'bottom-tool-btn-active'
                : 'bottom-tool-btn'
            "
            @click.native="handleShowWidget('PickAttribute')"
          >
            <el-row class="tool-btn-icon">
              <i class="iconfont el-iconthird-search-tag"></i>
            </el-row>
            <el-row class="tool-btn-label">属性拾取</el-row>
          </el-row>
          <el-row
            class="bottom-tool-btn"
            @mouseenter.native="mouseenter1"
            @mouseleave.native="mouseleave1"
          >
            <el-row>
              <el-row class="tool-btn-icon">
                <i class="iconfont el-icon-more"></i>
              </el-row>
              <el-row class="tool-btn-label">量算</el-row>
            </el-row>
            <div class="foldPanel" v-show="showMeasureBtn" style="width: 60px">
              <el-row
                class="bottom-tool-btn"
                @click.native="handleShowWidget('Distance')"
              >
                <el-row class="tool-btn-icon" style="margin-left: 6px">
                  <i class="iconfont el-iconthird-map-enlarge"></i>
                </el-row>
                <el-row class="tool-btn-label">距离量算</el-row>
              </el-row>
              <el-row
                class="bottom-tool-btn"
                @click.native="handleShowWidget('Area')"
              >
                <el-row class="tool-btn-icon" style="margin-left: 6px">
                  <i class="iconfont el-iconthird-map-lessen"></i>
                </el-row>
                <el-row class="tool-btn-label">面积量算</el-row>
              </el-row>
            </div>
          </el-row>
          <el-row
            :class="
              panelType === 'Files'
                ? 'bottom-tool-btn-active'
                : 'bottom-tool-btn'
            "
            style="width: 75px"
            @click.native="handleShowWidget('Files')"
          >
            <el-row class="tool-btn-icon" style="margin-left: 12px">
              <i class="iconfont el-iconthird-layer-loadon"></i>
            </el-row>
            <el-row class="tool-btn-label" style="width: 75px"
              >空间数据加载</el-row
            >
          </el-row>
          <el-row
            :class="
              panelType === 'CoordinatePositioning'
                ? 'bottom-tool-btn-active'
                : 'bottom-tool-btn'
            "
            @click.native="handleShowWidget('CoordinatePositioning')"
          >
            <el-row class="tool-btn-icon">
              <i class="iconfont el-iconthird-measure-area"></i>
            </el-row>
            <el-row class="tool-btn-label">坐标定位</el-row>
          </el-row>
          <el-row
            :class="
              panelType === 'onlineLabel'
                ? 'bottom-tool-btn-active'
                : 'bottom-tool-btn'
            "
            @click.native="handleShowWidget('onlineLabel')"
          >
            <el-row class="tool-btn-icon" style="text-align: center">
              <i class="iconfont el-iconthird-layer-mark" />
            </el-row>
            <el-row class="tool-btn-label">在线标注</el-row>
          </el-row>
          <el-row
            :class="
              showBorderPick ? 'bottom-tool-btn-active' : 'bottom-tool-btn'
            "
            @click.native="setBorderPanel"
          >
            <el-row class="tool-btn-icon" style="text-align: center">
              <i class="iconfont el-iconthird-painting-polygon" />
            </el-row>
            <el-row class="tool-btn-label">边框拾取</el-row>
          </el-row>
        </el-row>
      </el-row>
    </el-row>
    <el-row v-show="showPanel" id="widgetPanel" class="widget-panel">
      <PanelComponent style="width: 320px" @close="handleReset">
        <div
          slot="header"
          :title="panelName"
          class="title-font-word-ellipsis"
          @mousedown="mouseDownRight($event, 'widgetPanel', 140, 20)"
        >
          {{ panelName }}
        </div>
        <div slot="content">
          <ShotScreenComponet
            :showIframeDialod="showIframeDialod"
            v-if="panelType === 'ShotScreen'"
          ></ShotScreenComponet>
        </div>
        <!-- <div slot="content">
          <el-scrollbar style="height: calc(100vh - 300px)">
            <HistoryImage v-show="panelType === 'historyImage'" ref="history" />
            <LegendConponent v-if="panelType === 'Legend'"></LegendConponent>
            <LayersChangeComponent
              v-show="panelType === 'Layers'"
              :panel-type="panelType"
            ></LayersChangeComponent>
            <LoadFileComponent v-if="panelType === 'Files'"></LoadFileComponent>
            <AttributeComponet
              v-show="panelType === 'PickAttribute'"
              ref="Attribute"
              :search-features="searchFeatures"
            ></AttributeComponet>
            <ShotScreenComponet
              v-if="panelType === 'ShotScreen'"
            ></ShotScreenComponet>
            <LocationComponet
              v-if="panelType === 'CoordinatePositioning'"
            ></LocationComponet>
            <CameraComponet
              v-if="panelType === 'SceneAnimation'"
              :animation-data="animationData"
              :scene-data="sceneData"
            ></CameraComponet>
            <EditModelComponet
              v-show="panelType === 'EditModel'"
            ></EditModelComponet>
            <AddressComponet
              v-if="panelType === 'address'"
              :address="address"
            ></AddressComponet>
            <BlankingModel v-if="panelType === 'BlankingModel'"></BlankingModel>
            <PickingModel v-if="panelType === 'PickingModel'" />
            <CAttachment
              v-if="panelType === 'Attachment'"
              :attachment-pipeid="attachmentPipeid"
              :attachment-data="attachmentData"
            /><HandleGraphicComponent
              v-if="panelType === 'onlineLabel'"
            ></HandleGraphicComponent>
            <el-row id="widget-panel-div"></el-row>
          </el-scrollbar>
        </div> -->
      </PanelComponent>
    </el-row>
    <!-- <div id="maskDiv" class="hide screenshotCursor" />
    <panelComponent
      id="iframePanel"
      class="iframePanel"
      v-if="showIframe"
      ref="panel"
      @close="showIframe = false"
    >
      <div
        slot="header"
        title="不动产信息"
        class="title-font-word-ellipsis"
        @mousedown="mouseDownRight($event, 'iframePanel', 140, 20)"
      >
        不动产信息
      </div>
      <div slot="content" style="height: 100%; width: 100%">
        <iframe
          :src="iframeUrl"
          frameborder="0"
          width="100%"
          height="100%"
        ></iframe>
      </div>
    </panelComponent> -->
    <!-- <MapBorderPickComponent v-if="showBorderPick" @close="setBorderPanel" /> -->
    <div id="maskDiv" class="hide screenshotCursor" />
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import ShotScreenComponet from './mapTool/CShotScreen.vue'
import { getMainView } from '~/modules/arcgisAPI'
import { removeLayers } from '@/modules/esriLayer'
import PanelComponent from '@/components/templates/dialogComponent.vue'
import config from '@/modules/appConfig'
import {
  mouseDownRight,
  originalViewCommand,
  screenshotCommand,
  resetCommand
} from '~/modules/esriCommand'

@Component({
  name: 'MapSecond',
  components: { PanelComponent, ShotScreenComponet },
})
export default class extends Vue {
  thematicName = '多规合一控制线' // 专题切换
  address = '' // 地名地址搜索值
  addressData = ''
  requestFullscreen = false // 全屏状态
  shadowEnabled = true // 阴影开关
  demEnabled = true // 高程开关
  showPanel = false // 面板开关
  panelName = '' // 面板标题
  panelType = '' // 面板标识
  basemapPanel = false // 面板底图切换
  baseMapTitle = '电子地图'
  show3DTool = false // 显示3D工具
  sceneData: any = []
  animationData: any = []
  showIframeDialod = true // 弹窗区别样式的唯一值
  switchDisabled = false
  historyPanel = false
  createGDPLayer = false
  specialData: any = null
  searchType = '1'
  showZoomBtn = false
  showMeasureBtn = false
  showBorderPick = false

  get show3D() {
    const that: any = this
    return that.$store.state.oneMap.show3D
  }

  handleShowWidget(name: any) {
    console.log(
      '%c [ name ]-463',
      'font-size:13px; background:pink; color:#bf2c9f;',
      name
    )
  }

  // 重置
  handleReset() {
    this.showPanel = false
    // this.searchFeatures = []
    this.panelType = ''
    if (this.panelName === '图例') {
      removeLayers(config.temporaryLayers)
      config.temporaryLayers = []
    }
    resetCommand()
  }

  // 二三维切换
  handleSwitch3D() {
    this.$store.commit('oneMap/setShow3D', !this.show3D)
    try {
      config.activeView.container = null
      if (config.activeView.type === '2d') {
        config.esriInstance.view3D.container = config.container
        config.activeView = config.esriInstance.view3D
      } else {
        config.esriInstance.view2D.container = config.container
        config.activeView = config.esriInstance.view2D
      }
      if (config.activeView.type === '3d') {
        // eslint-disable-next-line no-eval
        const spatialReference = eval(
          '(' + config.mapInitParam.mapConfig.spatialReference + ')'
        )
        config.activeView.goTo({
          fov: 55,
          heading: 358.2095068902112,
          position: {
            spatialReference,
            type: 'point',
            x: 460078.4333968152,
            y: 2688728.3903136877,
            z: 17086.98559722877,
          },
          tilt: 49.66308082018792,
        })
      }
    } catch (error) {
      console.log(error)
    }
  }

  // 地图清理,关闭所有图层
  handleClearMap() {}

  // changePlaceholder() {
  //   this.address = ''
  //   const num = this.searchType
  //   switch (num) {
  //     case '1':
  //       this.placeholder = '请输入地名地址'
  //       break
  //     case '2':
  //       this.placeholder = '请输入项目名称或地址'
  //       break
  //     default:
  //       break
  //   }
  // }

  // 放大
  handleZoomIn() {
    const view = getMainView()
    if (this.show3D) {
      view.goTo({
        center: view.center,
        zoom: view.zoom + 1,
      })
    } else {
      view.goTo({
        center: view.center,
        scale: view.scale / 2,
      })
    }
  }

  // 缩小
  handleZoomOut() {
    const view = getMainView()
    if (this.show3D) {
      view.goTo({
        center: view.center,
        zoom: view.zoom - 1,
      })
    } else {
      view.goTo({
        center: view.center,
        scale: view.scale * 2,
      })
    }
  }

  // 鼠标拖拽
  mouseDownRight(event: any, id: string, sTop: number, sRight: number) {
    mouseDownRight(event, id, sTop, sRight)
  }

  setBorderPanel() {
    this.showBorderPick = !this.showBorderPick
  }

  // 坐标拾取
  handlePickLocation() {
    this.handleReset()
    // coordinateCommand(true)
  }

  selectSearchType() {
    const num = this.searchType
    switch (num) {
      case '1':
        this.handleShowWidget('address')
        break
      case '2':
        this.handleShowWidget('project')
        break
      default:
        break
    }
  }

  // 模式切换
  handleCommandView(key: string) {
    this.handleReset()
    this.panelType = key
    switch (key) {
      case 'StreetView':
        // streetViewCommand()
        break
      case 'OriginalView':
        originalViewCommand()
        break
      case 'TopView':
        // topViewCommand()
        break
      case 'ShotScreen': // 截图
        this.panelName = '截图'
        this.handleScreenShot()
        break
      default:
        break
    }
    this.showPanel = true
  }

  // 截图
  handleScreenShot() {
    const vm: any = this
    vm.$store.commit('shotScreen/setHeight', '')
    vm.$store.commit('shotScreen/setWidth', '')
    vm.$store.commit('shotScreen/setImgUrl', '')
    screenshotCommand(
      function (screenshot: any) {
        vm.$store.commit('shotScreen/setHeight', screenshot.data.height)
        vm.$store.commit('shotScreen/setWidth', screenshot.data.width)
        vm.$store.commit('shotScreen/setImgUrl', screenshot.dataUrl)
      },
      function () {}
    )
  }

  mouseenter() {
    this.showZoomBtn = true
  }

  mouseleave() {
    this.showZoomBtn = false
  }

  mouseenter1() {
    this.showMeasureBtn = true
  }

  mouseleave1() {
    this.showMeasureBtn = false
  }
}
</script>
<style lang="scss" scoped>
.iframePanel {
  position: absolute;
  width: calc(100vw - 20px);
  height: calc(100vh - 220px);
  top: 118px;
  left: 10px;
}
.thematic-change {
  /* margin-left: 5px; */
  width: 175px;
  height: 33px;
  text-align: center;
  background-color: rgba(8, 27, 79, 0.78);
  color: #fff;
  border: 1px solid #1c6472;
  font-size: 14px;
  border-radius: 4px;
}

#maskDiv {
  position: fixed;
  left: 0;
  top: 0px;
  background: rgba(255, 51, 0, 0.1);
  border: 2px dashed rgb(255, 51, 0);
}
.bottom-tool {
  position: absolute;
  /* left: 100px; */
  bottom: 5px;
  z-index: 100;
  height: 50px;
  /* padding-top: 9px; */
  width: 100%;
  justify-content: center;
  pointer-events: none;
  .cantainer {
    background-color: #09528d;
    padding: 0 16px;
    border-radius: 3px;
  }
  // background: url('../../assets/images/toolbar-bg.png') no-repeat center center;
}
.bottom-tool-btn {
  height: 60px;
  width: 50px;
  cursor: pointer;
  color: white;
  margin-left: 10px;
}
.bottom-tool-btn-active {
  height: 60px;
  width: 50px;
  cursor: pointer;
  color: #3ed4d6;
  margin-left: 10px;
}
.bottom-tool-btn:hover {
  color: #3ed4d6;
}
.tool-btn-label {
  height: 15px;
  width: 50px;
  /* background-color: rgba(00, 00, 00, 0.5); */
  text-align: center;
  font-size: 12px;
}
.tool-btn-icon {
  margin-left: 1px;
  height: 30px;
  width: 48px;
  padding: 6px 16px;
}
.tool-scrollbar {
  background-color: rgba(8, 27, 79, 0.78);
  position: fixed;
  right: 500px;
  top: 163px;
  border: 1px solid #1c6472;
  border-radius: 4px;
  width: 160px;
  height: 240px;
  padding: 7px 0px 0px 16px;
}
.maptool-scrollbar {
  position: fixed;
  right: 665px;
  top: 125px;
  border: 1px solid #1c6472;
  border-radius: 4px;
  width: 110px;
}
.top-tool {
  position: absolute;
  left: 30px;
  top: 30px;
  z-index: 100;
}
.catalog-btn {
  margin-top: -10px;
  height: 50px;
  line-height: 50px;
  width: 131px;
  font-weight: 500;
  text-align: center;
  padding-top: 2px;
  font-size: 14px;
  border-radius: 4px;
  background-color: rosybrown;
  color: #fff;
  cursor: pointer;
  // background: url('../../assets/images/catalog-bg.png') no-repeat center top;
}
.catalog-btn:hover {
  color: #50e9f7;
}
.subject {
  width: 680px;
  position: fixed;
  top: 140px;
  right: 562px;
}
.left-btn {
  position: absolute;
  left: 20px;
  top: 140px;
  z-index: 100;
}
.searchType {
  width: 88px;
  margin-left: 6px;
  height: 33px;
  background-color: rgba(8, 27, 79, 0.78);
  border: 1px solid #1c6472;
  border-radius: 4px;
}
.foldPanel {
  position: relative;
  top: -162px;
  background: #1a2023b0;
  border-radius: 4px;
  .tool-btn-label {
    margin: auto;
  }
  .bottom-tool-btn {
    width: 100%;
    margin: auto;
  }
}
</style>
<style lang="scss">
.top-tool {
  .toolTextBtn {
    height: 33px;
    text-align: center;
    background-color: rgba(8, 27, 79, 0.78);
    border: 1px solid #1c6472;
    padding: 1px 5px;
    border-radius: 4px;
    color: #fff;
    font-size: 14px;
    line-height: 30px;
    cursor: pointer;
  }
  .toolTextBtn i {
    margin-right: 2px;
  }
  .toolTextBtn:hover {
    color: #50e9f7;
    background-color: rgba(8, 27, 79, 0.78);
  }
  .toolTextBtn.is-disabled,
  .toolTextBtn.is-disabled:focus,
  .toolTextBtn.is-disabled:hover {
    color: #fff;
    background-color: rgba(8, 27, 79, 0.78);
    border-top: 1px solid #1c6472;
    border-bottom: 1px solid #1c6472;
    border-left: 1px solid #1c6472;
    border-right: 1px solid #1c6472;
    cursor: not-allowed !important;
  }
  .toolBtnRight {
    padding: 1px 5px;
    margin-left: 0px !important;
    border-top: 1px solid #1c6472;
    border-bottom: 1px solid #1c6472;
    border-right: 1px solid #1c6472;
    border-left: 0px;
    border-bottom-left-radius: 0px;
    border-top-left-radius: 0px;
  }
  .toolBtnLeft {
    padding: 1px 5px;
    border-top: 1px solid #1c6472;
    border-bottom: 1px solid #1c6472;
    border-left: 1px solid #1c6472;
    border-right: 0px;
    border-bottom-right-radius: 0px;
    border-top-right-radius: 0px;
  }
}
.widget-panel {
  z-index: 100;
  right: 20px;
  top: 140px;
  position: fixed;
}
</style>