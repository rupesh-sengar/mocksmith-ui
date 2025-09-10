import { axiosBaseQuery } from "../lib/api";
import { createApi } from "@reduxjs/toolkit/query/react";

export const adminApi = createApi({
  reducerPath: "adminApi",
  baseQuery: axiosBaseQuery({ baseUrl: "http://localhost:8787/admin" }),
  tagTypes: ["Routes"],
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
      invalidatesTags: ["Routes"],
    }),
    getRoutes: b.query<
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      any, // Replace 'any' with the actual response type if known
      { headers?: Record<string, string> }
    >({
      query: ({ headers }) => ({
        url: "/routes",
        method: "GET",
        headers,
      }),
      providesTags: [{ type: "Routes", id: "LIST" }],
    }),
  }),
});

export const { useImportConfigMutation, useGetRoutesQuery } = adminApi;
