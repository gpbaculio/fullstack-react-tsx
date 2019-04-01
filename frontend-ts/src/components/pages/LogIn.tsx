import React from 'react';
import {
  Container,
  Row,
  Col,
  Card,
  CardHeader,
  CardBody,
  Form,
  Button,
  FormGroup,
  Label,
  Input,
  FormFeedback,
  Alert,
  FormText
} from 'reactstrap';
import isEmail from 'validator/lib/isEmail';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { setAuthorizationHeader } from '../../utils';

import { AppState } from '../../store';

import { logIn, clearError, credentials } from '../../store/user/actions';
import { withRouter, RouteComponentProps } from 'react-router';

import { FormState } from './types';

interface LoginProps extends RouteComponentProps {
  logIn: (credentials: credentials, callback: (token: string) => void) => void;
  clearError: typeof clearError;
  loading: boolean;
  error: string;
}

class Login extends React.Component<LoginProps, FormState> {
  state = {
    data: {
      email: '',
      password: ''
    },
    errors: {
      server: '',
      email: '',
      password: ''
    }
  };

  componentDidUpdate(_prevProps: LoginProps, { errors }: FormState) {
    const { error } = this.props;
    if (error !== errors.server) {
      this.setState(prevState => ({
        errors: { ...prevState.errors, server: error }
      }));
    }
  }

  componentWillUnmount() {
    this.props.clearError();
  }

  onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { data } = this.state;
    const { name, value } = e.target;
    this.setState({
      data: { ...data, [name]: value }
    });
  };

  onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { data } = this.state;
    const errors = this.validate(data);
    this.setState({ errors });
    if (Object.keys(errors).length === 0) {
      await this.props.logIn(data, (token: string) => {
        setAuthorizationHeader(token);
        this.props.history.push('/');
      });
    }
  };

  validate = (data: FormState['data']) => {
    const errors: any = {};
    if (!isEmail(data.email)) {
      errors.email = 'Invalid email';
    }
    if (!data.password) {
      errors.password = "Can't be blank";
    }
    return errors;
  };

  render() {
    const { data, errors } = this.state;
    return (
      <Container style={{ height: '100vh' }}>
        <Row
          className='align-items-center justify-content-center'
          style={{ height: '100vh' }}>
          <Col xs='12' sm='8' lg='6'>
            <Card>
              <CardHeader>Welcome Back!</CardHeader>
              <CardBody>
                <Form onSubmit={this.onSubmit}>
                  {!!errors.server && (
                    <Alert color='danger'>{errors.server}</Alert>
                  )}
                  <FormGroup>
                    <Label className='d-block' for='email'>
                      Email
                      <Input
                        className={
                          errors.email
                            ? 'form-control is-invalid'
                            : 'form-control'
                        }
                        value={data.email}
                        onChange={this.onChange}
                        type='email'
                        name='email'
                        id='email'
                        placeholder='example@domain.com'
                      />
                      <FormFeedback>{errors.email}</FormFeedback>
                    </Label>
                  </FormGroup>
                  <FormGroup>
                    <Label className='d-block' for='password'>
                      Password
                      <Input
                        className={
                          errors.password
                            ? 'form-control is-invalid'
                            : 'form-control'
                        }
                        value={data.password}
                        onChange={this.onChange}
                        type='password'
                        name='password'
                        id='password'
                        placeholder='Password'
                      />
                      <FormFeedback>{errors.password}</FormFeedback>
                    </Label>
                  </FormGroup>
                  <Button
                    disabled={this.props.loading}
                    type='submit'
                    color='primary'
                    className='btn-block'>
                    Login
                  </Button>
                  <FormText className='text-center'>
                    <Link to='/signup'>Signup</Link> if you do not have an
                    account
                  </FormText>
                </Form>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    );
  }
}

const mapStateToProps = ({ user }: AppState) => ({
  loading: user.loading.logIn,
  error: user.errors.logIn
});

export default connect(
  mapStateToProps,
  {
    logIn,
    clearError
  }
)(withRouter(Login));
