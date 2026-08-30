import { api } from '@/services/api';

export const enquiriesApi = api.injectEndpoints({
  endpoints: (builder) => ({
    submitContactEnquiry: builder.mutation({
      query: (body) => ({
        url: '/contact/enquiries',
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'Enquiries', id: 'LIST' }],
    }),
    getAdminEnquiries: builder.query({
      query: (limit) => ({
        url: '/admin/enquiries',
        params: limit ? { limit } : undefined,
      }),
      providesTags: (result) =>
        result?.data?.enquiries
          ? [
              ...result.data.enquiries.map(({ id }) => ({
                type: 'Enquiries',
                id,
              })),
              { type: 'Enquiries', id: 'LIST' },
            ]
          : [{ type: 'Enquiries', id: 'LIST' }],
    }),
    updateEnquiryStatus: builder.mutation({
      query: ({ id, status }) => ({
        url: `/admin/enquiries/${id}/status`,
        method: 'PATCH',
        body: { status },
      }),
      async onQueryStarted({ id, status }, { dispatch, queryFulfilled }) {
        const patchResults = [];

        patchResults.push(
          dispatch(
            api.util.updateQueryData(
              'getAdminEnquiries',
              undefined,
              (draft) => {
                const enquiry = draft.data?.enquiries?.find(
                  (entry) => entry.id === id,
                );

                if (enquiry) {
                  enquiry.status = status;
                }
              },
            ),
          ),
        );

        patchResults.push(
          dispatch(
            api.util.updateQueryData('getAdminEnquiries', 5, (draft) => {
              const enquiry = draft.data?.enquiries?.find(
                (entry) => entry.id === id,
              );

              if (enquiry) {
                enquiry.status = status;
              }
            }),
          ),
        );

        try {
          await queryFulfilled;
        } catch {
          patchResults.forEach((patchResult) => patchResult.undo());
        }
      },
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Enquiries', id },
        { type: 'Enquiries', id: 'LIST' },
      ],
    }),
    deleteEnquiry: builder.mutation({
      query: (id) => ({
        url: `/admin/enquiries/${id}`,
        method: 'DELETE',
      }),
      async onQueryStarted(id, { dispatch, queryFulfilled }) {
        const patchResults = [];

        const removeFromCache = (arg) => {
          patchResults.push(
            dispatch(
              api.util.updateQueryData('getAdminEnquiries', arg, (draft) => {
                if (draft.data?.enquiries) {
                  draft.data.enquiries = draft.data.enquiries.filter(
                    (entry) => entry.id !== id,
                  );
                }

                if (draft.data?.stats) {
                  draft.data.stats.total = Math.max(
                    0,
                    (draft.data.stats.total ?? 1) - 1,
                  );
                }
              }),
            ),
          );
        };

        removeFromCache(undefined);
        removeFromCache(5);

        try {
          await queryFulfilled;
        } catch {
          patchResults.forEach((patchResult) => patchResult.undo());
        }
      },
      invalidatesTags: [{ type: 'Enquiries', id: 'LIST' }],
    }),
  }),
});

export const {
  useSubmitContactEnquiryMutation,
  useGetAdminEnquiriesQuery,
  useUpdateEnquiryStatusMutation,
  useDeleteEnquiryMutation,
} = enquiriesApi;
