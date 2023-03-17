import config from './appConfig'
import { getMainView } from './arcgisAPI'

// 面积量测
function setMeasurementArea() {
  try {
    const view = getMainView()
    const htmlElem: HTMLElement | any = document.getElementById(
      'widget-panel-div'
    )
    const container = document.createElement('div')
    htmlElem.appendChild(container)
    config.measurementWidget = new config.esriConstructors.Measurement({
      view,
      container,
      activeTool: 'area'
    })
  } catch (ex) {
    console.log(ex)
  }
}
// 距离量测
function setMeasurementDistance() {
  try {
    const view = getMainView()
    const htmlElem: HTMLElement | any = document.getElementById(
      'widget-panel-div'
    )
    const container = document.createElement('div')
    htmlElem.appendChild(container)
    config.measurementWidget = new config.esriConstructors.Measurement({
      view,
      container,
      activeTool:
        config.MapToolVue.show3D || config.MapSecondVue.show3DMonitor
          ? 'direct-line'
          : 'distance'
    })
  } catch (ex) {
    console.log(ex)
  }
}
function clearMeasurement() {
  try {
    if (config.measurementWidget) {
      config.measurementWidget.container = null
      config.measurementWidget.destroy()
      config.measurementWidget = null
    }
  } catch (ex) {
    console.log(ex)
  }
}

export { setMeasurementArea, setMeasurementDistance, clearMeasurement }
