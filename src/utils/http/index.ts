/* eslint-disable @typescript-eslint/ban-ts-comment */
import axios from 'axios'
import { errorHandler, reqResolve, resResolve } from './interceptors'

const defaultOptions = {
  timeout: 12000,
}
export const request = axios.create({
  ...defaultOptions,
  baseURL: import.meta.env.VITE_BASE_API,
})

// @ts-expect-error
request.interceptors.request.use(reqResolve, errorHandler)
request.interceptors.response.use(resResolve, errorHandler)

