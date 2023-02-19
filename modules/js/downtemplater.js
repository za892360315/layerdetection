import Docxtemplater from 'docxtemplater'
import Pizzip from 'pizzip'
import JSZipUtils from 'jszip-utils'
import FileSaver from 'file-saver'
import ImageModule from 'docxtemplater-image-module-free'
import { getMainView } from '@/modules/arcgisAPI'

// 读取模板数据
function getBaseData(url, callback) {
  let xmlhttp = null
  if (window.XMLHttpRequest) {
    xmlhttp = new window.XMLHttpRequest()
  } else {
    xmlhttp = new window.ActiveXObject('Microsoft.XMLHTTP')
  }
  xmlhttp.open('GET', url, true)
  xmlhttp.withCredentials = true

  if ('responseType' in xmlhttp) {
    xmlhttp.responseType = 'arraybuffer'
  }

  // older browser
  if (xmlhttp.overrideMimeType) {
    xmlhttp.overrideMimeType('text/plain; charset=x-user-defined')
  }
  xmlhttp.onreadystatechange = function () {
    let file, err
    if (xmlhttp.readyState === 4) {
      if (xmlhttp.status === 200 || xmlhttp.status === 0) {
        file = null
        err = null
        try {
          file = xmlhttp.response || xmlhttp.responseText
        } catch (e) {
          err = new Error(e)
        }
        callback(err, file)
      } else {
        callback(new Error('读取word模板错误'), null)
      }
    }
  }

  xmlhttp.send()
}
export function requireModule(modules) {
  return new Promise(function (resolve, reject) {
    // If something goes wrong loading the esri/dojo scripts, reject with the error.
    const errorHandler = window.require.on('error', reject)
    window.require(modules, function () {
      const args = []
      for (let _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i]
      }
      // remove error handler
      errorHandler.remove()
      // Resolve with the parameters from dojo require as an array.
      resolve(args)
    })
  })
}
// 点击导出word  url 引入静态文件  resultMap 检测结果
export function exportWord(url, resultMap) {
  // 读取并获得模板文件的二进制内容
  getBaseData(url, (error, content) => {
    // template.docx是模板。我们在导出的时候，会根据此模板来导出对应的数据
    // 抛出异常
    if (error) {
      throw error
    }
    // 创建一个JSZip实例，内容为模板的内容
    const zip = new Pizzip(content)
    // 创建并加载docxtemplater实例对象
    const doc = new Docxtemplater().loadZip(zip)
    // 设置模板变量的值

    doc.setData({
      allData: resultMap,
    })

    try {
      // 用模板变量的值替换所有模板变量
      doc.render()
    } catch (error) {
      // 抛出异常
      const e = {
        message: error.message,
        name: error.name,
        stack: error.stack,
        properties: error.properties,
      }
      console.log(JSON.stringify({ error: e }))
      throw error
    }

    // 生成一个代表docxtemplater对象的zip文件（不是一个真实的文件，而是在内存中的表示）
    const out = doc.getZip().generate({
      type: 'blob',
      mimeType:
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    })
    FileSaver.saveAs(out, '一键检测结果.docx') // 将目标文件对象保存为目标类型的文件，并命名
  })
}

