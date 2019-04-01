import React, { Component } from 'react';
import { connect } from 'react-redux';
import { FaTrashAlt } from 'react-icons/fa';
import {
  Input,
  Col,
  Card,
  CardBody,
  CardTitle,
  CardText,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button
} from 'reactstrap';

import { css } from '@emotion/core';
import { ClipLoader } from 'react-spinners';

const override: any = css`
  display: block;
  margin: 0 auto;
`;

import TodoInput from './TodoInput';
import {
  Todo as TodoInterface,
  TodosFilters,
  InitialTodoLoadingState
} from '../../../../store/todos/types';
import { timeDifference } from '../../../../utils';
import {
  toggleComplete,
  ToggleTodoArgs,
  deleteTodo,
  DeleteTodoArgs
} from '../../../../store/todos/actions';
import { AppState } from '../../../../store';

interface TodoProps {
  complete: boolean;
  _id: string;
  loading: InitialTodoLoadingState;
  toggleComplete: ({ todoId, userId, complete }: ToggleTodoArgs) => void;
  deleteTodo: ({ todoId, userId }: DeleteTodoArgs) => void;
  userId: string;
  filter: TodosFilters;
  text: string;
  createdAt: string;
  updatedAt: string;
}

interface TodoState {
  isEditing: boolean;
  modal: boolean;
}

class TodoComponent extends Component<TodoProps, TodoState> {
  state = {
    isEditing: false,
    modal: false
  };

  handleToggleComplete = async () => {
    const { complete, _id, userId, toggleComplete } = this.props;
    await toggleComplete({
      todoId: _id,
      userId,
      complete: !complete
    });
  };

  handleIsEditing = () => {
    this.setState(state => ({
      isEditing: !state.isEditing
    }));
  };

  toggleModal = () => {
    this.setState(prevState => ({
      modal: !prevState.modal
    }));
  };

  onDelete = async () => {
    const { deleteTodo, _id, userId } = this.props;
    await deleteTodo({ todoId: _id, userId });
  };

  render() {
    const { isEditing } = this.state;
    const {
      loading,
      complete,
      filter,
      text,
      _id,
      createdAt,
      updatedAt
    } = this.props;
    if (filter === 'Active' && complete && !loading.toggleComplete) {
      return null;
    } else if (filter === 'Completed' && !complete && !loading.toggleComplete) {
      return null;
    }
    return (
      <Col lg='4' md='6' sm='12'>
        <Card className='mx-auto mt-4 w-75 p-3'>
          <div className='d-flex justify-content-center'>
            {!!loading.toggleComplete && (
              <div className='position-absolute d-flex align-items-center'>
                <ClipLoader
                  css={override}
                  sizeUnit={'px'}
                  size={15}
                  color={'#123abc'}
                  loading={loading.toggleComplete}
                />
                <span className='ml-1'>Toggling Complete...</span>
              </div>
            )}
            {!!loading.updateText && (
              <div className='position-absolute d-flex align-items-center'>
                <ClipLoader
                  css={override}
                  sizeUnit={'px'}
                  size={15}
                  color={'#123abc'}
                  loading={loading.updateText}
                />
                <span className='ml-1'>Updating Text...</span>
              </div>
            )}
          </div>
          <Modal isOpen={this.state.modal} toggle={this.toggleModal}>
            <ModalHeader toggle={this.toggleModal}>
              Delete todo: {text}
            </ModalHeader>
            <ModalBody className='text-center'>
              Please Confirm to proceed.
            </ModalBody>
            <ModalFooter>
              <Button color='danger' onClick={this.onDelete}>
                {loading.deleteTodo ? (
                  <div>
                    <ClipLoader
                      css={override}
                      sizeUnit={'px'}
                      size={15}
                      color={'#fff'}
                      loading={loading.deleteTodo}
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
          <CardBody>
            <CardTitle className='d-flex justify-content-between'>
              <Input
                onChange={this.handleToggleComplete}
                checked={complete}
                type='checkbox'
              />
              {isEditing ? (
                <TodoInput
                  todoId={_id}
                  todoText={text}
                  handleIsEditing={this.handleIsEditing}
                />
              ) : (
                <div
                  onDoubleClick={this.handleIsEditing}
                  style={{
                    textDecoration: complete ? 'line-through' : 'none',
                    cursor: 'pointer'
                  }}
                  className='mx-auto'>
                  {text}
                </div>
              )}
              <FaTrashAlt
                onClick={this.toggleModal}
                style={{
                  color: 'red',
                  cursor: 'pointer'
                }}
              />
            </CardTitle>
            <CardText
              className='mt-2 text-center'
              style={{ borderTop: 'solid black 1px' }}>
              {createdAt === updatedAt
                ? `Added ${timeDifference(createdAt)}`
                : `Updated ${timeDifference(updatedAt)}`}
            </CardText>
          </CardBody>
        </Card>
      </Col>
    );
  }
}

const mapStateToProps = ({ user, todos }: AppState) => ({
  userId: user._id,
  page: todos.page,
  filter: todos.filter
});

const mapDispatchToProps = {
  toggleComplete,
  deleteTodo
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TodoComponent);
