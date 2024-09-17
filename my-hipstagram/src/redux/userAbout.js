import { createApi } from '@reduxjs/toolkit/query/react';
import { graphqlRequestBaseQuery } from '@rtk-query/graphql-request-base-query';

export const userAboutApi = createApi({
  reducerPath: 'userAbout',
  baseQuery: graphqlRequestBaseQuery({
    url: 'http://hipstagram.node.ed.asmer.org.ua/graphql',
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth?.token;
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['User'],
  endpoints: (builder) => ({
    getUserById: builder.query({
      query: (_id) => ({
        document: `
          query UserFindOne($query: String!) {
            UserFindOne(query: $query) {
              _id
              login
              nick
              avatar {
                url
              }
              followers {
                _id
                login
              }
              following {
                _id
                login
              }
            }
          }
        `,
        variables: { query: JSON.stringify([{ _id }]) },
      }),
      providesTags: (result, error, id) => result ? [{ type: 'User', id: result._id }] : [],
    }),
    updateUser: builder.mutation({
      query: (user) => ({
        document: `
          mutation UpdateUser($user: UserInput!) {
            UserUpsert(user: $user) {
              _id
              login
              nick
            }
          }
        `,
        variables: { user },
      }),
      invalidatesTags: (result) => result ? [{ type: 'User', id: result._id }] : [],
    }),
  }),
});

export const { useGetUserByIdQuery, useUpdateUserMutation } = userAboutApi;
export default userAboutApi;
