import axios from 'axios';
import {
  LOGOUT,
  LOGIN_REQUEST,
  LOGIN_FAILURE,
  LOGIN_SUCCESS,
  SIGNUP_REQUEST,
  SIGNUP_FAILURE,
  SIGNUP_SUCCESS,
  CONFIRM_TOKEN_REQUEST,
  CONFIRM_TOKEN_SUCCESS,
  CONFIRM_TOKEN_FAILURE,
  CLEAR_ERROR,
  FETCH_USER_REQUEST,
  FETCH_USER_FAILURE,
  FETCH_USER_SUCCESS
} from './types';
import { Action } from 'redux';
import { ThunkAction } from 'redux-thunk';
import { AppState } from '../index';

export const logOut = () => ({
  type: LOGOUT
});

export const clearError = () => ({
  type: CLEAR_ERROR
});

export interface credentials {
  email: string;
  password: string;
}

export const logIn = (
  { email, password }: credentials,
  callback: (token: string) => void
): ThunkAction<void, AppState, null, Action<string>> => async (
  dispatch,
  _getState
) => {
  dispatch({ type: LOGIN_REQUEST });
  try {
    const {
      data: { user }
    } = await axios.post('/api/auth', {
      email,
      password
    });
    localStorage.setItem('token', user.token);
    callback(user.token);
    dispatch({ type: LOGIN_SUCCESS, payload: { user } });
  } catch (error) {
    dispatch({
      type: LOGIN_FAILURE,
      payload: { error: error.response.data.error }
    });
  }
};

export const signUp = (
  { email, password }: credentials,
  callback: (token: string) => void
): ThunkAction<void, AppState, null, Action<string>> => async (
  dispatch,
  _getState
) => {
  dispatch({ type: SIGNUP_REQUEST });
  try {
    const {
      data: { user }
    } = await axios.post('/api/user', {
      email,
      password
    }); // watch arg
    localStorage.setItem('token', user.token);
    callback(user.token);
    dispatch({ type: SIGNUP_SUCCESS, payload: { user } });
  } catch (error) {
    dispatch({
      type: SIGNUP_FAILURE,
      payload: { error: error.response.data.error }
    });
  }
};

export const confirmToken = (
  token: string
): ThunkAction<void, AppState, null, Action<string>> => async (
  dispatch,
  _getState
) => {
  dispatch({ type: CONFIRM_TOKEN_REQUEST });
  try {
    const {
      data: { user }
    } = await axios.post('/api/auth/confirm', {
      token
    }); // watch arg
    dispatch({ type: CONFIRM_TOKEN_SUCCESS, payload: { email: user.email } });
  } catch (error) {
    dispatch({
      type: CONFIRM_TOKEN_FAILURE,
      payload: { error: error.response.data.error }
    });
  }
};

export const fetchUser = (): ThunkAction<
  void,
  AppState,
  null,
  Action<string>
> => async (dispatch, _getState) => {
  dispatch({ type: FETCH_USER_REQUEST });
  try {
    const {
      data: { user }
    } = await axios.get(`/api/user/current`);
    dispatch({ type: FETCH_USER_SUCCESS, payload: { user } });
  } catch (error) {
    dispatch({ type: FETCH_USER_FAILURE, payload: { error } });
  }
};
