import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import { RootState } from "../store"

export const usersSlice = createApi({
  reducerPath: "usersSlice",
  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_API_URL}/api/user`,
    credentials: "include",
    prepareHeaders: (headers, { getState }) => {
      const state = getState() as RootState
      const token = state.user.token
      if (token) {
        headers.set("Authorization", `Bearer ${token}`)
      }
      return headers
    },
  }),
  tagTypes: ["User"],
  endpoints: (builder) => ({
    updateUser: builder.mutation({
      query: ({ id, ...updatedUser }) => ({
        url: `/update/${id}`,
        method: "PUT",
        body: updatedUser,
      }),
      invalidatesTags: ["User"],
    }),
    getUserDetails: builder.query({
      query: (id) => ({
        url: `/user/${id}`,
        method: "GET",
      }),
      providesTags: ["User"],
    }),
    getAllUsers: builder.query({
      query: () => ({
        url: "/all",
        method: "GET",
      }),
    }),
    deleteUser: builder.mutation({
      query: (id) => ({
        url: `/delete/${id}`,
        method: "DELETE",
      }),
    }),
  }),
})

export const {
  useUpdateUserMutation,
  useGetUserDetailsQuery,
  useGetAllUsersQuery,
  useDeleteUserMutation,
} = usersSlice