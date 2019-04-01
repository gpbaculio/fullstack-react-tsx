import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Input, Form, Button } from 'reactstrap';

import {
  setSearchText,
  fetchTodos,
  FetchTodosArgs,
  clearSearchText
} from '../../../store/todos/actions';
import { TodosFilters } from '../../../store/todos/types';
import { AppState } from '../../../store';

interface SearchProps {
  setSearchText: (text: string) => void;
  fetchTodos: ({ page, filter, searchText }: FetchTodosArgs) => void;
  filter: TodosFilters;
  clearSearchText: () => void;
  searchText: string;
}
interface SearchState {
  text: string;
}
class Search extends Component<SearchProps, SearchState> {
  state = {
    text: ''
  };

  onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ text: e.target.value.trim() });
  };

  onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { text } = this.state;
    const { fetchTodos, filter, setSearchText } = this.props;
    if (text) {
      setSearchText(text);
      await fetchTodos({ page: 1, filter, searchText: text });
    }
  };

  onClearText = () => {
    const { clearSearchText, fetchTodos, filter, searchText } = this.props;
    if (searchText) {
      this.setState({ text: '' }, () => {
        clearSearchText();
        fetchTodos({ page: 1, filter });
      });
    }
  };

  render() {
    const { text } = this.state;
    return (
      <Form
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
        <Input
          placeholder='Search todos'
          value={text}
          className='form-control w-75'
          onChange={this.onChange}
        />
        <Button
          onClick={this.onClearText}
          style={{ color: 'red', fontSize: '18px' }}
          className='border-0'
          color='link'>
          clear
        </Button>
      </Form>
    );
  }
}

const mapStateToProps = ({ todos }: AppState) => ({
  filter: todos.filter,
  searchText: todos.searchText
});

const mapDispatchToProps = {
  fetchTodos,
  setSearchText,
  clearSearchText
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Search);
