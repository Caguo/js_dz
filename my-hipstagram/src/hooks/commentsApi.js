import { createApi } from '@reduxjs/toolkit/query/react';
import { graphqlRequestBaseQuery } from '@rtk-query/graphql-request-base-query';

export const commentsApi = createApi({
  reducerPath: 'commentsApi',
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
  endpoints: (builder) => ({
    addComment: builder.mutation({
      query: (comment) => ({
        document: `
          mutation AddCommentToPost($comment: CommentInput!) {
            CommentUpsert(comment: $comment) {
              _id
              text
              post {
                _id
                title
              }
            }
          }
        `,
        variables: {
          comment: {
            text: comment.text,
            post: {
              _id: comment.postId
            }
          }
        },
      }),
    }),
    likePost: builder.mutation({
      query: ({ postId, userId }) => ({
        document: `
          mutation LikePost($postId: ID!, $userId: String!) {
            LikeUpsert(
              like: {
                post: { _id: $postId }
                user: { _id: $userId }
              }
            ) {
              _id
              post {
                _id
              }
              owner {
                _id
              }
            }
          }
        `,
        variables: {
          postId,
          userId
        },
      }),
    }),
    unlikePost: builder.mutation({
      query: ({ likeId }) => ({
        document: `
          mutation LikeDelete($likeId: ID!) {
            LikeDelete(
              like: { _id: $likeId }
            ) {
              _id
              post {
                _id
              }
              owner {
                _id
              }
            }
          }
        `,
        variables: {
          likeId
        },
      }),
    }),
  }),
});

export const { useAddCommentMutation, useLikePostMutation, useUnlikePostMutation } = commentsApi;
export default commentsApi;
