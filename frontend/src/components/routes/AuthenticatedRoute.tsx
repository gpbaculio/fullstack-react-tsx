import React from 'react';
import { connect } from 'react-redux';
import {
  Route,
  Redirect,
  RouteProps,
  RouteComponentProps
} from 'react-router-dom';
import { AppState } from '../../store';

interface GuestRouteProps extends RouteProps {
  isAuthenticated: boolean;
  component: new (props: RouteComponentProps) => React.Component;
}

const UserRoute: React.SFC<GuestRouteProps> = ({
  isAuthenticated,
  component: Component,
  ...rest
}) => (
  <Route
    {...rest}
    render={props =>
      !!isAuthenticated ? <Component {...props} /> : <Redirect to='/login' />
    }
  />
);

const mapStateToProps = ({ user }: AppState) => ({
  isAuthenticated: !!user._id && !!user.email
});

export default connect(mapStateToProps)(UserRoute);
