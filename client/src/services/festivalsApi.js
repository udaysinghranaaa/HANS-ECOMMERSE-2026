import { api } from '@/services/api';

export const festivalsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getActiveFestival: builder.query({
      query: () => '/festivals/active',
      providesTags: [{ type: 'Festival', id: 'ACTIVE' }],
      keepUnusedDataFor: 120,
    }),
    getAdminFestivals: builder.query({
      query: () => '/admin/festivals',
      providesTags: (result) =>
        result?.data?.festivals
          ? [
              ...result.data.festivals.map(({ id }) => ({ type: 'Festival', id })),
              { type: 'Festival', id: 'ADMIN_LIST' },
            ]
          : [{ type: 'Festival', id: 'ADMIN_LIST' }],
    }),
    getAdminFestivalById: builder.query({
      query: (id) => `/admin/festivals/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Festival', id }],
    }),
    createFestival: builder.mutation({
      query: (formData) => ({
        url: '/admin/festivals',
        method: 'POST',
        body: formData,
      }),
      invalidatesTags: [{ type: 'Festival', id: 'ADMIN_LIST' }, { type: 'Festival', id: 'ACTIVE' }, { type: 'Products', id: 'LIST' }, { type: 'Products', id: 'FEATURED' }],
    }),
    updateFestival: builder.mutation({
      query: ({ id, formData }) => ({
        url: `/admin/festivals/${id}`,
        method: 'PUT',
        body: formData,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Festival', id },
        { type: 'Festival', id: 'ADMIN_LIST' },
        { type: 'Festival', id: 'ACTIVE' },
        { type: 'Products', id: 'LIST' },
        { type: 'Products', id: 'FEATURED' },
      ],
    }),
    deleteFestival: builder.mutation({
      query: (id) => ({
        url: `/admin/festivals/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [
        { type: 'Festival', id: 'ADMIN_LIST' },
        { type: 'Festival', id: 'ACTIVE' },
        { type: 'Products', id: 'LIST' },
        { type: 'Products', id: 'ADMIN_LIST' },
      ],
    }),
    assignFestivalProducts: builder.mutation({
      query: ({ festivalId, productIds }) => ({
        url: `/admin/festivals/${festivalId}/products/batch`,
        method: 'POST',
        body: { productIds },
      }),
      invalidatesTags: (_result, _error, { festivalId }) => [
        { type: 'Festival', id: festivalId },
        { type: 'Festival', id: 'ACTIVE' },
        { type: 'Products', id: 'ADMIN_LIST' },
        { type: 'Products', id: 'LIST' },
        { type: 'Products', id: 'FEATURED' },
      ],
    }),
    assignFestivalProduct: builder.mutation({
      query: ({ festivalId, productId }) => ({
        url: `/admin/festivals/${festivalId}/products`,
        method: 'POST',
        body: { productId },
      }),
      invalidatesTags: (_result, _error, { festivalId }) => [
        { type: 'Festival', id: festivalId },
        { type: 'Festival', id: 'ACTIVE' },
        { type: 'Products', id: 'ADMIN_LIST' },
        { type: 'Products', id: 'LIST' },
        { type: 'Products', id: 'FEATURED' },
      ],
    }),
    removeFestivalProduct: builder.mutation({
      query: ({ festivalId, productId }) => ({
        url: `/admin/festivals/${festivalId}/products/${productId}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_result, _error, { festivalId, productId }) => [
        { type: 'Festival', id: festivalId },
        { type: 'Festival', id: 'ACTIVE' },
        { type: 'Products', id: productId },
        { type: 'Products', id: 'ADMIN_LIST' },
        { type: 'Products', id: 'LIST' },
        { type: 'Products', id: 'FEATURED' },
      ],
    }),
  }),
});

export const {
  useGetActiveFestivalQuery,
  useGetAdminFestivalsQuery,
  useGetAdminFestivalByIdQuery,
  useCreateFestivalMutation,
  useUpdateFestivalMutation,
  useDeleteFestivalMutation,
  useAssignFestivalProductsMutation,
  useAssignFestivalProductMutation,
  useRemoveFestivalProductMutation,
} = festivalsApi;
