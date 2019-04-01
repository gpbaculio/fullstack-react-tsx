import {
  UserState,
  UserActionTypes,
  FETCH_USER_REQUEST,
  FETCH_USER_SUCCESS,
  FETCH_USER_FAILURE,
  SIGNUP_REQUEST,
  SIGNUP_SUCCESS,
  SIGNUP_FAILURE,
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGIN_FAILURE,
  CONFIRM_TOKEN_REQUEST,
  CONFIRM_TOKEN_SUCCESS,
  CONFIRM_TOKEN_FAILURE,
  LOGOUT,
  CLEAR_ERROR,
  UserErrorsState,
  UserLoadingState
} from './types';

const initialErrorsState: UserErrorsState = {
  logIn: '',
  signUp: '',
  fetchUser: '',
  confirmToken: ''
};

const initialLoadingState: UserLoadingState = {
  logIn: false,
  signUp: false,
  fetchUser: false,
  confirmToken: false,
  app: false
};

export const initialUserState: UserState = {
  _id: '',
  email: '',
  token: '',
  confirmed: false,
  loading: initialLoadingState,
  errors: initialErrorsState
};

function user(state = initialUserState, action: UserActionTypes) {
  switch (action.type) {
    case FETCH_USER_REQUEST:
      return {
        ...state,
        loading: {
          ...state.loading,
          fetchUser: true
        }
      };
    case FETCH_USER_SUCCESS:
      return {
        ...state,
        ...action.payload.user,
        loading: {
          ...state.loading,
          fetchUser: false
        }
      };
    case FETCH_USER_FAILURE:
      return {
        ...state,
        errors: {
          ...state.errors,
          fetchUser: action.payload.error
        },
        loading: {
          ...state.loading,
          fetchUser: false
        }
      };
    case SIGNUP_REQUEST:
      return {
        ...state,
        loading: {
          ...state.loading,
          signUp: true
        }
      };
    case SIGNUP_SUCCESS:
      return {
        ...state,
        ...action.payload.user,
        loading: {
          ...state.loading,
          signUp: false
        }
      };
    case SIGNUP_FAILURE:
      return {
        ...state,
        errors: {
          ...state.errors,
          signUp: action.payload.error
        },
        loading: {
          ...state.loading,
          signUp: false
        }
      };
    case LOGIN_REQUEST:
      return {
        ...state,
        loading: {
          ...state.loading,
          logIn: true
        }
      };
    case LOGIN_SUCCESS:
      return {
        ...state,
        ...action.payload.user,
        loading: {
          ...state.loading,
          logIn: false
        }
      };
    case LOGIN_FAILURE:
      return {
        ...state,
        errors: {
          ...state.errors,
          logIn: action.payload.error
        },
        loading: {
          ...state.loading,
          logIn: false
        }
      };
    case CONFIRM_TOKEN_REQUEST:
      return {
        ...state,
        loading: {
          ...state.loading,
          confirmToken: true
        }
      };
    case CONFIRM_TOKEN_SUCCESS:
      return {
        ...state,
        email: action.payload.email,
        confirmed: true,
        loading: {
          ...state.loading,
          confirmToken: false
        }
      };
    case CONFIRM_TOKEN_FAILURE:
      return {
        ...state,
        errors: {
          ...state.errors,
          confirmToken: action.payload.error
        },
        loading: {
          ...state.loading,
          confirmToken: false
        }
      };
    case LOGOUT:
      return {
        ...initialUserState
      };
    case CLEAR_ERROR:
      return {
        ...state,
        errors: initialErrorsState
      };
    default:
      return state;
  }
}

export default user;
