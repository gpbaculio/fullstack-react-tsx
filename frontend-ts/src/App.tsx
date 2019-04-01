import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { connect } from 'react-redux';
import { css } from '@emotion/core';
import { ClipLoader } from 'react-spinners';
import { SignUp, LogIn, Home, ConfirmToken } from './components/pages';
import { GuestRoute, AuthenticatedRoute } from './components/routes';
import { Header } from './components/navigation';
import { fetchUser } from './store/user/actions';
import { setAuthorizationHeader } from './utils';
import { AppState } from './store';

const override: any = css`
  display: block;
  margin: 0 auto;
`;

interface AppProps {
  loading: boolean;
  fetchUser: () => void;
}

class App extends React.Component<AppProps> {
  componentDidMount = async () => {
    const token = localStorage.getItem('token');
    await setAuthorizationHeader(token);
    if (token && !`${window.location.href}`.includes('/confirmation')) {
      await this.props.fetchUser();
    }
  };

  render() {
    return (
      <React.Fragment>
        {!!this.props.loading ? (
          <div
            style={{
              left: 0,
              top: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, .1)'
            }}
            className='d-flex position-absolute align-items-center justify-content-center'>
            <ClipLoader
              css={override}
              sizeUnit={'px'}
              size={100}
              color={'#123abc'}
              loading={this.props.loading}
            />
          </div>
        ) : (
          <React.Fragment>
            <Header />
            <Switch>
              <Route
                exact
                path='/confirmation/:token'
                component={ConfirmToken}
              />
              <GuestRoute path='/signup' exact component={SignUp} />
              <GuestRoute path='/login' exact component={LogIn} />
              <AuthenticatedRoute
                exact
                path='/(home)?/:filter?'
                component={Home}
              />
            </Switch>
          </React.Fragment>
        )}
      </React.Fragment>
    );
  }
}

const mapStateToProps = ({ user }: AppState) => ({
  loading: user.loading.fetchUser
});

const mapDispatchToProps = {
  fetchUser
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);
