import React, { Component } from 'react';
import { connect } from 'react-redux';
import { ClipLoader } from 'react-spinners';
import { css } from '@emotion/core';
import { RouteComponentProps, match } from 'react-router-dom';
import { Alert, Container } from 'reactstrap';

import { AppState } from '../../store';

import { confirmToken, clearError } from '../../store/user/actions';

const override: any = css`
  display: block;
  margin: 0 auto;
`;

interface UrlParams {
  token: string;
}

interface ConfirmTokenProps extends RouteComponentProps {
  confirmToken: (token: string) => void;
  clearError: typeof clearError;
  error: string;
  match: match<UrlParams>;
  loading: boolean;
  confirmed: boolean;
  email: string;
}

interface ConfirmTokenState {
  error: string;
}
class ConfirmToken extends Component<ConfirmTokenProps, ConfirmTokenState> {
  state = {
    error: ''
  };

  componentDidUpdate(
    _prevProps: ConfirmTokenProps,
    { error }: ConfirmTokenState
  ) {
    if (this.props.error !== error) {
      this.setState({ error: this.props.error });
    }
  }

  componentDidMount = () => {
    const { confirmToken, match } = this.props;
    confirmToken(match.params.token);
  };

  componentWillUnmount = () => {
    this.props.clearError();
  };

  render() {
    const { loading, confirmed, email } = this.props;
    const { error } = this.state;
    return (
      <Container>
        {!!loading && (
          <ClipLoader
            css={override}
            sizeUnit={'px'}
            size={50}
            color={'#123abc'}
            loading={loading}
          />
        )}
        {error && (
          <Alert color='danger'>
            <h3 className='alert-heading text-center'>{error}</h3>
          </Alert>
        )}
        {confirmed && (
          <Alert color='success'>
            <h4 className='alert-heading'>
              Congratulations! <strong>{email}</strong> You have successfully
              verified your account
            </h4>
          </Alert>
        )}
      </Container>
    );
  }
}

const mapStateToProps = ({ user }: AppState) => ({
  loading: user.loading.confirmToken,
  error: user.errors.confirmToken,
  confirmed: !!user.confirmed,
  email: user.email
});

export default connect(
  mapStateToProps,
  {
    confirmToken,
    clearError
  }
)(ConfirmToken);
