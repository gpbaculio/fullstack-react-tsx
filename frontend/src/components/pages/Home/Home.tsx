import React from 'react';
import { Alert, Col, Container, Row } from 'reactstrap';
import { connect } from 'react-redux';
import { withRouter, RouteComponentProps } from 'react-router-dom';

import { Todos } from './Todos';
import AddTodo from './AddTodo';
import Search from './Search';
import Filter from './Filter';
import { AppState } from '../../../store';
import Paginator from './Paginator';

interface HomeProps extends RouteComponentProps {
  confirmed: boolean;
}

class Home extends React.Component<HomeProps> {
  render() {
    const { confirmed } = this.props;
    return (
      <React.Fragment>
        <Container>
          <Row>
            <Col xs='12' md='6'>
              {confirmed ? (
                <AddTodo />
              ) : (
                <Alert
                  className='text-center mx-auto mt-4 mb-xs-1 mb-md-5'
                  color='primary'>
                  Please confirm your account to Add Todo
                </Alert>
              )}
            </Col>
            <Col xs='12' md='6'>
              <Search />
            </Col>
            <Col sm='12'>
              <Filter />
            </Col>
            <Todos />
          </Row>
        </Container>
        <Container>
          <Row>
            <Col>
              <div className='d-flex justify-content-center'>
                <Paginator />
              </div>
            </Col>
          </Row>
        </Container>
      </React.Fragment>
    );
  }
}

const mapStateToProps = ({ user }: AppState) => ({
  confirmed: user.confirmed
});

export default connect(
  mapStateToProps,
  null
)(withRouter(Home));
