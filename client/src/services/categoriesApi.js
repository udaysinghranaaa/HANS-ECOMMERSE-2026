import { api } from '@/services/api';

export const categoriesApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getPublicCategories: builder.query({
      query: () => '/catalog/categories',
      providesTags: ['Categories'],
    }),
    getAdminCategories: builder.query({
      query: () => '/admin/catalog/categories',
      providesTags: ['Categories'],
    }),
  }),
});

export const {
  useGetPublicCategoriesQuery,
  useGetAdminCategoriesQuery,
} = categoriesApi;
