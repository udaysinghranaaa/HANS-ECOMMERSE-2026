import { api } from './api';

export const siteMediaApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getSiteMedia: builder.query({
      query: () => '/site/media',
      providesTags: [{ type: 'SiteMedia', id: 'PUBLIC' }],
    }),
    getAdminSiteMedia: builder.query({
      query: () => '/admin/site/media',
      providesTags: [{ type: 'SiteMedia', id: 'ADMIN_LIST' }],
    }),
    uploadSiteMedia: builder.mutation({
      query: ({ key, formData }) => ({
        url: `/admin/site/media/${key}`,
        method: 'POST',
        body: formData,
      }),
      invalidatesTags: [
        { type: 'SiteMedia', id: 'ADMIN_LIST' },
        { type: 'SiteMedia', id: 'PUBLIC' },
      ],
    }),
  }),
});

export const {
  useGetSiteMediaQuery,
  useGetAdminSiteMediaQuery,
  useUploadSiteMediaMutation,
} = siteMediaApi;
