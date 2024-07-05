import { AxiosRequestConfig } from "axios";

export interface AuthInfo {
  user: User | null;
  token: string | null;
}

export interface User {
  id: string;
  email: string;
}

export interface SignupPayload {
  email: string;
  password: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export type GetParams = Record<string, string>;
export type GetHeaders = Record<string, string>;

export interface GetRequest {
  url: string;
  params?: GetParams;
  headers?: AxiosRequestConfig["headers"];
}

export interface PostRequest<T> {
  url: string;
  data: T;
}

export interface DeleteRequest {
  url: string;
}

export interface PutRequest<T> {
  url: string;
  data: T;
}

export interface RawDataPoint {
  result: string;
  table: number;
  _measurement: string;
  _start: string;
  _stop: string;
  _time: string;
  location: string;
  temperature: number;
  humidity: number;
}

export interface ChartPoint {
  x: number;
  y: number;
}