export function getOutword(innerHTML, fileName) {
  /*  id ：文档dom节点 fileName：文件名称(.doc) */
  const header =
    "<html xmlns:o='urn:schemas-microsoft-com:office:office' " +
    "xmlns:w='urn:schemas-microsoft-com:office:word' " +
    "xmlns='http://www.w3.org/TR/REC-html40'>" +
    "<head><meta charset='utf-8'><title>检测结果</title></head><body>"
  const footer = '</body></html>'
  const sourceHTML = header + innerHTML + footer

  const source =
    'data:application/vnd.ms-word;charset=utf-8,' +
    encodeURIComponent(sourceHTML)
  const fileDownload = document.createElement('a')
  document.body.appendChild(fileDownload)
  fileDownload.href = source
  fileDownload.download = fileName // 下载名称
  fileDownload.click()
  document.body.removeChild(fileDownload)
}
// 点击导出word  url 引入静态文件  resultMap 检测结果
export function exportPlanCheckWord(url, wordData, callback) {
  // 读取并获得模板文件的二进制内容
  const view = getMainView()
  getBaseData(url, (error, content) => {
    // url是模板地址。我们在导出的时候，会根据此模板来导出对应的数据
    // 抛出异常
    if (error) {
      throw error
    }
    function base64DataURLToArrayBuffer(dataURL) {
      const base64Regex = /^data:image\/(png|jpg|svg|svg\+xml);base64,/
      if (!base64Regex.test(dataURL)) {
        return false
      }
      const stringBase64 = dataURL.replace(base64Regex, '')
      let binaryString
      if (typeof window !== 'undefined') {
        binaryString = window.atob(stringBase64)
      } else {
        binaryString = Buffer.from(stringBase64, 'base64').toString('binary')
      }
      const len = binaryString.length
      const bytes = new Uint8Array(len)
      for (let i = 0; i < len; i++) {
        const ascii = binaryString.charCodeAt(i)
        bytes[i] = ascii
      }
      return bytes.buffer
    }
    const opts = {}
    opts.fileType = 'docx'
    opts.centered = false
    opts.getImage = function (tagValue) {
      return base64DataURLToArrayBuffer(tagValue)
    }
    opts.getSize = function () {
      const width = 600
      const height = (width / view.width) * view.height
      return [width, height]
    }

    const imageModule = new ImageModule(opts)

    // 创建一个JSZip实例，内容为模板的内容
    const zip = new Pizzip(content)
    // 创建并加载docxtemplater实例对象
    const doc = new Docxtemplater().attachModule(imageModule).loadZip(zip)
    // 设置模板变量的值
    console.log(wordData)
    doc.setData(wordData)

    try {
      // 用模板变量的值替换所有模板变量
      doc.render()
    } catch (error) {
      // 抛出异常
      const e = {
        message: error.message,
        name: error.name,
        stack: error.stack,
        properties: error.properties,
      }
      console.log(JSON.stringify({ error: e }))
      throw error
    }

    // 生成一个代表docxtemplater对象的zip文件（不是一个真实的文件，而是在内存中的表示）
    const out = doc.getZip().generate({
      type: 'blob',
      mimeType:
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    })
    // FileSaver.saveAs(out, '审批项目检测结果.docx') // 将目标文件对象保存为目标类型的文件，并命名
    // const file = new window.File([out], '成果审查检测结果.docx', {
    //   type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    // })
    FileSaver.saveAs(out, '一键检测结果.docx') // 将目标文件对象保存为目标类型的文件，并命名
    const file = new window.File([out], '一键检测结果.docx', {
      type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    })
    callback(file)
  })
}

export function exportWordCity({ url, data, name }) {
  JSZipUtils.getBinaryContent(url, (_error, content) => {
    function base64DataURLToArrayBuffer(dataURL) {
      const base64Regex = /^data:image\/(png|jpg|svg|svg\+xml);base64,/
      if (!base64Regex.test(dataURL)) {
        return false
      }
      const stringBase64 = dataURL.replace(base64Regex, '')
      let binaryString
      if (typeof window !== 'undefined') {
        binaryString = window.atob(stringBase64)
      } else {
        binaryString = Buffer.from(stringBase64, 'base64').toString('binary')
      }
      const len = binaryString.length
      const bytes = new Uint8Array(len)
      for (let i = 0; i < len; i++) {
        const ascii = binaryString.charCodeAt(i)
        bytes[i] = ascii
      }
      return bytes.buffer
    }
    const opts = {}
    opts.fileType = 'docx'
    opts.centered = false
    opts.getImage = function (tagValue) {
      return base64DataURLToArrayBuffer(tagValue)
    }
    opts.getSize = function () {
      const width = 400 // 400
      const height = 220 // 220
      return [width, height]
    }

    const imageModule = new ImageModule(opts)

    // 创建一个JSZip实例，内容为模板的内容
    const zip = new Pizzip(content)
    // 创建并加载docxtemplater实例对象
    const doc = new Docxtemplater().attachModule(imageModule).loadZip(zip)
    doc.setData(data)
    try {
      // 用模板变量的值替换所有模板变量
      doc.render()
    } catch (error) {
      // 抛出异常
      const e = {
        message: error.message,
        name: error.name,
        stack: error.stack,
        properties: error.properties,
      }
      console.log(e)
      throw error
    }
    // 生成一个代表docxtemplater对象的zip文件（不是一个真实的文件，而是在内存中的表示）
    const out = doc.getZip().generate({
      type: 'blob',
      mimeType:
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    })
    FileSaver.saveAs(out, name) // 将目标文件对象保存为目标类型的文件，并命名
  })
}
