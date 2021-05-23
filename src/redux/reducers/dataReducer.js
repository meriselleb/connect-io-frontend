import {
    SET_POSTS,
    LIKE_POST,
    UNLIKE_POST,
    LOADING_DATA,
    DELETE_POST,
    POST_POST,
    SET_POST,
    SUBMIT_COMMENT,
    SET_UNAUTHENTICATED,
    SET_SEARCH_RESULTS,
} from '../types';

const initialState = {
    posts: [],
    searchResults: [],
    post: {},
    user: null,
    loading: false
};

function createdAtCmp(p1, p2) {
    if (p1.createdAt > p2.createdAt) {
        return -1
    }
    else if (p1.createdAt < p2.createdAt) {
        return 1
    }
    else {
        return 0;
    }
}

export default function foo(state = initialState, action) {
    switch (action.type) {
        case LOADING_DATA:
            return {
                ...state,
                loading: true
            };
        case SET_SEARCH_RESULTS:
            return {
                ...state,
                searchResults: action.payload,
            };
        case SET_POSTS:
            action.payload.posts.sort(createdAtCmp);
            return {
                ...state,
                posts: action.payload.posts,
                user: action.payload.user,
                loading: false
            };
        case SET_POST:
            return {
                ...state,
                post: action.payload
            };
        case LIKE_POST:
        case UNLIKE_POST:
            let index = state.posts.findIndex(
                (post) => post.postId === action.payload.postId
            );

            state.posts[index] = action.payload;

            if (state.post.postId === action.payload.postId) {
                state.post = action.payload;
            }
            
            state.posts.sort(createdAtCmp);

            return {
                ...state,
            }
        case DELETE_POST:
            index = state.posts.findIndex(
                (post) => post.postId === action.payload
            );
            state.posts.splice(index, 1);
            state.posts.sort(createdAtCmp);

            return {
                ...state
            };
        case POST_POST:
            var posts = [action.payload, ...state.posts];
            posts.sort(createdAtCmp);

            return {
                ...state,
                posts: posts,
            };
        case SUBMIT_COMMENT:
            var comments = [action.payload, ...state.post.comments];
            comments.sort((p1, p2) => createdAtCmp(p2, p1))

            return {
                ...state,
                post: {
                    ...state.post,
                    comments: comments
                }
            };
        case SET_UNAUTHENTICATED:
            return initialState;
        default:

            return state;
    }
}
  