<template>
  <div class>
    <div id="map" class="mapViewDiv"></div>
    <!-- <toolComponent></toolComponent> -->
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import { init, create2DView, create3DView } from '@/modules/arcgisAPI'
import config from '@/modules/appConfig'
import { get2dMapCatalog, get3dMapCatalog, getMaps } from '~/services/api/map'
// import toolComponent from '@/components/CMapTool.vue'
@Component({
  name: '',
  components: { 
    // toolComponent
   },
})
export default class extends Vue {
  mounted() {
    init()
    this.createView()
  }

  // 创建2d
  createView() {
    this.$store.commit('oneMap/setGlobalLoading', true)
    getMaps().then(() => {
      const base2DMapCategoryId = config.mapInitParam.base2DMapCategoryId
      get2dMapCatalog(base2DMapCategoryId)
        .then((mapConfigData: any) => {
          const tempData: any[] = []
          mapConfigData.children.forEach((item: any) => {
            item.base2DMaps.forEach((ele: any) => {
              ele.parentName = item.displayName
              ele.layerType = ele.mapLayer.layerConfig.layerType
              ele.mapLayer.id = ele.mapLayer.id + '-basemap'
              tempData.push(ele)
            })
            config.basemap2DCatalogs.push(item)
          })
          config.basemap2DLayers = tempData
          this.createSceneView()
          create2DView('map')
          this.$store.commit('oneMap/setGlobalLoading', false)
        })
        .catch((err: any) => {
          console.log('获取地图参数失败', err)
        })
    })
  }

  createSceneView() {
    const base3DMapCategoryId = config.mapInitParam.base3DMapCategoryId
    get3dMapCatalog(base3DMapCategoryId)
      .then((mapConfigData: any) => {
        const temData: any[] = []
        mapConfigData.children.forEach((item: any) => {
          item.base3DMaps.forEach((element: any) => {
            element.parentName = item.displayName
            element.layerType = element.mapLayer.layerConfig.layerType
            element.mapLayer.id = element.mapLayer.id + '3D'
            temData.push(element)
          })
        })
        // console.log("temData",temData);
        config.basemap3DLayers = temData
        create3DView('mapViewDiv')
      })
      .catch((err: any) => {
        console.log(err)
      })
  }
}
</script>
<style scoped lang="scss">
.map-box {
  flex: 1;
}
#map,
.mapViewDiv {
  height: calc(100vh - 0px);
  width: 100%;
  z-index: 2;
  // position: absolute;
  left: 0;
  top: 0;
}

.mapViewDiv-two {
  height: 100vh;
  width: 50%;
  z-index: 2;
  float: left;
}


.el-loading-spinner {
  .el-icon-loading {
    color: #1d5db0;
  }
}

.screenshotCursor {
  cursor: crosshair !important;
}

.zoom-control {
  position: absolute;
  bottom: 19px;
  right: 19px;
  width: 34px;
  height: 103px;
  background-color: #ffffff;
  box-shadow: 1px 1px 5px 0px #eaeaea;
  border-radius: 8px;

  .add {
    position: relative;
    height: 50%;
    width: 100%;
    cursor: pointer;
    &::before {
      position: absolute;
      content: '';
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 16px;
      height: 2px;
      background-color: #999999;
    }

    &::after {
      position: absolute;
      content: '';
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 2px;
      height: 16px;
      background-color: #999999;
    }
  }

  .sub {
    position: relative;
    height: 50%;
    width: 100%;
    cursor: pointer;
    &::before {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      content: '';
      width: 16px;
      height: 2px;
      background-color: #999999;
    }
  }
}
</style>
