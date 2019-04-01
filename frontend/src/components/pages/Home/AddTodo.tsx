import React, { Component } from 'react';
import { connect } from 'react-redux';

import { AppState } from '../../../store';
import { addTodo, AddTodoArgs } from '../../../store/todos/actions';
import { css } from '@emotion/core';
import { ClipLoader } from 'react-spinners';

const override: any = css`
  display: block;
  margin: 0 auto;
`;

interface AddTodoProps {
  addTodo: ({ text, userId }: AddTodoArgs) => void;
  userId: string;
  loading: boolean;
}
interface AddTodoState {
  [text: string]: string;
}
class AddTodo extends Component<AddTodoProps, AddTodoState> {
  state = {
    text: ''
  };

  onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    this.setState({
      [name]: value
    });
  };

  onSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    const text = this.state.text.trim();
    if (text) {
      await this.props.addTodo({ text, userId: this.props.userId });
      this.setState({ text: '' });
    }
  };

  render() {
    return (
      <form
        className='
          form-inline
          justify-content-center
          mx-auto
          mt-4
          mb-xs-1
          mb-md-5
          align-items-start
        '
        onSubmit={this.onSubmit}>
        <input
          type='text'
          id='text'
          name='text'
          value={
            this.props.loading
              ? `Adding ${this.state.text}...`
              : this.state.text
          }
          placeholder='Add Todo'
          disabled={this.props.loading}
          onChange={this.onChange}
          className='form-control w-75'
        />
      </form>
    );
  }
}

const mapStateToProps = ({ todos, user }: AppState) => ({
  loading: todos.loading.addTodo,
  userId: user._id
});

const mapDispatchToProps = {
  addTodo
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AddTodo);
