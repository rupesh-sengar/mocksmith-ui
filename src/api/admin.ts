import { axiosBaseQuery } from "../lib/api";
import { createApi } from "@reduxjs/toolkit/query/react";

export const adminApi = createApi({
  reducerPath: "adminApi",
  baseQuery: axiosBaseQuery({ baseUrl: "http://localhost:8787/admin" }),
  endpoints: (b) => ({
    importConfig: b.mutation<
      { routes: number; scenarios: number; valid: boolean },
      {
        body: string;
        isYaml: boolean;
        headers?: Record<string, string>;
      }
    >({
      query: ({ body, headers }) => ({
        url: "/import",
        method: "POST",
        data: body,
        headers,
      }),
    }),
  }),
});

export const { useImportConfigMutation } = adminApi;
