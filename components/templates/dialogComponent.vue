<template>
  <div class="basePanel">
    <div class="basePanel-header">
      <div class="header-left">
        <div class="header-title" name="header"><slot name="header" /></div>
        <i
          class="iconfont el-iconthird-legeng-close header-icon"
          title="关闭"
          @click="fnClose"
        ></i>
        <i
          v-show="showExport"
          class="iconfont el-iconthird-tool-leadingout header-icon"
          title="导出"
          @click="fnExport"
        ></i>
        <i
          v-show="showReturn"
          class="iconfont el-iconthird-system-back header-icon"
          title="返回"
          @click="fnReturn"
        ></i>
        <i
          v-show="!showShrink"
          class="iconfont el-iconthird-plus-arrow-up header-icon"
          title="收缩"
          @click="fnShrink"
        ></i>
        <i
          v-show="showShrink"
          class="iconfont el-iconthird-zhankai header-icon"
          title="展开"
          @click="fnShrink"
        ></i>
      </div>
      <div class="header-middle"></div>
      <div class="header-right"></div>
    </div>
    <div v-show="!showShrink" class="basePanel-content">
      <slot name="content" />
    </div>
    <div v-show="!showShrink" class="basePanel-footer">
      <div class="footer-left"></div>
      <div class="footer-middle"></div>
      <div class="footer-right"></div>
    </div>
  </div>
</template>
  <script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
@Component({
  name: 'templatePanel',
})
export default class extends Vue {
  @Prop({ default: () => false }) private showExport!: boolean
  @Prop({ default: () => false }) private showReturn!: boolean

  showShrink = false
  fnClose() {
    this.$emit('close')
  }

  fnExport() {
    this.$emit('export')
  }

  fnShrink() {
    this.showShrink = !this.showShrink
  }

  fnReturn() {
    this.$emit('return')
  }
}
</script>
  <style lang="scss" scoped>
.basePanel {
  position: relative;
  width: 320px;
  z-index: 100;
  min-width: 250px;
  pointer-events: auto;
}
.basePanel-header {
  height: 30px;
  width: 100%;
  pointer-events: auto;
  color: #3ed4d6;
}
.basePanel-content {
  border-left: 1px solid #093f56;
  border-right: 1px solid #093f56;
  background: rgba(3, 14, 37, 0.8);
  width: 100%;
  height: 100%;
  padding: 10px;
}
.basePanel-footer {
  height: 20px;
  width: 100%;
}
.footer-left {
  float: left;
  width: 20px;
  height: 20px;
//   background: url('../../assets/images/basePanel/面板-下左.png');
}
.footer-middle {
  float: left;
  height: 20px;
  width: calc(100% - 38px);
//   background: url('../../assets/images/basePanel/面板-下中.png');
}
.footer-right {
  float: left;
  width: 18px;
  height: 20px;
//   background: url('../../assets/images/basePanel/面板-下右.png');
}
.header-left {
  float: left;
  width: 223px;
  height: 32px;
//   background: url('../../assets/images/basePanel/面板-上左.png');
  background-size: 100% 100%;
  padding-left: 15px;
  padding-top: 5px;
  color: white;
}
.header-title {
  float: left;
  width: 135px;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  color: #3ed4d6;
  div {
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }
}
.header-icon {
  margin: 2px 2px 0 5px;
  float: right;
  cursor: pointer;
}
.header-middle {
  float: left;
  height: 32px;
  width: calc(100% - 238px);
//   background: url('../../assets/images/basePanel/面板-上中.png');
}
.header-right {
  float: left;
  width: 15px;
  height: 32px;
//   background: url('../../assets/images/basePanel/面板-上右.png');
  background-size: 100% 100%;
}
</style>
  