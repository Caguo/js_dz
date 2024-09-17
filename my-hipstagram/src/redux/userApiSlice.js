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
                  text
                  images {
                    url
                  }
                  owner {
                    login
                    nick
                    avatar{
                      url
                    }
                  }
                  likes {
                    _id
                  }
                  comments {
                    text
                    owner {
                      login
                      nick
                      avatar{
                        url
                      }
                    }
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
      query: ({ currentUserId, following }) => ({
        body: JSON.stringify({
          query: `
              mutation FollowUser($currentUserId: String!, $following: [UserInput!]!) {
                UserUpsert(user: {
                  _id: $currentUserId,
                  following: $following
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
            following,
          },
        }),
        method: 'POST',
      }),
      transformResponse: (response) => response.data.UserUpsert,
    }),
    searchUsers: builder.query({
      query: ({ searchQuery, searchField }) => {
        const query = `
          query UserFind {
            UserFind(query: "[{ \\"${searchField}\\": {\\"$regex\\": \\"${searchQuery}\\", \\"$options\\": \\"i\\"} } ]") {
              _id
              login
              nick
              avatar {
                url
              }
            }
          }
        `;
        
        return {
          body: JSON.stringify({ query }),
          method: 'POST',
        };
      },
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
