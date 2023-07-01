import { db } from '../firebase';
import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/query/react';
import { query, collection, orderBy, getDocs, where, onSnapshot } from 'firebase/firestore';

export type Comment = {
  id: string;
  body: string;
  username: string;
  createdAt: { seconds: number };
  postId: string;
  postTitle: string;
  voteScore: number;
  subName: string;
};

export const api = createApi({
  tagTypes: ['Post', 'Sub', 'Comment', 'Vote', 'User'],
  baseQuery: fakeBaseQuery(),
  endpoints: (builder) => ({
    getPosts: builder.query<Post[], void>({
      async queryFn() {
        try {
          const postsQuery = query(collection(db, 'posts'), orderBy('voteScore', 'desc'));
          const querySnaphot = await getDocs(postsQuery);
          let posts = [];
          querySnaphot?.forEach((doc) => {
            posts.push({ id: doc.id, ...doc.data() });
          });

          return { data: posts };
        } catch (error) {
          return { error };
        }
      },
      providesTags: ['Post'],
    }),
    getSubs: builder.query<Sub[], void>({
      async queryFn() {
        try {
          const subsQuery = query(collection(db, 'subs'), orderBy('postCount', 'desc'));
          const querySnaphot = await getDocs(subsQuery);
          let subs = [];
          querySnaphot?.forEach((doc) => {
            subs.push({ id: doc.id, ...doc.data() });
          });

          return { data: subs };
        } catch (error) {
          return { error };
        }
      },
      providesTags: ['Sub'],
    }),
    getUsers: builder.query<User[], void>({
      async queryFn() {
        try {
          const usersQuery = collection(db, 'users');
          const querySnaphot = await getDocs(usersQuery);
          let users = [];
          querySnaphot?.forEach((doc) => {
            users.push({ id: doc.id, ...doc.data() });
          });

          return { data: users };
        } catch (error) {
          return { error };
        }
      },
      providesTags: ['User'],
    }),
    getComments: builder.query<Comment[], void>({
      async queryFn() {
        try {
          const commentsQuery = query(collection(db, 'comments'), orderBy('voteScore', 'desc'));
          const querySnaphot = await getDocs(commentsQuery);
          let comments = [];
          querySnaphot?.forEach((doc) => {
            comments.push({ id: doc.id, ...doc.data() });
          });

          return { data: comments };
        } catch (error) {
          return { error };
        }
      },
      providesTags: ['Comment'],
    }),
    getVotesByPostId: builder.query<any, string>({
      async queryFn() {
        return {
          data: null,
        };
      },
      async onCacheEntryAdded(postId, { updateCachedData, cacheDataLoaded, cacheEntryRemoved }) {
        let unsubscribe = () => {};
        try {
          await cacheDataLoaded;
          const votesQuery = query(
            collection(db, 'votes'),
            where('postId', '==', postId),
            orderBy('timestamp', 'desc')
          );
          unsubscribe = onSnapshot(votesQuery, (snapshot) => {
            updateCachedData(() => {
              return snapshot?.docs?.map((doc) => ({
                id: doc.id,
                ...doc.data(),
              }));
            });
          });
        } catch (error) {
          console.log(error);
        }
        await cacheEntryRemoved;
        unsubscribe();
      },
      providesTags: ['Vote'],
    }),
  }),
});

export const {
  useGetPostsQuery,
  useGetSubsQuery,
  useGetUsersQuery,
  useGetCommentsQuery,
  useLazyGetVotesByPostIdQuery,
} = api;
