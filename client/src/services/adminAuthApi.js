import { api } from '@/services/api';

export const adminAuthApi = api.injectEndpoints({
  endpoints: (builder) => ({
    adminLogin: builder.mutation({
      query: (credentials) => ({
        url: '/admin/auth/login',
        method: 'POST',
        body: credentials,
      }),
    }),
  }),
});

export const { useAdminLoginMutation } = adminAuthApi;
