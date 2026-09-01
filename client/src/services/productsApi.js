import { api } from '@/services/api';

export const productsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getPublicProducts: builder.query({
      query: (categorySlug) => ({
        url: '/catalog/products',
        params: categorySlug ? { category: categorySlug } : undefined,
      }),
      providesTags: (result) =>
        result?.data?.products
          ? [
              ...result.data.products.map(({ id }) => ({ type: 'Products', id })),
              { type: 'Products', id: 'LIST' },
            ]
          : [{ type: 'Products', id: 'LIST' }],
      keepUnusedDataFor: 120,
    }),
    getPublicProductById: builder.query({
      query: (id) => `/catalog/products/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Products', id }],
      keepUnusedDataFor: 120,
    }),
    getFeaturedProducts: builder.query({
      query: () => '/catalog/products/featured',
      providesTags: [{ type: 'Products', id: 'FEATURED' }],
      keepUnusedDataFor: 120,
    }),
    getAdminProducts: builder.query({
      query: () => '/admin/catalog/products',
      providesTags: (result) =>
        result?.data?.products
          ? [
              ...result.data.products.map(({ id }) => ({ type: 'Products', id })),
              { type: 'Products', id: 'ADMIN_LIST' },
            ]
          : [{ type: 'Products', id: 'ADMIN_LIST' }],
    }),
    getAdminProductById: builder.query({
      query: (id) => `/admin/catalog/products/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Products', id }],
    }),
    createProduct: builder.mutation({
      query: (formData) => ({
        url: '/admin/catalog/products',
        method: 'POST',
        body: formData,
      }),
      invalidatesTags: [
        { type: 'Products', id: 'LIST' },
        { type: 'Products', id: 'ADMIN_LIST' },
        { type: 'Products', id: 'FEATURED' },
        { type: 'Festival', id: 'ACTIVE' },
        { type: 'Festival', id: 'ADMIN_LIST' },
      ],
    }),
    updateProduct: builder.mutation({
      query: ({ id, formData }) => ({
        url: `/admin/catalog/products/${id}`,
        method: 'PUT',
        body: formData,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Products', id },
        { type: 'Products', id: 'LIST' },
        { type: 'Products', id: 'ADMIN_LIST' },
        { type: 'Products', id: 'FEATURED' },
        { type: 'Festival', id: 'ACTIVE' },
        { type: 'Festival', id: 'ADMIN_LIST' },
      ],
    }),
    deleteProduct: builder.mutation({
      query: (id) => ({
        url: `/admin/catalog/products/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [
        { type: 'Products', id: 'LIST' },
        { type: 'Products', id: 'ADMIN_LIST' },
        { type: 'Products', id: 'FEATURED' },
        { type: 'Festival', id: 'ACTIVE' },
        { type: 'Festival', id: 'ADMIN_LIST' },
      ],
    }),
  }),
});

export const {
  useGetPublicProductsQuery,
  useGetPublicProductByIdQuery,
  useGetFeaturedProductsQuery,
  useGetAdminProductsQuery,
  useGetAdminProductByIdQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
} = productsApi;
