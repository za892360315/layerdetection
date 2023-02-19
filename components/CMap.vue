<template>
  <div class>
    <div id="map" class="mapViewDiv"></div>
    <!-- <div class="zoom-control">
      <div class="add" @click="handlerZoom(true)"></div>
      <div class="sub" @click="handlerZoom(false)"></div>
    </div> -->
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import { init, create2DView } from '@/modules/arcgisAPI'
import config from '@/modules/appConfig'

@Component({
  name: '',
  components: {},
})
export default class extends Vue {
  mounted() {
    init()
    this.createView()
  }

  get count() {
    return this.$store.getters['view/count']
  }

  // 创建2d
  createView() {
    this.$store.commit('oneMap/setGlobalLoading', true)
    create2DView('map').then(() => {
      this.$store.commit('oneMap/setGlobalLoading', false)
    })
  }

  // 控制地图大小
  handlerZoom(flag: boolean) {
    if (!config.activeView) return
    config.activeView.zoom = config.activeView.goTo({
      center: config.activeView.center,
      scale: flag ? config.activeView.scale / 2 : config.activeView.scale * 2,
    })
  }
}
</script>
<style scoped lang="scss">
.map-box {
  flex: 1;
}

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

#map {
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
