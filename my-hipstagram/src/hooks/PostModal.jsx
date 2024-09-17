import React, { useState, useEffect, useCallback } from 'react';
import { Box, Avatar, Typography, IconButton, TextField, Dialog, DialogTitle, DialogContent, DialogActions, Button, CardMedia } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { useSelector } from 'react-redux';
import { useAddCommentMutation } from './commentsApi';

const BASE_URL = 'http://hipstagram.node.ed.asmer.org.ua/';

const PostModal = ({ post, onClose, onLikeToggle, userHasLiked, likeCount, onAddComment  }) => {
  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState([]);
  const [likesCount, setLikesCount] = useState(likeCount);

  const [addComment] = useAddCommentMutation();
  const authUser = useSelector((state) => state.auth.user.UserFindOne);
  const userId = authUser?._id;

  // Загружаем комментарии при открытии модального окна
  useEffect(() => {
    if (post) {
      setComments(post.comments || []);
      setLikesCount(likeCount);
    }
  }, [post, likeCount]);

  const handleAddComment = async () => {
    if (!userId) {
      console.error('Пользователь не авторизован');
      return;
    }
  
    try {
      const newComment = await addComment({ text: commentText, postId: post._id, userId }).unwrap();
      const comment = {
        _id: newComment._id,
        text: commentText,
        owner: {
          _id: authUser._id,
          avatar: { url: authUser.avatar?.url || '' },
          nick: authUser.nick || authUser.login
        }
      };
      setComments(prevComments => [...prevComments, comment]);
      setCommentText('');
      if (onAddComment) onAddComment(comment); // Обновите родительский компонент
    } catch (err) {
      console.error('Ошибка при добавлении комментария:', err);
    }
  };
  

  const handleLikeToggle = useCallback(async () => {
    if (!userId) {
      console.error('Пользователь не авторизован');
      return;
    }

    try {
      await onLikeToggle();
      setLikesCount(prevLikesCount => userHasLiked ? prevLikesCount - 1 : prevLikesCount + 1);
    } catch (err) {
      console.error('Ошибка при изменении лайка:', err);
    }
  }, [onLikeToggle, userId, userHasLiked]);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
    lazyLoad: 'ondemand'
  };

  if (!post) {
    return null;
  }

  return (
    <Dialog open={Boolean(post)} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Avatar
            sx={{
              marginRight: 2,
              bgcolor: 'secondary.main',
              width: 60, // Увеличение размера аватара
              height: 60, // Увеличение размера аватара
              fontSize: '2.5rem' // Увеличение размера текста внутри аватара, если используется
            }}
          >
            {post.owner?.avatar?.url ? (
              <img 
                src={`${BASE_URL}${post.owner.avatar.url}`} 
                alt="User Avatar" 
                style={{ 
                  width: '100%', 
                  height: '100%', 
                  objectFit: 'cover', 
                  borderRadius: '50%' 
                }} 
              />
            ) : (
              post.owner?.login?.charAt(0)
            )}
          </Avatar>
          <Typography 
            variant="h6" 
            sx={{ 
              fontSize: '1.5rem', // Увеличение размера шрифта логина
              fontWeight: 'bold'
            }}
          >
            {post.owner?.nick || post.owner?.login}
          </Typography>
        </Box>
      </DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', gap: 2 }}>
          {post.images && post.images.length > 0 ? (
            <Box sx={{ flexShrink: 0, width: '60%' }}>
              {post.images.length > 1 ? (
                <Slider {...settings}>
                  {post.images.map((image, index) => (
                    <Box
                      key={index}
                      sx={{ width: '100%', height: 'auto', display: 'flex', justifyContent: 'center', alignItems: 'center' }}
                    >
                      <CardMedia
                        component="img"
                        image={`${BASE_URL}${image.url}`}
                        alt={`Post image ${index + 1}`}
                        sx={{
                          maxWidth: '100%',
                          maxHeight: 600,
                          objectFit: 'contain',
                          borderRadius: 1
                        }}
                      />
                    </Box>
                  ))}
                </Slider>
              ) : (
                <Box sx={{ width: '100%', height: 'auto', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  <CardMedia
                    component="img"
                    image={`${BASE_URL}${post.images[0].url}`}
                    alt="Post image"
                    sx={{
                      maxWidth: '100%',
                      maxHeight: 600,
                      objectFit: 'contain',
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
              {post.name}
            </Typography>
            <Typography variant="h6" sx={{ marginBottom: 2 }}>
              {post.title}
            </Typography>
            {post.text && (
              <Typography variant="body1" sx={{ marginBottom: 2 }}>
                {post.text}
              </Typography>
            )}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, marginBottom: 2 }}>
              <IconButton
                size="small"
                onClick={handleLikeToggle}
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
              <Typography variant="body2">
                {likesCount}
              </Typography>
            </Box>
            <TextField
              variant="outlined"
              fullWidth
              placeholder="Напишите комментарий..."
              value={commentText}
              onChange={(event) => setCommentText(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter') {
                  event.preventDefault();
                  handleAddComment();
                }
              }}
              sx={{ marginBottom: 2 }}
            />
            <Box sx={{ maxHeight: 300, overflowY: 'auto' }}>
              {comments.length > 0 ? (
                comments.map((comment, index) => (
                  <Box key={index} sx={{ display: 'flex', alignItems: 'center', marginBottom: 1 }}>
                    {comment.owner?.avatar?.url ? (
                      <Avatar src={`${BASE_URL}${comment.owner.avatar.url}`} sx={{ marginRight: 1 }} />
                    ) : (
                      <Avatar sx={{ marginRight: 1 }}>
                        {comment.owner?.login?.charAt(0) || 'U'}
                      </Avatar>
                    )}
                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                        {comment.owner?.nick || comment.owner?.login}
                      </Typography>
                      <Typography variant="body2">
                        {comment.text}
                      </Typography>
                    </Box>
                  </Box>
                ))
              ) : (
                <Typography variant="body2">Комментариев нет</Typography>
              )}
            </Box>
          </Box>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Закрыть</Button>
      </DialogActions>
    </Dialog>
  );
};

export default PostModal;
