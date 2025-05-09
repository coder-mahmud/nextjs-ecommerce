import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const orderApi = createApi({
  reducerPath: 'orderApi',
  tagTypes: ['Order'],
  baseQuery: fetchBaseQuery({ 
    baseUrl: '/api',
    credentials: 'include',
    prepareHeaders: (headers) => {
      // If you need to add headers, do it here
      return headers;
    }
  }),

  endpoints: (builder) => ({
    
    createOrder: builder.mutation({
      query: (data) => ({
        url: '/orders',
        method: 'POST',
        body: data,
      }),
      invalidatesTags:['Order']
    }),

    getOrders: builder.query({
      query: () => ({
        url: '/orders',
        method: 'GET',
      }),
      providesTags:['Order']
    }),

    getSingleOrder: builder.query({
      query: (data) => ({
        url: `/orders/${data.productId}`,
        method: 'GET',
      }),
      providesTags:['Order']
    }),


    editOrder: builder.mutation({
      query: (data) => ({
        url: `/orders/`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags:['Order']
    }),

    
    
    
  }),
});

export const {useCreateOrderMutation, useGetOrdersQuery, } = orderApi;