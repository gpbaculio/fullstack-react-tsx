export const ADD_TODO_REQUEST = 'ADD_TODO_REQUEST';
export const ADD_TODO_SUCCESS = 'ADD_TODO_SUCCESS';
export const ADD_TODO_FAILURE = 'ADD_TODO_FAILURE';
export const UPDATE_TEXT_REQUEST = 'UPDATE_TODO_TEXT_REQUEST';
export const UPDATE_TEXT_SUCCESS = 'UPDATE_TODO_TEXT_SUCCESS';
export const UPDATE_TEXT_FAILURE = 'UPDATE_TODO_TEXT_FAILURE';
export const TOGGLE_COMPLETE_REQUEST = 'TOGGLE_TODOS_REQUEST';
export const TOGGLE_COMPLETE_SUCCESS = 'TOGGLE_TODOS_SUCCESS';
export const TOGGLE_COMPLETE_FAILURE = 'TOGGLE_TODOS_FAILURE';
export const TOGGLE_COMPLETE_ALL_REQUEST = 'TOGGLE_ALL_TODO_REQUEST';
export const TOGGLE_COMPLETE_ALL_SUCCESS = 'TOGGLE_ALL_TODO_SUCCESS';
export const TOGGLE_COMPLETE_ALL_FAILURE = 'TOGGLE_ALL_TODO_FAILURE';
export const DELETE_TODO_REQUEST = 'DELETE_TODO_REQUEST';
export const DELETE_TODO_SUCCESS = 'DELETE_TODO_SUCCESS';
export const DELETE_TODO_FAILURE = 'DELETE_TODO_FAILURE';
export const DELETE_COMPLETED_REQUEST = 'DELETE_COMPLETED_REQUEST';
export const DELETE_COMPLETED_SUCCESS = 'DELETE_COMPLETED_SUCCESS';
export const DELETE_COMPLETED_FAILURE = 'DELETE_COMPLETED_FAILURE';
export const FETCH_TODOS_REQUEST = 'FETCH_TODOS_REQUEST';
export const FETCH_TODOS_SUCCESS = 'FETCH_TODOS_SUCCESS';
export const FETCH_TODOS_FAILURE = 'FETCH_TODOS_FAILURE';
export const SET_PAGE = 'SET_PAGE';
export const SET_FILTER = 'SET_FILTER';
export const LOGOUT = 'LOGOUT';
export const SET_SEARCH_TEXT = 'SET_SEARCH_TEXT';
export const CLEAR_SEARCH_TEXT = 'CLEAR_SEARCH_TEXT';

export interface InitialTodoLoadingState {
  toggleComplete: boolean;
  updateText: boolean;
  deleteTodo: boolean;
  [key: string]: boolean;
}
export interface InitialTodoErrorsState {
  toggleComplete: string;
  updateText: string;
  deleteTodo: string;
}
export interface Todo {
  complete: boolean;
  _id: string;
  text: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  id?: string;
  __v?: number;
  loading: InitialTodoLoadingState;
  errors: InitialTodoErrorsState;
}

export interface TodosLoadingState {
  addTodo: boolean;
  fetchTodos: boolean;
  clearCompleted: boolean;
  toggleAll: boolean;
}
export interface TodosErrorsState {
  addTodo: string;
  fetchTodos: string;
  clearCompleted: string;
  toggleAll: string;
}

export type TodosFilters = 'All' | 'Active' | 'Completed';
export interface Entities {
  [_id: string]: Todo;
}
export interface TodosState {
  ids: string[];
  entities: Entities;
  filter: TodosFilters;
  page: number;
  errors: TodosErrorsState;
  loading: TodosLoadingState;
  searchText: string;
  count: number;
  countPerPage: number;
  activePage: number;
  showRefresh: boolean;
}

