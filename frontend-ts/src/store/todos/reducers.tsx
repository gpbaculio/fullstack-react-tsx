import {
  ADD_TODO_REQUEST,
  ADD_TODO_SUCCESS,
  ADD_TODO_FAILURE,
  FETCH_TODOS_REQUEST,
  FETCH_TODOS_SUCCESS,
  FETCH_TODOS_FAILURE,
  SET_SEARCH_TEXT,
  TodoActionTypes,
  TodosState,
  TodosErrorsState,
  TodosLoadingState,
  TOGGLE_COMPLETE_REQUEST,
  TOGGLE_COMPLETE_SUCCESS,
  TOGGLE_COMPLETE_FAILURE,
  UPDATE_TEXT_REQUEST,
  InitialTodoErrorsState,
  InitialTodoLoadingState,
  UPDATE_TEXT_SUCCESS,
  UPDATE_TEXT_FAILURE,
  DELETE_TODO_REQUEST,
  DELETE_TODO_SUCCESS,
  DELETE_TODO_FAILURE,
  DELETE_COMPLETED_REQUEST,
  SET_PAGE,
  SET_FILTER,
  DELETE_COMPLETED_SUCCESS,
  TOGGLE_COMPLETE_ALL_REQUEST,
  TOGGLE_COMPLETE_ALL_SUCCESS,
  TOGGLE_COMPLETE_ALL_FAILURE,
  CLEAR_SEARCH_TEXT,
  LOGOUT
} from './types';

export const initialErrorsState: TodosErrorsState = {
  addTodo: '',
  fetchTodos: '',
  clearCompleted: '',
  toggleAll: ''
};
export const initialLoadingState: TodosLoadingState = {
  addTodo: false,
  fetchTodos: false,
  clearCompleted: false,
  toggleAll: false
};
export const initialTodoLoadingState: InitialTodoLoadingState = {
  toggleComplete: false,
  updateText: false,
  deleteTodo: false
};
export const initialTodoErrorsState: InitialTodoErrorsState = {
  toggleComplete: '',
  updateText: '',
  deleteTodo: ''
};
export const initialState: TodosState = {
  ids: [],
  entities: {},
  loading: initialLoadingState,
  errors: initialErrorsState,
  filter: 'All',
  page: 1,
  searchText: '',
  count: 0,
  countPerPage: 9,
  activePage: 1,
  showRefresh: false
};

