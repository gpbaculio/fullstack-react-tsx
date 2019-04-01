import axios from 'axios';
import { Action, AnyAction } from 'redux';
import { ThunkAction } from 'redux-thunk';
import { AppState } from '../index';
import { schema, normalize } from 'normalizr';
import {
  ADD_TODO_REQUEST,
  ADD_TODO_SUCCESS,
  ADD_TODO_FAILURE,
  FETCH_TODOS_REQUEST,
  FETCH_TODOS_FAILURE,
  FETCH_TODOS_SUCCESS,
  TOGGLE_COMPLETE_REQUEST,
  TOGGLE_COMPLETE_SUCCESS,
  TOGGLE_COMPLETE_FAILURE,
  SET_SEARCH_TEXT,
  CLEAR_SEARCH_TEXT,
  UPDATE_TEXT_REQUEST,
  UPDATE_TEXT_SUCCESS,
  UPDATE_TEXT_FAILURE,
  Todo,
  TodosFilters,
  DELETE_TODO_REQUEST,
  DELETE_TODO_FAILURE,
  DELETE_TODO_SUCCESS,
  DELETE_COMPLETED_REQUEST,
  SET_PAGE,
  SET_FILTER,
  DELETE_COMPLETED_FAILURE,
  DELETE_COMPLETED_SUCCESS,
  TOGGLE_COMPLETE_ALL_REQUEST,
  TOGGLE_COMPLETE_ALL_FAILURE,
  TOGGLE_COMPLETE_ALL_SUCCESS
} from './types';
import { initialTodoLoadingState, initialTodoErrorsState } from './reducers';

export interface AddTodoArgs {
  text: string;
  userId: string;
}
export const addTodo = ({
  text,
  userId
}: AddTodoArgs): ThunkAction<void, AppState, void, AnyAction> => async (
  dispatch,
  _getState
) => {
  dispatch({ type: ADD_TODO_REQUEST });
  try {
    const {
      data: { todo }
    } = await axios.post('/api/todo', {
      text,
      userId
    });
    dispatch({
      type: ADD_TODO_SUCCESS,
      payload: {
        todo: {
          ...todo,
          loading: initialTodoLoadingState,
          errors: initialTodoErrorsState
        }
      }
    });
  } catch (error) {
    dispatch({
      type: ADD_TODO_FAILURE,
      payload: { error: error.response.data.error }
    });
  }
};

export interface ToggleTodoArgs {
  todoId: string;
  complete: boolean;
  userId: string;
}
export const toggleComplete = ({
  todoId,
  complete,
  userId
}: ToggleTodoArgs): ThunkAction<void, AppState, void, AnyAction> => async (
  dispatch,
  _getState
) => {
  dispatch({ type: TOGGLE_COMPLETE_REQUEST, payload: { todoId, complete } });
  try {
    const {
      data: { todo }
    } = await axios.post('/api/todo/toggleComplete', {
      todoId,
      complete,
      userId
    });
    dispatch({ type: TOGGLE_COMPLETE_SUCCESS, payload: { todo } });
  } catch (error) {
    dispatch({
      type: TOGGLE_COMPLETE_FAILURE,
      payload: { error: error.response.data.error, todoId, complete: !complete }
    });
  }
};

export interface UpdateTextArgs {
  todoId: string;
  text: string;
}
export const updateText = ({
  todoId,
  text
}: UpdateTextArgs): ThunkAction<void, AppState, void, AnyAction> => async (
  dispatch,
  getState
) => {
  const { user } = getState();
  dispatch({ type: UPDATE_TEXT_REQUEST, payload: { todoId, text } });
  try {
    const {
      data: { todo }
    } = await axios.post('/api/todo/updateText', {
      todoId,
      text,
      userId: user._id
    });
    dispatch({ type: UPDATE_TEXT_SUCCESS, payload: { todo } });
  } catch (error) {
    dispatch({
      type: UPDATE_TEXT_FAILURE,
      payload: { error: error.response.data.error, todoId, text }
    });
  }
};

