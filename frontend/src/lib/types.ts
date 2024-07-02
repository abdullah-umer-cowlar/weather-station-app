import { AxiosRequestConfig } from "axios";

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
