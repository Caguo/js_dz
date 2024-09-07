import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Box, Card, CardContent, CardMedia, CircularProgress, Button, Avatar, IconButton, Typography, Dialog, DialogTitle, DialogContent, TextField, DialogActions } from '@mui/material';
import { useFetchPostsQuery } from '../redux/apiSlice';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder'; // Иконка для не лайкнутого поста
import CommentIcon from '@mui/icons-material/Comment'; // Иконка для комментариев
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const BASE_URL = 'http://hipstagram.node.ed.asmer.org.ua/';

const PostCard = () => {
  const [page, setPage] = useState(0);
  const [allPosts, setAllPosts] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [likedPosts, setLikedPosts] = useState({});
  const [selectedPost, setSelectedPost] = useState(null); // Для управления модальным окном
  const loadMoreRef = useRef(null);

  const { data: posts = [], error, isLoading, isFetching } = useFetchPostsQuery({
    skip: page * 100,
    limit: 100
  });

  useEffect(() => {
    if (posts.length > 0) {
      setAllPosts((prevPosts) => {
        const newPosts = posts.filter(post => !prevPosts.some(prevPost => prevPost._id === post._id));
        return [...prevPosts, ...newPosts];
      });
      setHasMore(posts.length === 100);
    } else {
      setHasMore(false);
    }
  }, [posts]);

  const loadMorePosts = useCallback(() => {
    if (!isFetching && hasMore) {
      setPage((prevPage) => prevPage + 1);
    }
  }, [isFetching, hasMore]);

  useEffect(() => {
    const currentRef = loadMoreRef.current;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          loadMorePosts();
        }
      },
      { threshold: 1.0 }
    );

    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [loadMorePosts]);

  const handleLikeToggle = (postId) => {
    setLikedPosts((prevLikedPosts) => ({
      ...prevLikedPosts,
      [postId]: !prevLikedPosts[postId]
    }));
  };

  const handleOpenPost = (post) => {
    setSelectedPost(post);
  };

  const handleClosePost = () => {
    setSelectedPost(null);
  };

  const handleCommentChange = (event) => {
    // Логика для управления текстом комментария
  };

  if (isLoading && !posts.length) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 2 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Typography variant="body1" textAlign="center">Ошибка при загрузке данных постов: {error.message}</Typography>;
  }

  if (!allPosts.length) {
    return <Typography variant="body1" textAlign="center">Нет постов для отображения</Typography>;
  }

  return (
    <Box sx={{ padding: 2 }}>
      {allPosts.map((post) => {
        const imageUrl = post.images?.[0]?.url ? `${BASE_URL}${post.images[0].url}` : null;
        const author = post.owner?.login || 'Неизвестный';
        const likeCount = post.likes?.length || 0;
        const commentCount = post.comments?.length || 0;
        const userHasLiked = likedPosts[post._id] || false; // Проверка, лайкнул ли пользователь

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
                <Avatar sx={{ marginRight: 2, bgcolor: 'secondary.main' }}>{author.charAt(0)}</Avatar>
                <Typography variant="body1">{author}</Typography>
              </CardContent>
              {imageUrl ? (
                <CardMedia
                  component="img"
                  image={imageUrl}
                  alt="Post image"
                  sx={{
                    width: '100%',
                    height: 400,
                    objectFit: 'contain',
                    borderRadius: 1,
                    cursor: 'pointer'
                  }}
                  onClick={() => handleOpenPost(post)} // Открытие модального окна при клике на изображение
                />
              ) : (
                <Box
                  sx={{
                    width: '100%',
                    height: 400,
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
              <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 1, padding: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <IconButton
                    size="small"
                    onClick={() => handleLikeToggle(post._id)}
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
                  <Typography variant="body2">{likeCount + (userHasLiked ? 1 : 0)}</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <IconButton size="small" sx={{ color: 'text.disabled' }}>
                    <CommentIcon />
                  </IconButton>
                  <Typography variant="body2">{commentCount}</Typography>
                </Box>
              </CardContent>
            </Card>
          </Box>
        );
      })}

      {hasMore && !isFetching && (
        <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 2 }}>
          <Button
            variant="text"
            onClick={loadMorePosts}
            ref={loadMoreRef}
            sx={{ color: 'gray', textTransform: 'none', fontSize: '16px' }}
          >
            Загрузить ещё
          </Button>
        </Box>
      )}

      {isFetching && (
        <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 2 }}>
          <CircularProgress />
        </Box>
      )}

      {selectedPost && (
        <Dialog open={Boolean(selectedPost)} onClose={handleClosePost} fullWidth maxWidth="md">
          <DialogTitle>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Avatar sx={{ marginRight: 2, bgcolor: 'secondary.main' }}>{selectedPost.owner?.login?.charAt(0)}</Avatar>
              <Typography variant="h6">{selectedPost.owner?.login || 'Неизвестный'}</Typography>
            </Box>
          </DialogTitle>
          <DialogContent>
            <Box sx={{ display: 'flex', gap: 2 }}>
              {selectedPost.images && selectedPost.images.length > 0 ? (
                <Box sx={{ flexShrink: 0, width: '60%' }}>
                  {selectedPost.images.length > 1 ? (
                    <Slider
                      dots={true}
                      infinite={true}
                      speed={500}
                      slidesToShow={1}
                      slidesToScroll={1}
                      arrows={true}
                    >
                      {selectedPost.images.map((image, index) => (
                        <Box key={index} sx={{ width: '100%', height: 'auto', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                          <CardMedia
                            component="img"
                            image={`${BASE_URL}${image.url}`}
                            alt={`Post image ${index + 1}`}
                            sx={{
                              maxWidth: '100%',
                              maxHeight: 600,
                              objectFit: 'contain', // Изображения будут покрывать весь контейнер
                              borderRadius: 1
                            }}
                          />
                        </Box>
                      ))}
                    </Slider>
                  ) : (
                    <Box sx={{ width: '100%', height: 'auto', display: 'flex', justifyContent: 'center', alignItems: 'center'  }}>
                      <CardMedia
                        component="img"
                        image={`${BASE_URL}${selectedPost.images[0].url}`}
                        alt="Post image"
                        sx={{
                          maxWidth: '100%',
                          maxHeight: 600,
                          objectFit: 'contain', // Изображение будет покрывать весь контейнер
                          borderRadius: 1
                        }}
                      />
                    </Box>
                  )}
                </Box>
              ) : (
                <Box
                  sx={{
                    width: '60%',
                    height: 'auto',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: '#f0f0f0',
                    color: '#888',
                    borderRadius: 1
                  }}
                >
                  <Typography variant="h6">Изображение отсутствует</Typography>
                </Box>
              )}
              <Box sx={{ flex: 1 }}>
                <Typography variant="h6" sx={{ marginBottom: 1 }}>
                  {selectedPost.name}
                </Typography>
                <Typography variant="h6" sx={{ marginBottom: 2 }}>
                  {selectedPost.title}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, marginBottom: 2 }}>
                  <IconButton
                    size="small"
                    onClick={() => handleLikeToggle(selectedPost._id)}
                    sx={{
                      color: (likedPosts[selectedPost._id] || false) ? 'error.main' : 'text.disabled',
                      transition: 'color 0.3s ease',
                      '&:hover': {
                        color: (likedPosts[selectedPost._id] || false) ? 'error.light' : 'error.main'
                      }
                    }}
                  >
                    {(likedPosts[selectedPost._id] || false) ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                  </IconButton>
                  <Typography variant="body2">
                    {selectedPost.likes?.length || 0}
                  </Typography>
                </Box>
                <TextField
                  variant="outlined"
                  fullWidth
                  placeholder="Напишите комментарий..."
                  onChange={handleCommentChange}
                  sx={{ marginBottom: 2 }}
                />
                <Box sx={{ maxHeight: 300, overflowY: 'auto' }}>
                  {selectedPost.comments && selectedPost.comments.length > 0 ? (
                    selectedPost.comments.map((comment, index) => (
                      <Typography key={index} variant="body2" sx={{ marginBottom: 1 }}>
                        {comment.text}
                      </Typography>
                    ))
                  ) : (
                    <Typography variant="body2">Комментариев нет</Typography>
                  )}
                </Box>
              </Box>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClosePost}>Закрыть</Button>
          </DialogActions>
        </Dialog>
      )}
    </Box>
  );
};

export default PostCard;
