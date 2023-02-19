import { Module } from 'vuex'
// import { mapMove, mapClick,clearMoveMap } from '@/modules/appendMourse'
import { clearTempLayer } from '@/modules/esriCommand'
const app: Module<any, any> = {
  namespaced: true,
  state() {
    return {
      globalLoading: true, // 初始地图加载状态
      menuTitle: 'Topic', // 菜单
      mapType: 'imageMap', // 地图类型
      operateType: '', // 当前进行操作类型
      openDetail: false, // 打开详情弹窗
      detailInfo: {}, // 详情信息
      showAllLayers: false, // 展示所有图层
      showOneLayers: '', // 展示某个图层 传图层名称
      condition: [], // 列表筛选
      space: [], // 空间筛选
      allQuery: {}, // 全部查询添加
      selectLayers: new Map(), // 显示图层名称需要
      showLayersName: false, // 显示图层名称按钮状态
      updateOneLayerList: '', // 更新某个图层列表
      tableName: '', // 当前打开的数据列表名称
      isFocusHandle: false, // 巡查重点编辑权限
      isRouterHandle: false, // 巡查路线编辑权限
      isScopesHandle: false, // 管辖范围编辑权限
      isFocusSee: false, // 巡查重点查看权限
      isRouterSee: false, // 巡查路线查看权限
      isScopesSee: false, // 管辖范围查看权限
    }
  },
  getters: {
    getselectLayers: (state) => {
      return state.selectLayers
    },
  },
  mutations: {
    setGlobalLoading: (state, value) => {
      state.globalLoading = value
    },
    setMenuTitle: (state, value) => {
      if (value === state.value) return
      //   clearVForm()
      clearTempLayer()
      state.showAllLayers = false
      state.menuTitle = value
      state.operateType = ''
    },
    setMapType: (state, value) => {
      state.mapType = value
    },
    setOperateType: (state, value) => {
      state.operateType = value
    },
    setOpenDetail: (state, value) => {
      state.openDetail = value
    },
    setDetailInfo: (state, value) => {
      state.detailInfo = value
    },
    setShowAllLayers: (state, value) => {
      state.showAllLayers = value
    },
    setShowOneLayers: (state, value) => {
      state.showOneLayers = value
    },
    setSelectLayers: (state, value) => {
      state.selectLayers.set(value.id, value.layerFlag)
    },
    delSelectLayers: (state, value) => {
      state.selectLayers.delete(value.id, value.layerFlag)
    },
    setShowLayersName: (state, value) => {
      state.showLayersName = value
    },
    setUpdateOneLayerList: (state, value) => {
      state.updateOneLayerList = value
    },
    setSpace: (state, space) => {
      state.space = space
    },
    setAllQuery: (state, allQuery) => {
      state.allQuery = allQuery
    },
    setTableName: (state, tableName) => {
      state.tableName = tableName
    },
    setIsFocusHandle: (state, value) => {
      state.isFocusHandle = value
    },
    setIsRouterHandle: (state, value) => {
      state.isRouterHandle = value
    },
    setIsScopesHandle: (state, value) => {
      state.isScopesHandle = value
    },
    setIsFocusSee: (state, value) => {
      state.isFocusSee = value
    },
    setIsRouterSee: (state, value) => {
      state.isRouterSee = value
    },
    setIsScopesSee: (state, value) => {
      state.isScopesSee = value
    },
    setCondition: (state, condition) => {
      if (!Array.isArray(condition)) return
      state.condition = condition
      // let conditionArr = JSON.parse(JSON.stringify(state.condition))
      // condition.forEach((cur: any) => {
      //   let idx: number = -1
      //   conditionArr.length > 0 &&
      //     (idx = conditionArr.findIndex(
      //       (ele: any) => ele.columnName == cur.columnName
      //     ))
      //   idx < 0 && cur.value && cur.value != '' && conditionArr.push(cur)
      //   idx > -1 && (cur.value == '' || !cur.value)
      //     ? (conditionArr = conditionArr.filter(
      //         (ele: any) => ele.columnName != cur.columnName
      //       ))
      //     : (conditionArr[idx] = cur)
      // })
      // !(JSON.stringify(state.condition) == JSON.stringify(conditionArr)) && (state.condition = conditionArr)
    },
  },
}
export default app
