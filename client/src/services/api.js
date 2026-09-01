import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const API_BASE_URL =
  (import.meta.env.VITE_API_URL ?? '').replace(/\/+$/, '') ||
  (import.meta.env.DEV ? 'http://localhost:5000/api/v1' : '');

export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: API_BASE_URL,
    prepareHeaders: (headers, { getState }) => {
      const token = getState().adminAuth?.token;

      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }

      return headers;
    },
  }),
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
