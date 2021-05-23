import {
    SET_USER,
    SET_AUTHENTICATED,
    SET_UNAUTHENTICATED,
    LOADING_USER,
    LIKE_POST,
    UNLIKE_POST,
    MARK_NOTIFICATIONS_READ,
    SET_FROM_CONNECTIONS,
    SET_NOTIFICATION_CHANGE,
  } from '../types';
  
  const initialState = {
    authenticated: false,
    loading: false,
    credentials: {},
    likes: [],
    notifications: []
  };
  
  export default function foo(state = initialState, action) {
    switch (action.type) {
      case SET_AUTHENTICATED:
        return {
          ...state,
          authenticated: true
        };
      case SET_UNAUTHENTICATED:
        return initialState;
      case SET_USER:
        return {
          ...state,
          authenticated: true,
          loading: false,
          ...action.payload,
        };
      case LOADING_USER:
        return {
          ...state,
          loading: true
        };
      case LIKE_POST:
        return {
          ...state,
          likes: [
            ...state.likes,
            {
              userHandle: state.credentials.handle,
              postId: action.payload.postId
            }
          ]
        };
      case UNLIKE_POST:
        return {
          ...state,
          likes: state.likes.filter(
            (like) => like.postId !== action.payload.postId
          )
        };
      case MARK_NOTIFICATIONS_READ:
        state.notifications.forEach((not) => (not.read = true));
        return {
          ...state
        };
      case SET_FROM_CONNECTIONS:
        return {
          ...state,
          fromRequests: action.payload,
        }
      case SET_NOTIFICATION_CHANGE:
        return {
          ...state,
          toRequests: action.payload.toRequests,
          connections: action.payload.connections,
        }
      default:
        return state;
    }
  }
  