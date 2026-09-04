import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { logout } from '@/admin/store/adminAuthSlice';

const API_BASE_URL =
  (import.meta.env.VITE_API_URL ?? '').replace(/\/+$/, '') ||
  (import.meta.env.DEV ? 'http://localhost:5000/api/v1' : '');

const rawBaseQuery = fetchBaseQuery({
  baseUrl: API_BASE_URL,
  prepareHeaders: (headers, { getState }) => {
    const token = getState().adminAuth?.token;

    if (token) {
      headers.set('authorization', `Bearer ${token}`);
    }

    return headers;
  },
});

const isAdminSessionExpired = (error) =>
  error?.status === 401 &&
  typeof error?.data?.message === 'string' &&
  error.data.message.includes('Admin session expired');

const baseQueryWithAdminSessionHandling = async (args, api, extraOptions) => {
  const result = await rawBaseQuery(args, api, extraOptions);

  if (isAdminSessionExpired(result.error)) {
    api.dispatch(logout());

    if (
      typeof window !== 'undefined' &&
      !window.location.pathname.startsWith('/admin/login')
    ) {
      window.location.replace('/admin/login');
    }
  }

  return result;
};

export const api = createApi({
  reducerPath: 'api',
  keepUnusedDataFor: 120,
  refetchOnFocus: false,
  refetchOnReconnect: true,
  baseQuery: baseQueryWithAdminSessionHandling,
  tagTypes: [
    'Auth',
    'Products',
    'Categories',
    'Cart',
    'Orders',
    'Users',
    'Reviews',
    'Wishlist',
    'Payments',
    'Admin',
    'HomepageBanner',
    'Festival',
    'SiteMedia',
    'Enquiries',
  ],
  endpoints: () => ({}),
});
