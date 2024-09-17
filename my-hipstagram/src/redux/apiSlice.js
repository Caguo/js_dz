import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// Общий запрос для получения постов
const POST_QUERY = `
query PostFind($query: String!) {
  PostFind(query: $query) {
    _id
    title
    text
    images {
      url
    }
    likes {
      _id
      owner {
        _id
        login
      }
    }
    comments {
      text
      owner {
        login
        nick
        avatar {
          url
        }
      }
    }
    owner {
      login
      nick
      avatar {
        url
      }
    }
  }
}
`;

// Запрос для получения постов конкретного пользователя
const USER_POSTS_QUERY = `
query PostFind($query: String!) {
  PostFind(query: $query) {
    _id
    title
    text
    images {
      url
    }
    owner {
      nick
      login
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
        avatar {
          url
        }
      }
    }
  }
}
`;

export const apiSlice = createApi({
  reducerPath: 'api',
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
    fetchPosts: builder.query({
      query: ({ skip, limit }) => {
        const queryArray = [
          {
            $and: [
              { images: { $exists: true } },
              { images: { $not: { $size: 0 } } }
            ]
          },
          {
            sort: [{ _id: -1 }],
            skip: [skip],
            limit: [limit]
          },
        ];
        const queryString = JSON.stringify(queryArray);
        return {
          body: JSON.stringify({
            query: POST_QUERY,
            variables: { query: queryString }
          }),
          method: 'POST',
        };
      },
      transformResponse: (response) => response?.data?.PostFind || [],
    }),
    fetchUserPosts: builder.query({
      query: ({ userId, skip, limit }) => {
        const queryArray = [
          {
            $and: [
              { ___owner: userId }
            ]
          },
          {
            sort: [{ _id: -1 }],
            skip: [skip],
            limit: [limit]
          },
        ];
        const queryString = JSON.stringify(queryArray);
        return {
          body: JSON.stringify({
            query: USER_POSTS_QUERY,
            variables: { query: queryString }
          }),
          method: 'POST',
        };
      },
      transformResponse: (response) => response?.data?.PostFind || [],
    }),
  }),
});

export const { useFetchPostsQuery, useFetchUserPostsQuery } = apiSlice;
