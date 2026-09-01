import { api } from '@/services/api';

export const categoriesApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getPublicCategories: builder.query({
      query: () => '/catalog/categories',
      providesTags: ['Categories'],
      keepUnusedDataFor: 300,
    }),
    getPublicCategoryBySlug: builder.query({
      query: (slug) => `/catalog/categories/${slug}`,
      providesTags: (_result, _error, slug) => [{ type: 'Categories', id: slug }],
    }),
    getAdminCategories: builder.query({
      query: () => '/admin/catalog/categories',
      providesTags: (result) =>
        result?.data?.categories
          ? [
              ...result.data.categories.map(({ id }) => ({
                type: 'Categories',
                id,
              })),
              { type: 'Categories', id: 'ADMIN_LIST' },
            ]
          : [{ type: 'Categories', id: 'ADMIN_LIST' }],
    }),
    getAdminCategoryById: builder.query({
      query: (id) => `/admin/catalog/categories/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Categories', id }],
    }),
    createCategory: builder.mutation({
      query: (formData) => ({
        url: '/admin/catalog/categories',
        method: 'POST',
        body: formData,
      }),
      invalidatesTags: [{ type: 'Categories', id: 'ADMIN_LIST' }, 'Categories'],
    }),
    updateCategory: builder.mutation({
      query: ({ id, formData }) => ({
        url: `/admin/catalog/categories/${id}`,
        method: 'PUT',
        body: formData,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Categories', id },
        { type: 'Categories', id: 'ADMIN_LIST' },
        'Categories',
      ],
    }),
    deleteCategory: builder.mutation({
      query: (id) => ({
        url: `/admin/catalog/categories/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'Categories', id: 'ADMIN_LIST' }, 'Categories'],
    }),
  }),
});

export const {
  useGetPublicCategoriesQuery,
  useGetPublicCategoryBySlugQuery,
  useGetAdminCategoriesQuery,
  useGetAdminCategoryByIdQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
} = categoriesApi;
