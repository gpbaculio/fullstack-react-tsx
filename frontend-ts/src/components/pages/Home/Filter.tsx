import React, { Component } from 'react';
import {
  Input,
  Button,
  Col,
  Row,
  ButtonGroup,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter
} from 'reactstrap';
import { connect } from 'react-redux';
import { withRouter, RouteComponentProps } from 'react-router';
import { css } from '@emotion/core';
import { ClipLoader } from 'react-spinners';

import { AppState } from '../../../store';
import {
  Entities,
  Todo,
  TodosFilters,
  TodosLoadingState
} from '../../../store/todos/types';
import {
  clearCompleted,
  fetchTodos,
  setFilter,
  setPage,
  FetchTodosArgs,
  toggleAll
} from '../../../store/todos/actions';

const override: any = css`
  display: block;
  margin: 0 auto;
`;

interface FilterProps extends RouteComponentProps {
  count: number;
  entities: Entities;
  ids: string[];
  loading: TodosLoadingState;
  clearCompleted: () => void;
  filter: TodosFilters;
  searchText: string;
  fetchTodos: ({ page, filter }: FetchTodosArgs) => void;
  setFilter: (filter: TodosFilters) => void;
  setPage: (page: number) => void;
  activePage: number;
  completeAll: boolean;
  toggleAll: (complete: boolean) => void;
}

interface FilterState {
  completeAll: boolean;
  clearCompletedModal: boolean;
}

class Filter extends Component<FilterProps, FilterState> {
  state = {
    completeAll: false,
    clearCompletedModal: false
  };

  componentDidMount() {
    const { ids, entities } = this.props;
    const completeAll = ids
      .map(id => entities[id])
      .every(({ complete }) => complete);
    this.setState({ completeAll });
  }
  componentDidUpdate = (prevProps: FilterProps) => {
    const { completeAll } = this.props;
    if (completeAll !== prevProps.completeAll) {
      this.setState({ completeAll });
    }
  };
  toggleModal = () => {
    this.setState(prevState => ({
      clearCompletedModal: !prevState.clearCompletedModal
    }));
  };
  handleToggleAll = () => {
    this.setState(
      ({ completeAll }) => ({
        completeAll: !completeAll
      }),
      async () => {
        const { filter, toggleAll } = this.props;
        await toggleAll(this.state.completeAll);
        if (filter !== 'All' && this.props.count) {
          await this.props.fetchTodos({
            page: 1,
            filter,
            searchText: this.props.searchText
          });
        }
      }
    );
  };
  handleClearCompleted = async () => {
    await this.props.clearCompleted();
    this.toggleModal();
  };

  handleFilterClick = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    const { name }: any = e.currentTarget;
    const {
      history,
      fetchTodos,
      setFilter,
      setPage,
      searchText,
      match,
      activePage
    } = this.props;
    history.push(`${match.url}?filter=${name}&?page=${activePage}`); // from withRouter
    const query: any = { page: 1, filter: name };
    if (searchText) {
      query.searchText = searchText;
    }
    setFilter(name);
    setPage(1);
    await fetchTodos(query);
  };

  render() {
    const { ids, entities, filter, loading, count } = this.props;
    let todos = ids.map(id => entities[id]);
    if (filter !== 'All') {
      todos = todos.filter(todo =>
        filter === 'Active' ? !todo.complete : todo.complete
      );
    }
    const displayClearCompleted = todos.every(
      ({ complete }: Todo) => !complete
    );
    return (
      <Row className='my-3'>
        <Col
          lg='2'
          className='d-flex justify-content-center align-items-center'>
          Total: {count}
        </Col>
        <Col
          lg='8'
          className='filter d-flex justify-content-center align-items-center'>
          <div className='d-flex align-items-center mr-4'>
            <Input
              onChange={this.handleToggleAll}
              type='checkbox'
              className='mt-0'
              checked={this.state.completeAll}
              disabled={!count}
            />
            {loading.toggleAll ? (
              <div>
                <ClipLoader
                  css={override}
                  sizeUnit={'px'}
                  size={15}
                  color={'#123abc'}
                  loading={loading.toggleAll}
                />
                <span className='ml-1'>Toggling All... </span>
              </div>
            ) : (
              'Toggle All'
            )}
          </div>
          <div className='nav-container d-flex justify-content-around'>
            <ButtonGroup>
              <Button
                disabled={filter === 'All'}
                size='sm'
                color='primary'
                name='All'
                onClick={this.handleFilterClick}>
                All
              </Button>
              <Button
                disabled={filter === 'Active'}
                size='sm'
                color='primary'
                name='Active' // complete = false
                onClick={this.handleFilterClick}>
                Active
              </Button>
              <Button
                disabled={filter === 'Completed'}
                size='sm'
                color='primary'
                name='Completed'
                onClick={this.handleFilterClick}>
                Completed
              </Button>
            </ButtonGroup>
          </div>
        </Col>
        <Col
          lg='2'
          className='d-flex align-items-center justify-content-center'>
          <Modal
            isOpen={this.state.clearCompletedModal}
            toggle={this.toggleModal}>
            <ModalHeader toggle={this.toggleModal}>
              Delete Multiple todos
            </ModalHeader>
            <ModalBody>
              <div>
                You're about to delete the following. Please confirm to proceed.
              </div>
              <ul>
                {ids
                  .filter(id => entities[id].complete)
                  .map(id => {
                    return <li key={id}>{entities[id].text}</li>;
                  })}
              </ul>
            </ModalBody>
            <ModalFooter>
              <Button color='danger' onClick={this.handleClearCompleted}>
                {loading.clearCompleted ? (
                  <div>
                    <ClipLoader
                      css={override}
                      sizeUnit={'px'}
                      size={15}
                      color={'#fff'}
                      loading={loading.clearCompleted}
                    />
                    Deleting Todo...
                  </div>
                ) : (
                  'Confirm'
                )}
              </Button>
              <Button color='secondary' onClick={this.toggleModal}>
                Cancel
              </Button>
            </ModalFooter>
          </Modal>
          <Button
            onClick={this.toggleModal}
            disabled={displayClearCompleted}
            size='sm'
            color='danger'>
            Clear Completed
          </Button>
        </Col>
      </Row>
    );
  }
}

const mapStateToProps = ({ todos }: AppState) => ({
  count: todos.count,
  ids: todos.ids,
  entities: todos.entities,
  filter: todos.filter,
  searchText: todos.searchText,
  activePage: todos.activePage,
  completeAll: todos.ids
    .map(id => todos.entities[id])
    .every(({ complete }) => complete),
  loading: todos.loading
});

const mapDispatchToProps = {
  clearCompleted,
  fetchTodos,
  setFilter,
  setPage,
  toggleAll
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(Filter));
