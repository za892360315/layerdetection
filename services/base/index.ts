import Request from './base'
import { getToken } from '@/modules/auth'

const Intercepters = {
  requestInterceptor: (config: any) => {
    if (config.headers?.isLoding) {
    }
    // token
    if (config.headers) {
      const token = getToken()
      config.headers.Authorization = 'Bearer ' + token
    }

    return config
  },
  requestInterceptorCatch: (error: any) => {
    console.log('请求失败', error)
  },
  responseInterceptor: (res: any) => {
    if (res.data) {
      return res.data
    } else {
      return res
    }
  },
  responseInterceptorCatch: (error: any) => {
    return error
  },
}
const userAPIRequest = new Request({
  baseURL: '/userAPI',
  timeout: 20000,
  Intercepters,
})
const devAPIRequest = new Request({
  baseURL: '/devapi',
  timeout: 20000,
  Intercepters,
})
// 文件解析
const serverFileRequest = new Request({
  baseURL: '/serverFile',
  timeout: 20000,
  Intercepters,
})
// 地址
const addressRequest = new Request({
  baseURL: '/addressRes',
  timeout: 600000,
  Intercepters,
})

export { userAPIRequest, devAPIRequest, serverFileRequest, addressRequest }
