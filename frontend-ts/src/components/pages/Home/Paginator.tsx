import React, { Component } from 'react';
import Pagination from 'react-js-pagination';
import { connect } from 'react-redux';
import { Alert, Button } from 'reactstrap';

import { AppState } from '../../../store';
import { Entities, TodosFilters } from '../../../store/todos/types';
import {
  FetchTodosArgs,
  fetchTodos,
  setPage
} from '../../../store/todos/actions';

interface PaginatorProps {
  fetchTodos: ({ page, filter }: FetchTodosArgs) => void;
  setPage: (page: number) => void;
  count: number;
  filter: TodosFilters;
  loading: boolean;
  activePage: number;
  countPerPage: number;
  showRefresh: boolean;
  searchText: string;
  entities: Entities;
  ids: string[];
}

class Paginator extends Component<PaginatorProps> {
  onPageChange = async (page: number) => {
    const { fetchTodos, setPage, filter, searchText } = this.props;
    const query: FetchTodosArgs = {
      page,
      filter
    };
    if (searchText) {
      query.searchText = searchText;
    }
    await fetchTodos(query);
    setPage(page);
  };

  onRefresh = () => {
    const { fetchTodos, filter, activePage: page, searchText } = this.props;
    fetchTodos({ page, filter, searchText });
  };

  render() {
    const {
      activePage,
      count,
      filter,
      loading,
      countPerPage,
      showRefresh,
      searchText,
      ids,
      entities
    } = this.props;
    const todos = ids.map(id => entities[id]);
    let filterCount = todos.length;
    if (searchText && filter !== 'All') {
      // filterCount = filter(map(ids, id => entities[id]), t =>
      //   sort === 'active' ? !t.complete : t.complete
      // ).length;
      filterCount = todos.filter(todo =>
        filter === 'Active' ? !todo.complete : todo.complete
      ).length;
    }
    return (
      <React.Fragment>
        {!count && !loading ? (
          <Alert color='primary'>
            You have no {filter === 'All' ? '' : filter} todos yet.
          </Alert>
        ) : (
          <div className='d-flex flex-column mt-3'>
            {showRefresh && (
              <Button
                color='primary'
                className='btn-block'
                onClick={this.onRefresh}>
                Refresh Page
              </Button>
            )}
            <Pagination
              activePage={activePage}
              itemsCountPerPage={countPerPage}
              totalItemsCount={count}
              pageRangeDisplayed={5}
              onChange={this.onPageChange}
            />
          </div>
        )}
      </React.Fragment>
    );
  }
}

const mapStateToProps = ({ todos }: AppState) => ({
  count: todos.count,
  filter: todos.filter,
  loading: todos.loading.fetchTodos,
  activePage: todos.page,
  countPerPage: todos.countPerPage,
  showRefresh: todos.showRefresh,
  searchText: todos.searchText,
  entities: todos.entities,
  ids: todos.ids
});

const mapDispatchToProps = {
  fetchTodos,
  setPage
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Paginator);
