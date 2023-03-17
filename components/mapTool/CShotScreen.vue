<template>
  <div :class="showIframeDialod ? 'add-iframe-style' : ''">
    <el-row style="margin-bottom: 10px; color: #fff"
      >请在地图上拖拽区域进行截图</el-row
    >
    <el-row style="margin-bottom: 10px">
      <el-col :span="20" style="padding-right: 3px">
        <el-input
          v-model="shotScreenName"
          size="mini"
          style="width: 240px"
          placeholder="请输入截图名称"
        ></el-input>
      </el-col>
      <el-col :span="4" style="padding-right: 3px">
        <el-button
          style="color: #fff !important"
          class="btn-special"
          size="mini"
          @click="saveShotScreen"
          >保存</el-button
        >
      </el-col>
    </el-row>
    <el-row style="margin-bottom: 10px">
      <el-col :span="10" style="padding-right: 3px">
        <span class="location-name">宽度:</span>
        <el-input
          v-model="imgWidth"
          size="mini"
          style="width: 80px"
          disabled
        ></el-input>
      </el-col>
      <el-col :span="10" style="padding-right: 3px">
        <span class="location-name">高度:</span>
        <el-input
          v-model="imgHeight"
          size="mini"
          style="width: 80px"
          disabled
        ></el-input>
      </el-col>
      <el-col :span="4">
        <el-button class="btn-special" size="mini" @click="selectShotScreen"
          >重选</el-button
        >
      </el-col>
    </el-row>
    <el-row v-if="imgUrl" style="margin-bottom: 10px">
      <el-image
        :src="imgUrl"
        title="点击大图预览"
        style="width: 100%"
        fit="contain"
        @click="showImg(imgUrl)"
      ></el-image>
    </el-row>
    <el-dialog
      :modal="false"
      :visible.sync="dialogVisible"
      title="截图预览"
      width="700px"
    >
      <el-image :src="showImgSrc"></el-image>
    </el-dialog>
  </div>
</template>
<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import { downloadImage, screenshot } from '@/modules/esriScreenshot'
@Component({
  name: 'CShotScreen',
})
export default class extends Vue {
  @Prop({ default: () => false }) private showIframeDialod!: boolean
  shotScreenName = ''
  showImgSrc = ''
  dialogVisible = false
  get imgHeight() {
    const that: any = this
    return that.$store.state.shotScreen.height
  }
  
  get imgWidth() {
    const that: any = this
    return that.$store.state.shotScreen.width
  }

  get imgUrl() {
    const that: any = this
    return that.$store.state.shotScreen.imgUrl
  }

  saveShotScreen() {
    let fileName = this.shotScreenName
    const that: any = this
    const fileUrl = that.$store.state.shotScreen.imgUrl
    if (!fileName) {
      fileName = '截图'
    }
    downloadImage(fileName, fileUrl)
  }

  selectShotScreen() {
    const vm: any = this
    screenshot(
      function (screenshot: any) {
        vm.$store.commit('shotScreen/setHeight', screenshot.data.height)
        vm.$store.commit('shotScreen/setWidth', screenshot.data.width)
        vm.$store.commit('shotScreen/setImgUrl', screenshot.dataUrl)
      },
      function () {}
    )
  }

  showImg(url: string) {
    // console.log(url)
    this.showImgSrc = url
    this.dialogVisible = true
  }
}
</script>
<style scoped>
.btn-special {
  width: 50px;
  height: 28px;
  text-align: center;
  background: #2757a5;
  border: 1px solid #2757a5;
  padding: 1px 1px;
  color: #fff;
  border-radius: 4px;
}
.location-name {
  width: 30px;
  font-size: 12px;
  font-weight: bold;
  display: inline-block;
  color: #fff;
}
.add-iframe-style {
  width: 97%;
}
.add-iframe-style .el-row {
  color: #333 !important;
}

.add-iframe-style .btn-special {
  color: #fff !important;
}
.add-iframe-style .el-col.el-col-4 .btn-special {
  color: #fff !important;
  background-color: #c6ceda;
  border: navajowhite;
}
</style>
<style>
.add-iframe-style .el-dialog__wrapper .el-dialog {
  background: #fff !important;
}
</style>