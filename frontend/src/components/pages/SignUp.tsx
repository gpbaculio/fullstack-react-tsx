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
import { setAuthorizationHeader } from '../../utils';
import isEmail from 'validator/lib/isEmail';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { withRouter, RouteComponentProps } from 'react-router';

import { AppState } from '../../store';

import { signUp, clearError, credentials } from '../../store/user/actions';
import { FormState } from './types';

interface SignUpProps extends RouteComponentProps {
  signUp: (credentials: credentials, callback: (token: string) => void) => void;
  clearError: typeof clearError;
  loading: boolean;
  error: string;
}

class SignUp extends React.Component<SignUpProps, FormState> {
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

  componentDidUpdate(_prevProps: SignUpProps, { errors }: FormState) {
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

  onSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    const { data } = this.state;
    const errors = this.validate(data);
    this.setState({ errors });
    if (Object.keys(errors).length === 0) {
      await this.props.signUp(data, (token: string) => {
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
              <CardHeader>Join the Club!</CardHeader>
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
                    Sign Up
                  </Button>
                  <FormText className='text-center'>
                    or <Link to='/login'>Login</Link> if you have an account
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
  loading: user.loading.signUp,
  error: user.errors.signUp
});

export default connect(
  mapStateToProps,
  {
    signUp,
    clearError
  }
)(withRouter(SignUp));
