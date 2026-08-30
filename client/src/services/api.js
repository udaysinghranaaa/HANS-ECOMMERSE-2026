import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { config } from '@/config';

export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: config.apiUrl,
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
