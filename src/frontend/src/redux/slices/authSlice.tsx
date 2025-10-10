import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import { setUser } from "./userSlice" // Import actions from userSlice
import { RootState } from "../store"

export const authSlice = createApi({
  reducerPath: "authSlice",
  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_API_URL}/api/auth`,    
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
    signup: builder.mutation({
      query: (newUser) => ({
        url: "/signup",
        method: "POST",
        body: newUser,
      }),
    }),
    signupStudent: builder.mutation({
      query: (newStudent) => ({
        url: "/signup-student",
        method: "POST",
        body: { ...newStudent, role: "estudiante" }, // fuerza rol estudiante
      }),
    }),
    signin: builder.mutation({
      query: (credentials) => ({
        url: "/signin",
        method: "POST",
        body: credentials,
      }),
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled
          dispatch(setUser({ user: data.user, accessToken: data.token }))
          localStorage.setItem("token", data.token);
        } catch (error) {
          console.error("Error al iniciar sesión:", error);
        }
      },
    }),
    signout: builder.mutation({
      query: () => ({
        url: "/signout",
        method: "POST",
      }),
    }),
  }),
})

export const {
  useSignupMutation,
  useSignupStudentMutation,
  useSigninMutation,
  useSignoutMutation,
} = authSlice
