import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import * as actions from './actions';
import * as types from './types';
import expect from 'expect';
import axios from 'axios';
var MockAdapter = require('axios-mock-adapter');

const mock = new MockAdapter(axios);
import {
  initialTodoLoadingState,
  initialTodoErrorsState,
  initialState
} from './reducers';

import { AppState } from '../index';
import { initialUserState } from '../user/reducers';

const middlewares = [thunk];

const mockStore = configureMockStore<AppState, any>(middlewares);

describe('async actions', () => {
  afterEach(() => {
    mock.resetHistory();
  });
  it('creates FETCH_TODOS_SUCCESS when fetching todos succeeds', () => {
    const page = 1;
    const offset = (page - 1) * 9;
    const filter = 'All';
    const params: any = { offset, limit: 9, filter };
    mock.onGet('/api/user/todos', { params }).reply(200, {
      todos: [
        {
          complete: true,
          createdAt: '2019-03-29T17:36:29.604Z',
          text: 'sh',
          updatedAt: '2019-03-31T19:04:52.996Z',
          userId: '5c0c0965f9c34b071c11a3f1',
          _id: '5c9e579d0b17d53cc48dbe6c'
        }
      ],
      count: 1
    });
    const store = mockStore({
      todos: { ...initialState },
      user: { ...initialUserState }
    });
    const expectedActions = [
      { type: types.FETCH_TODOS_REQUEST },
      {
        type: types.FETCH_TODOS_SUCCESS,
        payload: {
          ids: ['5c9e579d0b17d53cc48dbe6c'],
          entities: {
            '5c9e579d0b17d53cc48dbe6c': {
              complete: true,
              createdAt: '2019-03-29T17:36:29.604Z',
              text: 'sh',
              updatedAt: '2019-03-31T19:04:52.996Z',
              userId: '5c0c0965f9c34b071c11a3f1',
              _id: '5c9e579d0b17d53cc48dbe6c',
              id: '5c9e579d0b17d53cc48dbe6c',
              loading: initialTodoLoadingState,
              errors: initialTodoErrorsState
            }
          },
          count: 1
        }
      }
    ];
    return store
      .dispatch(actions.fetchTodos({ filter: 'All', page: 1 }))
      .then(() => {
        expect(store.getActions()).toEqual(expectedActions);
      });
  });
  it('creates ADD_TODO_SUCCESS when adding todo succeeds', () => {
    const text = 'Add Todo Text';
    const userId = 'mockUserId';
    const mockTodo = {
      complete: false,
      createdAt: '2019-04-01T06:23:08.938Z',
      text,
      updatedAt: '2019-04-01T06:23:08.938Z',
      userId,
      _id: 'mockTodoId'
    };
    mock.onPost('/api/todo', { text, userId }).reply(200, {
      todo: mockTodo
    });
    const store = mockStore({
      todos: { ...initialState },
      user: { ...initialUserState }
    });
    const expectedActions = [
      { type: types.ADD_TODO_REQUEST },
      {
        type: types.ADD_TODO_SUCCESS,
        payload: {
          todo: {
            ...mockTodo,
            loading: initialTodoLoadingState,
            errors: initialTodoErrorsState
          }
        }
      }
    ];
    return store.dispatch(actions.addTodo({ text, userId })).then(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });
});
