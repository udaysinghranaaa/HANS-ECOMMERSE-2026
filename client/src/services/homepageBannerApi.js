import { api } from '@/services/api';

export const homepageBannerApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getPublicHomepageBanners: builder.query({
      query: () => '/homepage/banners',
      providesTags: ['HomepageBanner'],
      keepUnusedDataFor: 15,
    }),
    getAdminHomepageBanners: builder.query({
      query: () => '/admin/homepage/banners',
      providesTags: ['HomepageBanner'],
    }),
    uploadHomepageBanner: builder.mutation({
      query: ({ position, formData }) => ({
        url: `/admin/homepage/banners/${position}`,
        method: 'POST',
        body: formData,
      }),
      invalidatesTags: ['HomepageBanner'],
    }),
    updateHomepageBanner: builder.mutation({
      query: ({ position, ...body }) => ({
        url: `/admin/homepage/banners/${position}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['HomepageBanner'],
    }),
    deleteHomepageBanner: builder.mutation({
      query: (position) => ({
        url: `/admin/homepage/banners/${position}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['HomepageBanner'],
    }),
  }),
});

export const {
  useGetPublicHomepageBannersQuery,
  useGetAdminHomepageBannersQuery,
  useUploadHomepageBannerMutation,
  useUpdateHomepageBannerMutation,
  useDeleteHomepageBannerMutation,
} = homepageBannerApi;
