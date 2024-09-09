import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const userAboutApi = createApi({
  reducerPath: 'userAbout',
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
    fetchUserAbout: builder.query({
      query: (login) => ({
        body: JSON.stringify({
          query: `
            query UserFindOne($login: String!) {
              UserFindOne(query: "[{\\"login\\": \\"${login}\\"]") {
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
          variables: { login },
        }),
        method: 'POST',
      }),
      transformResponse: (response) => response.data.UserFindOne,
    }),
  }),
});

export const { useFetchUserAboutQuery } = userAboutApi;
