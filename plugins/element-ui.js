import Vue from 'vue'
import Element from 'element-ui'
import locale from 'element-ui/lib/locale/lang/zh-CN'
import VFormRender from 'vform-builds/dist/VFormRender.umd.min.js' //引入VFormRender组件

Vue.use(Element, { locale })
Vue.use(VFormRender)
