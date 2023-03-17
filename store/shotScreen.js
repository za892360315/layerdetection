export const state = () => ({
  height: 0, // 当前屏幕截图参数  宽、高、图片预览
  width: 0,
  imgUrl: ''
})
const getters = {
  getHeight: state => {
    return state.height
  },
  getWidth: state => {
    return state.width
  },
  getImgUrl: state => {
    return state.imgUrl
  }
}

const mutations = {
  setHeight: (state, value) => {
    state.height = value
  },
  setWidth: (state, value) => {
    state.width = value
  },
  setImgUrl: (state, value) => {
    state.imgUrl = value
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations
}
