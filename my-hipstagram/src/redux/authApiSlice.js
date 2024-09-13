import { createApi } from '@reduxjs/toolkit/query/react';
import { graphqlRequestBaseQuery } from '@rtk-query/graphql-request-base-query';

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: graphqlRequestBaseQuery({
    url: 'http://hipstagram.node.ed.asmer.org.ua/graphql',
  }),
  endpoints: (builder) => ({
    login: builder.mutation({
      query: ({ login, password }) => ({
        document: `
          query login($login: String!, $password: String!) {
            login(login: $login, password: $password) 
          }
        `,
        variables: { login, password },
      }),
    }),
    register: builder.mutation({
      query: ({ login, password }) => ({
        document: `
          mutation createUser($login: String!, $password: String!) {
            createUser(login: $login, password: $password) {
              _id
              login
            }
          }
        `,
        variables: { login, password },
      }),
    }),
  }),
});

export const { useLoginMutation, useRegisterMutation } = authApi;
export default authApi;
