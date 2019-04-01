import React from 'react';
import { connect } from 'react-redux';
import {
  Route,
  Redirect,
  RouteComponentProps,
  RouteProps
} from 'react-router-dom';
import { AppState } from '../../store';

interface GuestRouteProps extends RouteProps {
  isAuthenticated: boolean;
  component: new (props: RouteComponentProps) => React.Component;
}

const GuestRoute: React.SFC<GuestRouteProps> = ({
  isAuthenticated,
  component: Component,
  ...rest
}) => (
  <Route
    {...rest}
    render={props =>
      !!isAuthenticated ? <Redirect to='/' /> : <Component {...props} />
    }
  />
);

const mapStateToProps = ({ user }: AppState) => ({
  isAuthenticated: !!user._id && !!user.email
});

export default connect(mapStateToProps)(GuestRoute);