export default (state = initialState, action: TodoActionTypes) => {
  switch (action.type) {
    case CLEAR_SEARCH_TEXT:
      return {
        ...state,
        searchText: ''
      };
    case ADD_TODO_REQUEST:
      return {
        ...state,
        loading: {
          ...state.loading,
          addTodo: true
        }
      };
    case ADD_TODO_SUCCESS:
      return {
        ...state,
        count: state.count + 1,
        ids: [action.payload.todo._id, ...state.ids],
        entities: {
          ...state.entities,
          [action.payload.todo._id]: {
            ...action.payload.todo
          }
        },
        loading: {
          ...state.loading,
          addTodo: false
        }
      };
    case ADD_TODO_FAILURE:
      return {
        ...state,
        loading: {
          ...state.loading,
          addTodo: false
        },
        errors: {
          ...state.errors,
          addTodo: action.payload.error
        }
      };
    case FETCH_TODOS_REQUEST:
      return {
        ...state,
        loading: {
          ...state.loading,
          fetchTodos: true
        }
      };
    case FETCH_TODOS_SUCCESS:
      const statesuc = {
        ...state,
        entities: {
          ...action.payload.entities
        },
        ids: [...action.payload.ids],
        count: action.payload.count,
        loading: {
          ...state.loading,
          fetchTodos: false
        }
      };
      console.log('statesuc ', statesuc);
      return statesuc;
    case FETCH_TODOS_FAILURE:
      return {
        ...state,
        loading: {
          ...state.loading,
          fetchTodos: false
        },
        errors: {
          ...state.errors,
          fetchTodos: action.payload.error
        }
      };
    case TOGGLE_COMPLETE_REQUEST:
      return {
        ...state,
        entities: {
          ...state.entities,
          [action.payload.todoId]: {
            ...state.entities[action.payload.todoId],
            complete: action.payload.complete,
            loading: {
              ...state.entities[action.payload.todoId].loading,
              toggleComplete: true
            },
            errors: {
              ...state.entities[action.payload.todoId].errors,
              toggleComplete: ''
            }
          }
        }
      };
    case TOGGLE_COMPLETE_SUCCESS:
      let count = state.count;
      if (state.filter !== 'All') {
        count = count - 1;
      }
      return {
        ...state,
        count,
        entities: {
          ...state.entities,
          [action.payload.todo._id]: {
            ...action.payload.todo,
            loading: {
              ...state.entities[action.payload.todo._id].loading,
              toggleComplete: false
            },
            errors: {
              ...state.entities[action.payload.todo._id].errors,
              toggleComplete: ''
            }
          }
        }
      };
    case TOGGLE_COMPLETE_FAILURE:
      return {
        ...state,
        entities: {
          ...state.entities,
          [action.payload.todoId]: {
            ...state.entities[action.payload.todoId],
            loading: {
              ...state.entities[action.payload.todoId].loading,
              toggleComplete: false
            },
            errors: {
              ...state.entities[action.payload.todoId].errors,
              toggleComplete: action.payload.error
            }
          }
        }
      };
    case UPDATE_TEXT_REQUEST:
      return {
        ...state,
        entities: {
          ...state.entities,
          [action.payload.todoId]: {
            ...state.entities[action.payload.todoId],
            text: action.payload.text,
            loading: {
              ...state.entities[action.payload.todoId].loading,
              updateText: true
            },
            errors: {
              ...state.entities[action.payload.todoId].errors,
              updateText: ''
            }
          }
        }
      };
    case UPDATE_TEXT_SUCCESS:
      return {
        ...state,
        entities: {
          ...state.entities,
          [action.payload.todo._id]: {
            ...action.payload.todo,
            loading: {
              ...state.entities[action.payload.todo._id].loading,
              updateText: false
            },
            errors: {
              ...state.entities[action.payload.todo._id].errors,
              updateText: ''
            }
          }
        }
      };
    case UPDATE_TEXT_FAILURE:
      return {
        ...state,
        entities: {
          ...state.entities,
          [action.payload.todoId]: {
            ...state.entities[action.payload.todoId],
            text: action.payload.text,
            loading: {
              ...state.entities[action.payload.todoId].loading,
              updateText: false
            },
            errors: {
              ...state.entities[action.payload.todoId].errors,
              updateText: action.payload.error
            }
          }
        }
      };
    case DELETE_TODO_REQUEST:
      return {
        ...state,
        entities: {
          ...state.entities,
          [action.payload.todoId]: {
            ...state.entities[action.payload.todoId],
            loading: {
              ...state.entities[action.payload.todoId].loading,
              deleteTodo: true
            },
            errors: {
              ...state.entities[action.payload.todoId].errors,
              deleteTodo: ''
            }
          }
        }
      };
    case DELETE_TODO_SUCCESS:
      const {
        [action.payload.todoId]: removedProp,
        ...entities
      } = state.entities;
      return {
        ...state,
        entities,
        count: state.count - 1,
        ids: state.ids.filter(id => id !== action.payload.todoId)
      };
    case DELETE_TODO_FAILURE:
      return {
        ...state,
        entities: {
          ...state.entities,
          [action.payload.todoId]: {
            ...state.entities[action.payload.todoId],
            loading: {
              ...state.entities[action.payload.todoId].loading,
              deleteTodo: false
            },
            errors: {
              ...state.entities[action.payload.todoId].errors,
              deleteTodo: action.payload.error
            }
          }
        }
      };
    case DELETE_COMPLETED_REQUEST:
      return {
        ...state,
        loading: {
          ...state.loading,
          clearCompleted: true
        }
      };
    case DELETE_COMPLETED_SUCCESS:
      const { todoIds } = action.payload;
      const newEntities = { ...state.entities };
      todoIds.forEach(id => delete newEntities[id]);

      const newIds = state.ids.filter(id => todoIds.indexOf(id) === -1);
      const newCount = state.count - todoIds.length;
      return {
        ...state,
        count: newCount,
        ids: newIds,
        entities: newEntities,
        loading: {
          ...state.loading,
          clearCompleted: false
        }
      };
    case TOGGLE_COMPLETE_ALL_REQUEST:
      const mockEntities = { ...state.entities };
      action.payload.todoIds.forEach(
        id => (mockEntities[id].complete = action.payload.complete)
      );
      return {
        ...state,
        errors: {
          ...state.errors,
          toggleAll: ''
        },
        entities: mockEntities,
        loading: {
          ...state.loading,
          toggleAll: true
        }
      };
    case TOGGLE_COMPLETE_ALL_SUCCESS:
      let toggleAllCount = state.count;
      if (state.filter !== 'All') {
        toggleAllCount =
          toggleAllCount - Object.keys(action.payload.entities).length;
      }
      return {
        ...state,
        count: toggleAllCount,
        entities: {
          ...state.entities,
          ...action.payload.entities
        },
        loading: {
          ...state.loading,
          toggleAll: false
        }
      };
    case TOGGLE_COMPLETE_ALL_FAILURE:
      return {
        ...state,
        errors: {
          ...state.errors,
          toggleAll: action.payload.error
        },
        loading: {
          ...state.loading,
          toggleAll: false
        }
      };
    case SET_SEARCH_TEXT:
      return {
        ...state,
        searchText: action.payload.text
      };
    case SET_PAGE:
      return {
        ...state,
        page: action.payload.page
      };
    case SET_FILTER:
      return {
        ...state,
        filter: action.payload.filter
      };
    case LOGOUT:
      return {
        ...initialState
      };
    default:
      return state;
  }
};
