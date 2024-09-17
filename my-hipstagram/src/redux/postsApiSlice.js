import { createApi } from '@reduxjs/toolkit/query/react';
import { graphqlRequestBaseQuery } from '@rtk-query/graphql-request-base-query';

// Определите GraphQL API для постов
export const postsApi = createApi({
  reducerPath: 'postsApi',
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
  tagTypes: ['Post'],
  endpoints: (builder) => ({
    createPost: builder.mutation({
      query: (newPost) => ({
        document: `
          mutation AddNewPost($post: PostInput!) {
            PostUpsert(post: $post) {
              _id
              title
              text
              images {
                _id
              }
            }
          }
        `,
        variables: { post: newPost },
      }),
      invalidatesTags: [{ type: 'Post', id: 'LIST' }],
    }),
    updatePost: builder.mutation({
      query: (updatedPost) => ({
        document: `
          mutation UpdatePost($post: PostInput!) {
            PostUpsert(post: $post) {
              _id
              title
              text
              images {
                _id
              }
            }
          }
        `,
        variables: { post: updatedPost },
      }),
      invalidatesTags: (result) => result ? [{ type: 'Post', id: result._id }] : [],
    }),
    deletePost: builder.mutation({
      query: (id) => ({
        document: `
          mutation DeletePost($id: ID!) {
            PostDelete(post: { _id: $id }) {
              _id
            }
          }
        `,
        variables: { id },
      }),
      invalidatesTags: (result) => result ? [{ type: 'Post', id: result._id }] : [],
    }),
    getPost: builder.query({
      query: (id) => ({
        document: `
          query PostFind($query: String!) {
            PostFindOne(query: $query) {
              _id
              title
              text
              images {
                url
              }
            }
          }
        `,
        variables: { query: JSON.stringify([{ _id: id }]) },
      }),
      providesTags: (result) => result ? [{ type: 'Post', id: result._id }] : [],
    }),
  }),
});

export const {
  useCreatePostMutation,
  useUpdatePostMutation,
  useDeletePostMutation,
  useGetPostQuery, // Добавлен хук для получения поста
} = postsApi;

export default postsApi;
