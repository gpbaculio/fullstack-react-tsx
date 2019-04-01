export const FETCH_USER_SUCCESS = 'FETCH_USER_SUCCESS';
export const FETCH_USER_REQUEST = 'FETCH_USER_REQUEST';
export const FETCH_USER_FAILURE = 'FETCH_CURRENT_USER_FAILURE';
export const LOGIN_REQUEST = 'LOGIN_REQUEST';
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
export const LOGIN_FAILURE = 'LOGIN_FAILURE';
export const SIGNUP_REQUEST = 'SIGNUP_REQUEST';
export const SIGNUP_SUCCESS = 'SIGNUP_SUCCESS';
export const SIGNUP_FAILURE = 'SIGNUP_FAILURE';
export const LOGOUT = 'LOGOUT';
export const CONFIRM_TOKEN_REQUEST = 'CONFIRM_TOKEN_REQUEST';
export const CONFIRM_TOKEN_SUCCESS = 'CONFIRM_TOKEN_SUCCESS';
export const CONFIRM_TOKEN_FAILURE = 'CONFIRM_TOKEN_FAILURE';
export const CLEAR_ERROR = 'CLEAR_ERROR';

export interface UserErrorsState {
  logIn: string;
  signUp: string;
  fetchUser: string;
  confirmToken: string;
}
export interface UserLoadingState {
  logIn: boolean;
  signUp: boolean;
  fetchUser: boolean;
  confirmToken: boolean;
  app: boolean;
}

export interface UserState {
  _id: string;
  email: string;
  token: string;
  confirmed: boolean;
  loading: UserLoadingState;
  errors: UserErrorsState;
}

export interface User {
  user: string;
  message: string;
  timestamp: number;
}

interface fetchUserRequest {
  type: typeof FETCH_USER_REQUEST;
}
interface fetchUserSuccess {
  type: typeof FETCH_USER_SUCCESS;
  payload: {
    user: User;
  };
}
interface fetchUserFailure {
  type: typeof FETCH_USER_FAILURE;
  payload: {
    error: string;
  };
}
interface logInRequest {
  type: typeof LOGIN_REQUEST;
}
interface logInSuccess {
  type: typeof LOGIN_SUCCESS;
  payload: {
    user: User;
  };
}
interface logInFailure {
  type: typeof LOGIN_FAILURE;
  payload: {
    error: string;
  };
}
interface signUpRequest {
  type: typeof SIGNUP_REQUEST;
}
interface signUpSuccess {
  type: typeof SIGNUP_SUCCESS;
  payload: {
    user: User;
  };
}
interface signUpFailure {
  type: typeof SIGNUP_FAILURE;
  payload: {
    error: string;
  };
}
interface confirmTokenRequest {
  type: typeof CONFIRM_TOKEN_REQUEST;
}
interface confirmTokenSuccess {
  type: typeof CONFIRM_TOKEN_SUCCESS;
  payload: {
    email: string;
  };
}
interface confirmTokenFailure {
  type: typeof CONFIRM_TOKEN_FAILURE;
  payload: {
    error: string;
  };
}
interface logout {
  type: typeof LOGOUT;
}
interface clearError {
  type: typeof CLEAR_ERROR;
}

export type UserActionTypes =
  | fetchUserRequest
  | fetchUserSuccess
  | fetchUserFailure
  | signUpRequest
  | signUpSuccess
  | signUpFailure
  | logInRequest
  | logInSuccess
  | logInFailure
  | confirmTokenRequest
  | confirmTokenSuccess
  | confirmTokenFailure
  | logout
  | clearError;
