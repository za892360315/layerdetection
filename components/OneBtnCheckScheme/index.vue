<template>
  <el-tabs
    v-model="activeName"
    :stretch="true"
    :class="style"
    class="static-tabs"
    @tab-click="handleClick"
  >
    <el-tab-pane label="一键检测" name="yjjc">
      <OneDetectionComponet />
    </el-tab-pane>
    <!-- <el-tab-pane v-if="yjjcVisible" label="一键检测" name="yjjc">
      <OneDetectionComponet />
    </el-tab-pane> -->
    <el-tab-pane label="批量检测" name="pljc">
      <BatchInspectionComponet />
    </el-tab-pane>
  </el-tabs>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import OneDetectionComponet from './COneDetection.vue'
import BatchInspectionComponet from './BatchInspection.vue'
// import thematicStaticComponent from '@/components/onlineMap/staticAnalysis/CThematicStatic.vue'
// import commonStaticComponent from '@/components/onlineMap/staticAnalysis/CCommonStatic.vue'
// import { getUserInfo } from '@/modules/appCommon'
@Component({
  name: 'staticAnalysis',
  components: {
    // thematicStaticComponent,
    // commonStaticComponent,
    OneDetectionComponet,
    BatchInspectionComponet
  },
})
export default class extends Vue {
  activeName: String = 'yjjc'
  yjjcVisible: Boolean = false
  pljcVisibleL: Boolean = false
  style: String = '' // 需判断tab选中时，下划线的长度
  mounted() {
    // const win: any = window
    // this.yjjcVisible = win.header.onlineMapYJJC.yjjcVisible
    // this.pljcVisibleL = win.header.onlineMapYJJC.pljcVisibleL
    // const userId = localStorage.getItem('userId')
    // if (userId) {
    //   const userInformation = getUserInfo()
    //   if (userInformation.roles && userInformation.roles.includes('guest')) {
    //     this.yjjcVisible = false
    //   }
    //   if (userInformation.roles && userInformation.roles.includes('oneKey')) {
    //     this.pljcVisibleL = true
    //   }
    // }
    if (!this.yjjcVisible && this.pljcVisibleL) {
      this.activeName = 'pljc'
    }
    const titleLilst = [this.yjjcVisible, this.pljcVisibleL]
    const len = titleLilst.filter((item) => item)
    if (len.length === 1) {
      this.style = 'one'
    } else if (len.length === 2) {
      this.style = 'two'
    }
  }

  handleClick() {}
}
</script>

<style lang="scss" scoped>
.static-tabs {
  padding: 0px 20px;
  background: white;
  height: 48px;
  color: #3977f4;
}
/deep/.el-tabs__active-bar {
  height: 2px;
  // width: 100% !important;
  background-color: #3d7eff;
}
.one /deep/.el-tabs__active-bar {
  height: 2px;
  width: 100% !important;
  background-color: #3d7eff;
}
.two /deep/.el-tabs__active-bar {
  height: 2px;
  width: 200px !important;
  background-color: #3d7eff;
}
/deep/.el-tabs__item {
  color: #999;
}
</style>

<style lang="scss">
.static-tabs {
  .el-tabs__item {
    height: 48px;
    line-height: 48px;
    font-size: 16px;
    &.is-active {
      color: #3977f4;
    }
  }
}
</style>
