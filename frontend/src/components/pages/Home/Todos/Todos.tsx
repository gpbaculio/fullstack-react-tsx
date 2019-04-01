import React, { Component } from 'react';
import { connect } from 'react-redux';
import { css } from '@emotion/core';
import { ClipLoader } from 'react-spinners';
import { Col } from 'reactstrap';

import Todo from './Todo';
import { fetchTodos, FetchTodosArgs } from '../../../../store/todos/actions';
import {
  Entities,
  TodosFilters,
  Todo as TodoInterface,
  InitialTodoLoadingState
} from '../../../../store/todos/types';
import { AppState } from '../../../../store';
const override: any = css`
  display: block;
  margin: 0 auto;
`;

interface PageTodosProps {
  fetchTodos: ({ page, filter }: FetchTodosArgs) => void;
  filter: TodosFilters;
  ids: string[];
  entities: Entities;
  loading: boolean;
}

class Todos extends Component<PageTodosProps> {
  componentDidMount = () => {
    this.props.fetchTodos({ page: 1, filter: this.props.filter });
  };

  render() {
    const { ids, entities, loading } = this.props;
    const todos = ids.map(id => entities[id]);
    if (loading) {
      return (
        <Col sm='12'>
          <div className='mt-5 mb-5 d-flex align-items-center justify-content-center'>
            <ClipLoader
              css={override}
              sizeUnit={'px'}
              size={50}
              color={'#123abc'}
              loading={loading}
            />
          </div>
        </Col>
      );
    }
    return todos.map(todo => <Todo key={todo._id} {...todo} />);
  }
}

const mapStateToProps = ({ todos }: AppState) => ({
  entities: todos.entities,
  ids: todos.ids,
  filter: todos.filter,
  loading: todos.loading.fetchTodos
});

const mapDispatchToProps = {
  fetchTodos
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Todos);
