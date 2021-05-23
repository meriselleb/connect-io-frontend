import {
    SET_USER,
    SET_ERRORS,
    CLEAR_ERRORS,
    LOADING_UI,
    SET_UNAUTHENTICATED,
    LOADING_USER,
    MARK_NOTIFICATIONS_READ,
    SET_FROM_CONNECTIONS,
    SET_NOTIFICATION_CHANGE,
  } from '../types';
  import axios from 'axios';

  import {
    getUserData as getUserDataByHandle
  } from './dataActions.js';
  
  export const loginUser = (userData, history) => (dispatch) => {
    dispatch({ type: LOADING_UI });
    axios
      .post('/login', userData, {
        withCredentials: true,
      })
      .then((res) => {
        console.log(res.headers);
        setAuthorizationHeader(res.data.token);
        dispatch(getUserData());
        dispatch({ type: CLEAR_ERRORS });
        history.push('/');
      })
      .catch((err) => {
        dispatch({
          type: SET_ERRORS,
          payload: err.response.data
        });
      });
  };

// export const loginUser = (userData, history) => (dispatch) => {


//     dispatch({type: LOADING_UI});
//        axios.post('/login', userData)
//        .then(res => {
//             const FbIdToken = `Bearer ${res.data.token}`;
//             localStorage.setItem('FbIdToken', FbIdToken);
//             axios.defaults.headers.common['Authorization'] = FbIdToken;
//             dispatch(getUserData());
//             dispatch({type: CLEAR_ERRORS});
//             /*  setState({
//                 ...state, loading : false
//             });*/
//             history.push(`/`);
//        })
//        .catch(err => {
//            console.log(err.response.data)
//            dispatch({
//                type: SET_ERRORS,
//                payload: err.response.data
//            })
//        }) 
//    };
  
  export const signupUser = (newUserData, history) => (dispatch) => {
    dispatch({ type: LOADING_UI });
    axios
      .post('/signup', newUserData)
      .then((res) => {
        setAuthorizationHeader(res.data.token);
        dispatch(getUserData());
        dispatch({ type: CLEAR_ERRORS });
        history.push('/');
      })
      .catch((err) => {
        dispatch({
          type: SET_ERRORS,
          payload: err.response.data
        });
      });
  };
  
  export const logoutUser = () => (dispatch) => {
    localStorage.removeItem('FBIdToken');
    delete axios.defaults.headers.common['Authorization'];
    dispatch({ type: SET_UNAUTHENTICATED });
  };
  
  export const getUserData = () => (dispatch) => {
    dispatch({ type: LOADING_USER });
    axios
      .get('/user', {
        withCredentials: true,
      })
      .then((res) => {
        dispatch({
          type: SET_USER,
          payload: res.data
        });
      })
      .catch(err => {
        console.log(err.response);
        dispatch(logoutUser());
      });
  };
  
  export const uploadImage = (formData) => (dispatch) => {
    dispatch({ type: LOADING_USER });
    axios
      .post('/user/image', formData)
      .then(() => {
        dispatch(getUserData());
      })
      .catch((err) => console.log(err));
  };
  
  export const editUserDetails = (userDetails) => (dispatch) => {
    dispatch({ type: LOADING_USER });
    axios
      .post('/user', userDetails)
      .then(res => {
        dispatch(getUserData());
        dispatch(getUserDataByHandle(res.data.handle))
      })
      .catch((err) => console.log(err));
  };
  
  export const markNotificationsRead = (notificationIds) => (dispatch) => {
    axios
      .post('/notifications', notificationIds)
      .then((res) => {
        dispatch({
          type: MARK_NOTIFICATIONS_READ
        });
      })
      .catch((err) => console.log(err));
  };
  
  const setAuthorizationHeader = (token) => {
    const FBIdToken = `Bearer ${token}`;
    localStorage.setItem('FBIdToken', FBIdToken);
    axios.defaults.headers.common['Authorization'] = FBIdToken;
  };
  
export const sendFriendRequest = (otherUserId) => (dispatch) => {
  axios.get(`/friendRequest/${otherUserId}`)
    .then(res => {
      dispatch({
        type: SET_FROM_CONNECTIONS,
        payload: res.data,
      });
    })
}

export const acceptFriendRequest = (otherUserId) => (dispatch) => {
  axios.get(`/friendRequest/${otherUserId}/accept`)
    .then(res => {
      console.log(res);
      dispatch({
        type: SET_NOTIFICATION_CHANGE,
        payload: res.data,
      })
    })
}

export const declineFriendRequest = (otherUserId) => (dispatch) => {
  axios.get(`/friendRequest/${otherUserId}/decline`)
    .then(res => {
      console.log(res);
      dispatch({
        type: SET_NOTIFICATION_CHANGE,
        payload: res.data,
      })
    })
}