interface addTodoRequest {
  type: typeof ADD_TODO_REQUEST;
}
interface addTodoSuccess {
  type: typeof ADD_TODO_SUCCESS;
  payload: {
    todo: Todo;
  };
}
interface addTodoFailure {
  type: typeof ADD_TODO_FAILURE;
  payload: {
    error: string;
  };
}
interface fetchTodosRequest {
  type: typeof FETCH_TODOS_REQUEST;
}
interface fetchTodosSuccess {
  type: typeof FETCH_TODOS_SUCCESS;
  payload: {
    entities: {
      [_id: string]: Todo;
    };
    ids: string[];
    count: number;
  };
}
interface fetchTodosFailure {
  type: typeof FETCH_TODOS_FAILURE;
  payload: {
    error: string;
  };
}
interface toggleCompleteRequest {
  type: typeof TOGGLE_COMPLETE_REQUEST;
  payload: {
    todoId: string;
    complete: boolean;
  };
}
interface toggleCompleteSuccess {
  type: typeof TOGGLE_COMPLETE_SUCCESS;
  payload: {
    todo: Todo;
  };
}
interface toggleCompleteFailure {
  type: typeof TOGGLE_COMPLETE_FAILURE;
  payload: {
    error: string;
    todoId: string;
    complete: boolean;
  };
}
interface updateTextRequest {
  type: typeof UPDATE_TEXT_REQUEST;
  payload: {
    todoId: string;
    text: string;
  };
}
interface updateTextSuccess {
  type: typeof UPDATE_TEXT_SUCCESS;
  payload: {
    todo: Todo;
  };
}
interface updateTextFailure {
  type: typeof UPDATE_TEXT_FAILURE;
  payload: {
    error: string;
    todoId: string;
    text: string;
  };
}
interface setSearchText {
  type: typeof SET_SEARCH_TEXT;
  payload: {
    text: string;
  };
}
interface clearSearchText {
  type: typeof CLEAR_SEARCH_TEXT;
}
interface deleteTodoRequest {
  type: typeof DELETE_TODO_REQUEST;
  payload: {
    todoId: string;
  };
}
interface deleteTodoSuccess {
  type: typeof DELETE_TODO_SUCCESS;
  payload: {
    todoId: string;
  };
}
interface deleteTodoFailure {
  type: typeof DELETE_TODO_FAILURE;
  payload: {
    error: string;
    todoId: string;
  };
}
interface clearCompletedRequest {
  type: typeof DELETE_COMPLETED_REQUEST;
}
interface clearCompletedSuccess {
  type: typeof DELETE_COMPLETED_SUCCESS;
  payload: {
    todoIds: string[];
  };
} // not finished
interface clearCompletedFailure {
  type: typeof DELETE_COMPLETED_FAILURE;
  payload: {
    error: string;
  };
} // not finished
interface setPage {
  type: typeof SET_PAGE;
  payload: {
    page: number;
  };
}
interface setFilter {
  type: typeof SET_FILTER;
  payload: {
    filter: TodosFilters;
  };
}
interface toggleCompleteAllRequest {
  type: typeof TOGGLE_COMPLETE_ALL_REQUEST;
  payload: {
    todoIds: string[];
    complete: boolean;
  };
}
interface toggleCompleteAllSuccess {
  type: typeof TOGGLE_COMPLETE_ALL_SUCCESS;
  payload: {
    entities: {
      [_id: string]: Todo;
    };
  };
}
interface toggleCompleteAllFailure {
  type: typeof TOGGLE_COMPLETE_ALL_FAILURE;
  payload: {
    error: string;
  };
}
interface logOut {
  type: typeof LOGOUT;
}
export type TodoActionTypes =
  | addTodoRequest
  | addTodoSuccess
  | addTodoFailure
  | fetchTodosRequest
  | fetchTodosSuccess
  | fetchTodosFailure
  | setSearchText
  | clearSearchText
  | toggleCompleteRequest
  | toggleCompleteSuccess
  | toggleCompleteFailure
  | updateTextRequest
  | updateTextSuccess
  | updateTextFailure
  | deleteTodoRequest
  | deleteTodoSuccess
  | deleteTodoFailure
  | clearCompletedRequest
  | clearCompletedSuccess
  | clearCompletedFailure
  | setPage
  | setFilter
  | toggleCompleteAllRequest
  | toggleCompleteAllSuccess
  | toggleCompleteAllFailure
  | logOut;
