import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const userApiSlice = createApi({
  reducerPath: 'userApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://hipstagram.node.ed.asmer.org.ua/graphql',
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth?.token;
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      headers.set('Content-Type', 'application/json');
      return headers;
    },
  }),
  endpoints: (builder) => ({
    fetchUserInfo: builder.query({
      query: (login) => ({
        body: JSON.stringify({
          query: `
            query UserFindOne {
              UserFindOne(query: "[{\\"login\\": \\"${login}\\"}]") {
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
        }),
        method: 'POST',
      }),
      transformResponse: (response) => response.data.UserFindOne,
    }),
    fetchUserPosts: builder.query({
      query: (userId) => ({
        body: JSON.stringify({
          query: `
            query PostFind {
              PostFind(query: "[{\\"___owner\\": \\"${userId}\\"}]") {
                _id
                title
                images {
                  url
                }
              }
            }
          `,
        }),
        method: 'POST',
      }),
      transformResponse: (response) => response.data.PostFind,
    }),
    userUpsert: builder.mutation({
      query: (user) => ({
        body: JSON.stringify({
          query: `
            mutation UserUpsert {
              UserUpsert(user: ${JSON.stringify(user)}) {
                _id
                login
                avatar {
                  url
                }
                followers {
                  _id
                }
                following {
                  _id
                }
              }
            }
          `,
        }),
        method: 'POST',
      }),
      transformResponse: (response) => response.data.UserUpsert,
    }),
    toggleFollow: builder.mutation({
      query: ({ currentUserId, targetUserId }) => ({
        body: JSON.stringify({
          query: `
            mutation FollowUser($currentUserId: String!, $targetUserId: String!) {
              UserUpsert(user: {
                _id: $currentUserId, 
                following: [{ 
                  _id: $targetUserId
                }]
              }) {
                _id
                login
                following {
                  _id
                  login
                }
              }
            }
          `,
          variables: {
            currentUserId,
            targetUserId,
          },
        }),
        method: 'POST',
      }),
      transformResponse: (response) => response.data.UserUpsert,
    }),  
    searchUsers: builder.query({
      query: (searchQuery) => ({
        body: JSON.stringify({
          query: `
            query UserFind {
              UserFind(query: "[{\\"$or\\":[{\\"login\\":{\\"$regex\\":\\"${searchQuery}\\"}}, {\\"nick\\":{\\"$regex\\":\\"${searchQuery}\\"}}]}]") {
                _id
                login
                nick
                avatar {
                  url
                }
              }
            }
          `,
        }),
        method: 'POST',
      }),
      transformResponse: (response) => response.data.UserFind,
    }),
  }),
});

export const {
  useFetchUserInfoQuery,
  useFetchUserPostsQuery,
  useUserUpsertMutation,
  useToggleFollowMutation,
  useSearchUsersQuery,
} = userApiSlice;