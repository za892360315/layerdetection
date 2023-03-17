import config from './appConfig'
import { getMainView } from './arcgisAPI'

function GetGisConstructor() {
  return config.esriConstructors
}
function setlineOfSight() {
  try {
    let lineOfSightWidget = config.lineOfSightWidget
    const gisConstructor = GetGisConstructor()
    const view = getMainView()
    const htmlElem: any = document.getElementById('widget-panel-div')
    const container = document.createElement('div')
    htmlElem.appendChild(container)
    lineOfSightWidget = new gisConstructor.LineOfSight({
      view,
      container
    })
    const viewModel = lineOfSightWidget.viewModel
    viewModel.start()
    config.lineOfSightWidget = lineOfSightWidget
  } catch (ex) {}
}

function clearlineOfSight() {
  try {
    let lineOfSightWidget = config.lineOfSightWidget
    if (lineOfSightWidget) {
      lineOfSightWidget.viewModel.clear()
      lineOfSightWidget.container = null
      lineOfSightWidget.destroy()
      lineOfSightWidget = null
    }
    config.lineOfSightWidget = lineOfSightWidget
  } catch (ex) {}
}

export { setlineOfSight, clearlineOfSight }
