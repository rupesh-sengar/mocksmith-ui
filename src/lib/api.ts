import axios, { AxiosError, type AxiosRequestConfig } from "axios";
import type { BaseQueryFn } from "@reduxjs/toolkit/query";
// import type { RootState } from "../store/index";

type Args = {
  url: string;
  method: AxiosRequestConfig["method"];
  data?: unknown;
  params?: unknown;
  headers?: AxiosRequestConfig["headers"];
};

type RTKError = { status?: number; data?: unknown };

export const axiosBaseQuery =
  ({ baseUrl = "" }: { baseUrl?: string } = {}): BaseQueryFn<
    Args,
    unknown,
    RTKError
  > =>
  async ({ url, method, data, params, headers }, api) => {
    try {
      //   const state = api.getState() as RootState;
      //   const token: string | undefined = state?.auth?.token;

      const result = await axios({
        url: baseUrl + url,
        method,
        data,
        params,
        headers: {
          ...(headers ?? {}),
          //   ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        signal: api.signal, // abort on unmount/refetch
      });

      return { data: result.data };
    } catch (e) {
      const err = e as AxiosError;
      return {
        error: {
          status: err.response?.status,
          data: err.response?.data ?? err.message,
        },
      };
    }
  };
