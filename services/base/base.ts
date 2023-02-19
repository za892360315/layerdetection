import axios from "axios"; // 导入的axios本身就是一个实例
// 测试接口，httpbin.org,可以用来模拟测试
import type { AxiosInstance } from "axios";
import { IRequsetConfig, IIntercepters } from "./types";
class Request {
  instance: AxiosInstance;
  interceptors?: IIntercepters;
  constructor(config: IRequsetConfig) {
    this.instance = axios.create(config);
    this.interceptors = config.Intercepters;
    // 请求拦截
    this.instance.interceptors.request.use(
      this.interceptors?.requestInterceptor,
      this.interceptors?.requestInterceptorCatch
    );
    // 响应拦截
    this.instance.interceptors.response.use(
      this.interceptors?.responseInterceptor,
      this.interceptors?.responseInterceptorCatch
    );
  }

  request<T>(config: IRequsetConfig<T>): Promise<T> {
    // 单独拦截
    if (config.Intercepters?.requestInterceptor) {
      config = config.Intercepters.requestInterceptor(config);
    }
    return new Promise((reslove, reject) => {
      this.instance
        .request<any, T>(config)
        .then((res) => {
          // 单独拦截
          if (config.Intercepters?.responseInterceptor) {
            config = config.Intercepters.responseInterceptor(res);
          }
          reslove(res);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  /**
   * @param {string} url 路径
   * @param {any} params 参数对象类型
   * @param {boolean} isLoding 是否显示loading
   */
  get<T>(url: string, params?: any, isLoding = true): Promise<T> {
    return new Promise((reslove, reject) => {
      this.instance
        .get<any, T>(url, {
          params
        })
        .then((res) => {
          reslove(res);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  /**
   * @param {string} url 路径
   * @param {any} params 参数对象类型
   * @param {boolean} isLoding 是否显示loading
   */
  delte<T>(url: string, params?: any, isLoding = true): Promise<T> {
    return new Promise((reslove, reject) => {
      this.instance
        .delete<any, T>(url, { params })
        .then((res) => {
          reslove(res);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  /**
   * @param {string} url 路径
   * @param {any} data 参数对象类型
   * @param {boolean} isLoding 是否显示loading
   */
  post<T>(url: string, data?: any, headers?: any, isLoding = true): Promise<T> {
    return new Promise((reslove, reject) => {
      this.instance
        .post<any, T>(url, data, { headers } as any)
        .then((res) => {
          reslove(res);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  /**
   * @param {string} url 路径
   * @param {any} data 参数对象类型
   * @param {boolean} isLoding 是否显示loading
   */
  put<T>(url: string, data?: any, isLoding = true): Promise<T> {
    return new Promise((reslove, reject) => {
      this.instance
        .put<any, T>(url, data)
        .then((res) => {
          reslove(res);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }
}

export default Request;
