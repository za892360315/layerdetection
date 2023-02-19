/*
 * @Author: OOPS.Liu
 * @Date: 2022-01-25 08:24:20
 * @Discription:
 */
import type { AxiosRequestConfig, AxiosResponse } from "axios";

// 拦截器接口
export interface IIntercepters<T = AxiosResponse> {
  requestInterceptor?: (config: AxiosRequestConfig) => AxiosRequestConfig;
  requestInterceptorCatch?: (error: any) => any;
  responseInterceptor?: (res: T) => T;
  responseInterceptorCatch?: (error: any) => any;
}

// 重新定义AxiosRequestConfig，加入拦截器
export interface IRequsetConfig<T = AxiosResponse> extends AxiosRequestConfig {
  Intercepters?: IIntercepters<T>;
}
