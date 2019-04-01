import React, { Component } from 'react';
import { Input, Form } from 'reactstrap';
import { connect } from 'react-redux';

import { updateText, UpdateTextArgs } from '../../../../store/todos/actions';

interface TodoInputProps {
  todoId: string;
  todoText: string;
  handleIsEditing: () => void;
  updateText: ({ todoId, text }: UpdateTextArgs) => void;
}

interface TodoInputString {
  [text: string]: string;
}

class TodoInput extends Component<TodoInputProps, TodoInputString> {
  state = {
    text: ''
  };

  componentDidMount = () => {
    this.setState({ text: this.props.todoText });
  };

  onSubmit = async (
    e: React.FormEvent<HTMLFormElement> | React.FocusEvent<HTMLInputElement>
  ) => {
    e.preventDefault();
    const text = this.state.text.trim();
    const { updateText, handleIsEditing, todoId, todoText } = this.props;
    if (!!text && text !== todoText) {
      await updateText({ todoId, text });
    } else {
      this.setState({ text: todoText });
    }
    handleIsEditing();
  };

  onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, name } = e.target;
    this.setState({
      [name]: value
    });
  };

  render() {
    return (
      <Form onSubmit={this.onSubmit}>
        <Input
          type='text'
          name='text'
          value={this.state.text}
          onChange={this.onChange}
          onBlur={this.onSubmit}
        />
      </Form>
    );
  }
}

const mapDispatchToProps = {
  updateText
};

export default connect(
  null,
  mapDispatchToProps
)(TodoInput);
