import { getMainView } from '~/modules/arcgisAPI'
let dragHandler: any = null // 截图范围事件处理
// 下载图片
export function downloadImage(filename: string, dataUrl: string) {
  if (!window.navigator.msSaveOrOpenBlob) {
    // const element = document.createElement('a')
    // element.setAttribute('href', dataUrl)
    // element.setAttribute('download', filename)
    // element.style.display = 'none'
    // document.body.appendChild(element)
    // element.click()
    // document.body.removeChild(element)

    const aLink = document.createElement('a')
    const blob = base64ToBlob(dataUrl) // new Blob([content]);
    aLink.download = filename
    aLink.href = URL.createObjectURL(blob)
    aLink.dispatchEvent(
      new MouseEvent('click', { bubbles: true, cancelable: true, view: window })
    )
  } else {
    const byteString = atob(dataUrl.split(',')[1])
    const mimeString = dataUrl.split(',')[0].split(':')[1].split(';')[0]
    const ab = new ArrayBuffer(byteString.length)
    const ia = new Uint8Array(ab)
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i)
    }
    const blob = new Blob([ab], { type: mimeString })
    window.navigator.msSaveOrOpenBlob(blob, filename)
  }
}
// base64转blob
const base64ToBlob = (code: string) => {
  const parts = code.split(';base64,')
  const contentType = parts[0].split(':')[1]
  const raw = window.atob(parts[1])
  const rawLength = raw.length

  const uInt8Array = new Uint8Array(rawLength)

  for (let i = 0; i < rawLength; ++i) {
    uInt8Array[i] = raw.charCodeAt(i)
  }
  return new Blob([uInt8Array], { type: contentType })
}

// export function screenshot(callbackOk: Function, callbackCancel: Function) {
//   const view = getMainView()
//   const area = {
//     x: 0,
//     y: 0,
//     width: view.width,
//     height: view.height
//   }
//   try {
//     if (area.width > 0 && area.height > 0) {
//       view.takeScreenshot({ area, format: 'png' }).then(function(screenshot: any) {
//         const shotScreenObject = {
//           width: area.width,
//           height: area.height,
//           imgUrl: screenshot.dataUrl
//         }
//         callbackOk(shotScreenObject)
//       })
//     }
//   } catch (ex) {
//     callbackCancel()
//     console.log(ex)
//   }
// }
export function screenshot(callbackOk: Function, callbackCancel: Function) {
  try {
    const view = getMainView()
    view.container.classList.add('screenshotCursor')
    let area: any = null
    dragHandler = view.on('drag', function (event: any) {
      event.stopPropagation()
      if (event.action !== 'end') {
        const xmin = clamp(Math.min(event.origin.x, event.x), 0, view.width)
        const xmax = clamp(Math.max(event.origin.x, event.x), 0, view.width)
        const ymin = clamp(Math.min(event.origin.y, event.y), 0, view.height)
        const ymax = clamp(Math.max(event.origin.y, event.y), 0, view.height)
        area = {
          x: xmin,
          y: ymin,
          width: xmax - xmin,
          height: ymax - ymin
        }
        setMaskPosition(area)
      } else {
        dragHandler.remove()
        view
          .takeScreenshot({ area, format: 'png' })
          .then(function (screenshot: any) {
            callbackOk(screenshot)
            view.container.classList.remove('screenshotCursor')
            setMaskPosition(null)
          })
      }
    })
  } catch (ex) {
    callbackCancel()
    console.log(ex)
  }
}

function setMaskPosition(area: any) {
  const maskDiv: any = document.getElementById('maskDiv')
  if (area) {
    maskDiv.classList.remove('hide')
    maskDiv.style.left = area.x + 'px'
    maskDiv.style.top = area.y + 'px'
    maskDiv.style.width = area.width + 'px'
    maskDiv.style.height = area.height + 'px'
  } else {
    maskDiv.classList.add('hide')
  }
}
function clamp(value: any, from: any, to: any) {
  return value < from ? from : value > to ? to : value
}

export function deleteHandler() {
  if (dragHandler) {
    const view = getMainView()
    dragHandler.remove()
    dragHandler = null
    view.container.classList.remove('screenshotCursor')
  }
}