const todo = new schema.Entity('todos');
export interface FetchTodosArgs {
  page: number;
  filter: TodosFilters;
  searchText?: string;
}
export const fetchTodos = ({
  page,
  filter,
  searchText
}: FetchTodosArgs): ThunkAction<void, AppState, void, AnyAction> => async (
  dispatch,
  _getState
) => {
  dispatch({ type: FETCH_TODOS_REQUEST });
  try {
    const offset = (page - 1) * 9;
    const params: any = { offset, limit: 9, filter };
    if (searchText) {
      params.searchText = searchText;
    }
    const response = await axios.get('/api/user/todos', {
      params
    });

    const {
      result: todoIds,
      entities: { todos }
    } = normalize(
      response.data.todos.map((t: Todo) => ({
        ...t,
        id: t._id,
        loading: initialTodoLoadingState,
        errors: initialTodoErrorsState
      })),
      [todo]
    );
    dispatch({
      type: FETCH_TODOS_SUCCESS,
      payload: { ids: todoIds, entities: todos, count: response.data.count }
    });
  } catch (error) {
    console.log('error!', error);
    dispatch({
      type: FETCH_TODOS_FAILURE,
      payload: { error }
    });
  }
};

export const setSearchText = (
  text: string
): ThunkAction<void, AppState, void, AnyAction> => dispatch => {
  dispatch({ type: SET_SEARCH_TEXT, payload: { text } });
};

export const clearSearchText = (): ThunkAction<
  void,
  AppState,
  void,
  AnyAction
> => dispatch => {
  dispatch({ type: CLEAR_SEARCH_TEXT });
};

export interface DeleteTodoArgs {
  todoId: string;
  userId: string;
}
export const deleteTodo = ({
  todoId,
  userId
}: DeleteTodoArgs): ThunkAction<void, AppState, void, AnyAction> => async (
  dispatch,
  _getState
) => {
  dispatch({ type: DELETE_TODO_REQUEST, payload: { todoId } });
  try {
    const { data } = await axios.post('/api/todo/delete', {
      todoId,
      userId
    });
    dispatch({ type: DELETE_TODO_SUCCESS, payload: { todoId: data.todoId } });
  } catch (error) {
    dispatch({
      type: DELETE_TODO_FAILURE,
      payload: { todoId, error: error.response.data.error }
    });
  }
};

export const clearCompleted = (): ThunkAction<
  void,
  AppState,
  void,
  AnyAction
> => async (dispatch, getState) => {
  const {
    todos: { ids, entities },
    user
  } = getState();
  const completedTodoIds = ids.filter((id: string) => entities[id].complete);
  dispatch({ type: DELETE_COMPLETED_REQUEST });
  try {
    const {
      data: { todoIds }
    } = await axios.post('/api/todo/deleteMany', {
      todoIds: completedTodoIds,
      userId: user._id
    });
    dispatch({ type: DELETE_COMPLETED_SUCCESS, payload: { todoIds } });
  } catch (error) {
    dispatch({
      type: DELETE_COMPLETED_FAILURE,
      payload: { todoIds: completedTodoIds, error: error.response.data.error }
    });
  }
};

export const setPage = (
  page: number
): ThunkAction<void, AppState, void, AnyAction> => dispatch => {
  dispatch({ type: SET_PAGE, payload: { page } });
};

export const setFilter = (
  filter: TodosFilters
): ThunkAction<void, AppState, void, AnyAction> => dispatch => {
  dispatch({ type: SET_FILTER, payload: { filter } });
};

export const toggleAll = (
  complete: boolean
): ThunkAction<void, AppState, void, AnyAction> => async (
  dispatch,
  getState
) => {
  const {
    todos: { ids, entities },
    user
  } = getState();
  const todoIds = ids.filter(id => entities[id].complete !== complete);
  dispatch({
    type: TOGGLE_COMPLETE_ALL_REQUEST,
    payload: { todoIds, complete }
  });
  try {
    const {
      data: { todos }
    } = await axios.post('/api/todo/toggleCompleteMany', {
      todoIds,
      userId: user._id,
      complete
    });
    const { entities } = normalize(
      todos.map((t: Todo) => ({
        ...t,
        id: t._id,
        loading: initialTodoLoadingState,
        errors: initialTodoErrorsState
      })),
      [todo]
    );
    dispatch({
      type: TOGGLE_COMPLETE_ALL_SUCCESS,
      payload: { entities: entities.todos }
    });
  } catch (error) {
    dispatch({
      type: TOGGLE_COMPLETE_ALL_FAILURE,
      payload: { error: error.response.data.error }
    });
  }
};
