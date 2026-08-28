import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { config } from '@/config';

export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: config.apiUrl,
    prepareHeaders: (headers) => {
      // Future: attach authentication token from Redux state
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
  ],
  endpoints: () => ({}),
});
