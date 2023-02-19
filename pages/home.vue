<template>
  <div
    v-loading="globalLoading"
    class="online-map onemap-page layout"
    style="width: 100%; height: 100vh"
    element-loading-text="地图加载中..."
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(255, 255, 255, 0.8)"
  >
    <div class="view-box">
      <div class="contaniner">
        <div class="map-content">
          <Cmap />
        </div>
        <div class="check-scheme">
          <OneBtnCheckScheme />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import Cmap from '@/components/CMap.vue'
import OneBtnCheckScheme from '@/components/OneBtnCheckScheme/index.vue'
@Component({
  name: 'HomePage',
  components: {
    OneBtnCheckScheme,
    Cmap,
  },
  //   middleware: 'auth',
})
export default class extends Vue {
  private renderStatus = false
  get globalLoading() {
    return this.$store.state.oneMap.globalLoading
  }

  get activeMenu() {
    return this.$store.state.oneMap.menuTitle
  }

  destroyed() {}
  mounted() {}
}
</script>
<style lang="scss">
.layout {
  width: 100vw;
  height: 100vh;

  & > * {
    user-select: none;
  }

  .view-box {
    width: 100%;
    height: 100%;
    box-sizing: border-box;

    .contaniner {
      width: 100%;
      height: 100%;
      position: relative;
      overflow: hidden;
      display: flex;
      /deep/.form-dialog {
        /deep/ .el-form-item__label {
          text-align: right !important;
        }
      }
    }
  }

  .esri-view .esri-view-surface--inset-outline:focus::after {
    outline: 0 !important;
  }
  .form-dialog {
    /deep/ .el-form-item__label {
      text-align: right !important;
    }
  }
}
</style>

<style lang="scss" scoped>
.map-content {
  flex: 1;
  position: relative;

  .active-menu {
    position: absolute;
    width: 100%;
    top: 0;
    left: 0;
  }
}
.check-scheme {
  height: 96vh;
  width: 439px;
  position: absolute;
  right: 37px;
  top: 20px;
  background-color: #fff;
}
</style>
