<template>
  <div class="layer-control">cdcdcdc</div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
@Component({
  name: 'leftbar',
  components: {
    // PanelComponent,
    // TempTable,
    // search,
  },
})
export default class extends Vue {}
</script>

<style scoped lang="scss">
* {
  border: 0;
  margin: 0;
  box-sizing: border-box;
}

.mr-auto {
  margin-left: auto;
}

.layer-control {
  background: #f4f4f4;
  width: 404px;
  height: 100%;
  padding: 16px;

  .control-box {
    width: 100%;
    height: 100%;
    background-color: #ffffff;
    border-radius: 4px;
    padding: 15px;
  }

  .control-title {
    display: flex;
    justify-content: space-between;
    font-size: 16px;
    font-weight: bold;
    font-stretch: normal;
    letter-spacing: 0px;
    color: #333333;
  }

  .title-name {
    display: flex;
    align-items: center;
    span {
      font-weight: bold;
    }
  }

  .layer-search {
    background-color: #ffffff;
    border-radius: 4px;
    border: solid 1px #eaeaea;
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    padding: 10px 13px;
    margin: 15px 0 30px;

    img {
      width: 14px;
      height: 14px;
      margin-right: 7px;
    }

    input {
      font-size: 14px;
      line-height: 14px;
      border: 0;
      outline: none;
      flex-grow: 1;

      &::-webkit-input-placeholder {
        color: #999999;
      }
    }

    i {
      cursor: pointer;
    }
  }

  .control-list {
    display: flex;
    flex-direction: column;
    gap: 30px 0;
    .data-err {
      color: #8a8a8a;
      min-height: 50vh;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }

  .control-item {
    background-color: #ffffff;
    border-radius: 4px;
    border: solid 1px #eaeaea;
    // padding: 0 15px;

    & > div {
      padding: 17px;
      border-bottom: 1px solid #e5e5e5;

      &:last-child {
        border: 0;
      }
    }

    .data-list {
      font-size: 16px;
      color: #8a8a8a;
      display: flex;
      align-items: center;
      font-weight: bold;
      font-stretch: normal;
      letter-spacing: 0px;
      cursor: pointer;

      img {
        height: 12px;
        margin-right: 10px;
      }
    }
  }
}

.widget-panel {
  position: absolute;
  z-index: 999;
  right: 15px;
  bottom: 10%;
  width: calc(100% - 431px);
  height: 212px;
}
.serach.active-menu {
  height: 50px;
  width: 100%;
  overflow-y: auto;
}

/deep/ .serach::-webkit-scrollbar {
  /*滚动条整体样式*/
  width: 4px;
  /*高宽分别对应横竖滚动条的尺寸*/
  height: 0px;
}

/deep/ .serach::-webkit-scrollbar-thumb {
  /*滚动条里面小方块*/
  border-radius: 10px;
  box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
  background: #5b66e8;
}

/deep/ .serach::-webkit-scrollbar-track {
  /*滚动条里面轨道*/
  box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
  border-radius: 10px;
  background: #ededed;
}
.base-title {
  .text {
    font-weight: bold;
  }
}
.handle-btn {
  display: flex;
  justify-content: space-around;
}
</style>
