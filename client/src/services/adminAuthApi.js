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
    adminTotpSetup: builder.mutation({
      query: (pendingToken) => ({
        url: '/admin/auth/totp/setup',
        method: 'POST',
        headers: {
          authorization: `Bearer ${pendingToken}`,
        },
      }),
    }),
    adminTotpEnable: builder.mutation({
      query: ({ pendingToken, code }) => ({
        url: '/admin/auth/totp/enable',
        method: 'POST',
        headers: {
          authorization: `Bearer ${pendingToken}`,
        },
        body: { code },
      }),
    }),
    adminTotpVerify: builder.mutation({
      query: ({ pendingToken, code }) => ({
        url: '/admin/auth/totp/verify',
        method: 'POST',
        headers: {
          authorization: `Bearer ${pendingToken}`,
        },
        body: { code },
      }),
    }),
    adminTotpRecover: builder.mutation({
      query: ({ pendingToken, backupCode }) => ({
        url: '/admin/auth/totp/recover',
        method: 'POST',
        headers: {
          authorization: `Bearer ${pendingToken}`,
        },
        body: { backupCode },
      }),
    }),
  }),
});

export const {
  useAdminLoginMutation,
  useAdminTotpSetupMutation,
  useAdminTotpEnableMutation,
  useAdminTotpVerifyMutation,
  useAdminTotpRecoverMutation,
} = adminAuthApi;
