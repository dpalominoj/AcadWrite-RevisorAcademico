import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"

export const testSlice = createApi({
  reducerPath: "testApi",
  baseQuery: fetchBaseQuery({ baseUrl: `${import.meta.env.VITE_API_URL}/api/user` }),
  endpoints: (builder) => ({
    test: builder.query({
      query: () => "/test",
    }),
  }),
})

export const { useTestQuery } = testSlice
