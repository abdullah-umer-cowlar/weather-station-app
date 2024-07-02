import { AxiosRequestConfig } from "axios";

export interface SignupPayload {
  firstName: string;
  lastName: string;
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
