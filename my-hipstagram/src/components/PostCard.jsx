import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Box, Card, CardContent, CardMedia, CircularProgress, Avatar, IconButton, Typography } from '@mui/material';
import { useFetchPostsQuery, useFetchUserPostsQuery } from '../redux/apiSlice';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import CommentIcon from '@mui/icons-material/Comment';
import PostModal from '../hooks/PostModal';
import { useLikePostMutation, useUnlikePostMutation } from '../hooks/commentsApi';
import { useSelector, useDispatch } from 'react-redux';
import { actionAboutMe } from '../redux/actions';
import { useLocation } from 'react-router-dom';

const BASE_URL = 'http://hipstagram.node.ed.asmer.org.ua/'; // Убедитесь, что это правильный базовый URL

const PostCard = () => {
  const dispatch = useDispatch();
  const [page, setPage] = useState(1);
  const [allPosts, setAllPosts] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [likedPosts, setLikedPosts] = useState({});
  const [selectedPost, setSelectedPost] = useState(null);
  const loadMoreRef = useRef(null);
  const location = useLocation();

  const [likePost] = useLikePostMutation();
  const [unlikePost] = useUnlikePostMutation();

  const authUser = useSelector((state) => state.auth.user?.UserFindOne || {});
  const userId = authUser?._id;
  
  useEffect(() => {
    if (!authUser) {
      dispatch(actionAboutMe());
    }
  }, [authUser, dispatch]);

  const userSubscriptions = (authUser?.following) || [];

  const isOnMainPage = location.pathname === '/main';
  const shouldFetchUserPosts = isOnMainPage && userSubscriptions.length > 0;

  const fetchUserPostsQuery = useFetchUserPostsQuery(
    { userId, skip: (page - 1) * 20, limit: 20 },
    { skip: !shouldFetchUserPosts }
  );

  const fetchPostsQuery = useFetchPostsQuery(
    { skip: (page - 1) * 20, limit: 20 },
    { skip: isOnMainPage && shouldFetchUserPosts }
  );

  const { data: posts = [], error, isLoading, isFetching } = isOnMainPage ? (shouldFetchUserPosts ? fetchUserPostsQuery : fetchPostsQuery) : fetchPostsQuery;

  useEffect(() => {
    if (posts.length > 0) {
      setAllPosts(prevPosts => {
        const newPosts = posts.filter(post => !prevPosts.some(prevPost => prevPost._id === post._id));
        return [...prevPosts, ...newPosts];
      });
      setHasMore(posts.length === 20);
    } else {
      setHasMore(false);
    }
  }, [posts]);

  useEffect(() => {
    if (userId) {
      const newLikedPosts = allPosts.reduce((acc, post) => {
        const userHasLiked = post.likes.some(like => like.owner?._id === userId);
        if (userHasLiked) {
          acc[post._id] = true;
        }
        return acc;
      }, {});
      setLikedPosts(newLikedPosts);
    }
  }, [allPosts, userId]);

  const loadMorePosts = useCallback(() => {
    if (!isFetching && hasMore) {
      setPage(prevPage => prevPage + 1);
    }
  }, [isFetching, hasMore]);

  useEffect(() => {
    const handle = () => {
      const currentRef = loadMoreRef.current;
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting && !isFetching && hasMore) {
            loadMorePosts();
          }
        },
        { threshold: 0.1 }
      );

      if (currentRef) {
        observer.observe(currentRef);
      }

      return () => {
        if (currentRef) {
          observer.unobserve(currentRef);
        }
      };
    };

    requestAnimationFrame(handle);
  }, [loadMorePosts, isFetching, hasMore]);

  const handleLikeToggle = useCallback(async (postId) => {
    if (!userId) {
      console.error('Пользователь не авторизован');
      return;
    }

    try {
      const post = allPosts.find(p => p._id === postId);
      const userHasLiked = likedPosts[postId] || false;

      if (userHasLiked) {
        const userLike = post.likes.find(like => like.owner?._id === userId);
        if (userLike) {
          await unlikePost({ likeId: userLike._id }).unwrap();
          setLikedPosts(prev => {
            const newLikedPosts = { ...prev };
            delete newLikedPosts[postId];
            return newLikedPosts;
          });
          setAllPosts(prevPosts =>
            prevPosts.map(p =>
              p._id === postId ? { ...p, likes: p.likes.filter(like => like.owner?._id !== userId) } : p
            )
          );
        }
      } else {
        const response = await likePost({ postId, userId }).unwrap();
        const likeIdFromResponse = response?.LikeUpsert?._id;
        if (likeIdFromResponse) {
          setLikedPosts(prev => ({ ...prev, [postId]: true }));
          setAllPosts(prevPosts =>
            prevPosts.map(p =>
              p._id === postId ? { ...p, likes: [...p.likes, { owner: { _id: userId }, _id: likeIdFromResponse }] } : p
            )
          );
        } else {
          console.error('Ответ от API не содержит идентификатора лайка');
        }
      }
    } catch (err) {
      console.error('Ошибка при добавлении/удалении лайка:', err);
    }
  }, [allPosts, likedPosts, userId, likePost, unlikePost]);

  const handleOpenPost = (post) => {
    setSelectedPost(post);
  };

  const handleClosePost = () => {
    setSelectedPost(null);
  };

  const handleAddComment = (postId, newComment) => {
    setAllPosts(prevPosts =>
      prevPosts.map(post =>
        post._id === postId ? { ...post, comments: [...post.comments, newComment] } : post
      )
    );
  };

  if (isLoading && !allPosts.length) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 2 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Typography variant="body1" textAlign="center">
        Ошибка при загрузке данных постов: {error.message}
      </Typography>
    );
  }

  if (!allPosts.length) {
    return (
      <Typography variant="body1" textAlign="center">
        Нет постов для отображения
      </Typography>
    );
  }

  return (
    <Box sx={{ padding: 2 }}>
      {allPosts.map((post) => {
        const imageUrl = post.images?.[0]?.url ? `${BASE_URL}${post.images[0].url}` : null;
        const author = post.owner?.nick || post.owner?.login || 'Неизвестный';
        const authorAvatar = post.owner?.avatar?.url ? `${BASE_URL}${post.owner.avatar.url}` : null;
        const likeCount = post.likes?.length || 0;
        const commentCount = post.comments?.length || 0;
        const userHasLiked = likedPosts[post._id] || false;

        return (
          <Box key={post._id} sx={{ marginBottom: 4 }}>
            <Card
              sx={{
                maxWidth: 600,
                margin: 'auto',
                boxShadow: 3,
                borderRadius: 2,
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column'
              }}
            >
              <CardContent sx={{ display: 'flex', alignItems: 'center', padding: 2 }}>
                <Avatar
                  src={authorAvatar}
                  sx={{ marginRight: 2, width: 56, height: 56 }}
                >
                  {!authorAvatar && author.charAt(0)}
                </Avatar>
                <Typography sx={{ fontWeight:'bold'}} variant="body1">{author}</Typography>
              </CardContent>
              <Box
                sx={{
                  position: 'relative',
                  width: '100%',
                  height: 400,
                  cursor: 'pointer', // Курсор только для изображения
                }}
                onClick={() => handleOpenPost(post)} // Обработчик клика для открытия модального окна
              >
                {imageUrl ? (
                  <CardMedia
                    component="img"
                    image={imageUrl}
                    alt="Post image"
                    sx={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'contain',
                      borderRadius: 1
                    }}
                  />
                ) : (
                  <Box
                    sx={{
                      width: '100%',
                      height: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: '#f0f0f0',
                      color: '#888'
                    }}
                  >
                    <Typography variant="h6">Изображение отсутствует</Typography>
                  </Box>
                )}
              </Box>
              <CardContent
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  padding: 2,
                  cursor: 'default' // Убирает курсор для остальных частей карточки
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <IconButton
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation(); // Останавливает всплытие события клика
                      handleLikeToggle(post._id);
                    }}
                    sx={{
                      color: userHasLiked ? 'error.main' : 'text.disabled',
                      transition: 'color 0.3s ease',
                      '&:hover': {
                        color: userHasLiked ? 'error.light' : 'error.main'
                      }
                    }}
                  >
                    {userHasLiked ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                  </IconButton>
                  <Typography variant="body2">{likeCount}</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <IconButton
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation(); // Останавливает всплытие события клика
                      handleOpenPost(post);
                    }}
                  >
                    <CommentIcon />
                  </IconButton>
                  <Typography variant="body2">{commentCount}</Typography>
                </Box>
              </CardContent>
            </Card>
          </Box>
        );
      })}

      <Box ref={loadMoreRef} sx={{ display: 'flex', justifyContent: 'center', marginTop: 4, height: '5px' }}>
        {isFetching && hasMore && <CircularProgress />}
      </Box>

      {selectedPost && (
        <PostModal
          post={selectedPost}
          onClose={handleClosePost}
          onLikeToggle={() => handleLikeToggle(selectedPost._id)}
          userHasLiked={!!likedPosts[selectedPost._id]}
          likeCount={allPosts.find(post => post._id === selectedPost._id)?.likes.length || 0}
          comments={selectedPost.comments || []}
          onAddComment={(newComment) => handleAddComment(selectedPost._id, newComment)}
        />
      )}
    </Box>
  );
};

export default PostCard;