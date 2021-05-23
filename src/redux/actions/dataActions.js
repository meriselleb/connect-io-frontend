import {
    SET_POSTS,
    LOADING_DATA,
    LIKE_POST,
    UNLIKE_POST,
    DELETE_POST,
    SET_ERRORS,
    POST_POST,
    CLEAR_ERRORS,
    LOADING_UI,
    SET_POST,
    STOP_LOADING_UI,
    SUBMIT_COMMENT,
    SET_SEARCH_RESULTS,
  } from '../types';
  import axios from 'axios';

  export const search = (searchTerm) => (dispatch) => {
    axios.get(`/search/${searchTerm}`)
      .then(res => {
        console.log(res);
        
        dispatch(({
          type: SET_SEARCH_RESULTS,
          payload: res.data.users.map(u => {
            u.type = 'user';
            return u;
          }),
        }))
      })
  }
  
  // Get all posts
  export const getPosts = (type, pageNum) => (dispatch) => {
    dispatch({ type: LOADING_DATA });

    var query;

    if (!type || !pageNum) {
      query = axios.get('/posts');
    }
    else {
      query = axios.get(`/posts/${type}/${pageNum}`)
    }

    query.then((res) => {
        dispatch({
          type: SET_POSTS,
          payload: {
            posts: res.data.posts,
          }
        });
      })
      .catch((err) => {
        dispatch({
          type: SET_POSTS,
          payload: {
            posts: [],
            user: null,
          }
        });
      });
  };

  export const getPost = (postId) => (dispatch) => {
    dispatch({ type: LOADING_UI });
    axios
      .get(`/post/${postId}`)
      .then((res) => {
        dispatch({
          type: SET_POST,
          payload: res.data
        });
        dispatch({ type: STOP_LOADING_UI });
      })
      .catch((err) => console.log(err));
  };

  // Make a post
  export const postPost = (newPost) => (dispatch) => {
    dispatch({ type: LOADING_UI });
    axios
      .post('/post', newPost)
      .then((res) => {
        console.log(res.data);
        dispatch({
          type: POST_POST,
          payload: res.data
        });
        dispatch(clearErrors());
      })
      .catch((err) => {
        dispatch({
          type: SET_ERRORS,
          payload: err.response.data
        });
      });
  };
  // Like a post
  export const likePost = (postId) => (dispatch) => {
    axios
      .get(`/post/${postId}/like`)
      .then((res) => {
        dispatch({
          type: LIKE_POST,
          payload: res.data
        });
      })
      .catch((err) => console.log(err));
  };
  // Unlike a post
  export const unlikePost = (postId) => (dispatch) => {
    axios
      .get(`/post/${postId}/unlike`)
      .then((res) => {
        dispatch({
          type: UNLIKE_POST,
          payload: res.data
        });
      })
      .catch((err) => console.log(err));
  };
  // Submit a comment
  export const submitComment = (postId, commentData) => (dispatch) => {
    axios
      .post(`/post/${postId}/comment`, commentData)
      .then((res) => {
        dispatch({
          type: SUBMIT_COMMENT,
          payload: res.data
        });
        dispatch(clearErrors());
      })
      .catch((err) => {
        dispatch({
          type: SET_ERRORS,
          payload: err.response.data
        });
      });
  };
  export const deletePost = (postId) => (dispatch) => {
    axios
      .delete(`/post/${postId}`)
      .then(() => {
        dispatch({ type: DELETE_POST, payload: postId });
      })
      .catch((err) => console.log(err));
  };
  
  export const getUserData = (userHandle) => (dispatch) => {
    dispatch({ type: LOADING_DATA });
    axios
      .get(`/user/${userHandle}`)
      .then((res) => {
        dispatch({
          type: SET_POSTS,
          payload: {
            posts: res.data.posts,
            user: res.data.user,
          }
        });
      })
      .catch(err => {
        dispatch({
          type: SET_POSTS,
          payload: {
            posts: [],
            user: {},
          }
        });
      });
  };
  
  export const clearErrors = () => (dispatch) => {
    dispatch({ type: CLEAR_ERRORS });
  };
  