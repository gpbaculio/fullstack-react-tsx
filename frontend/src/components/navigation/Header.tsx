import React from 'react';
import {
  Collapse,
  Navbar,
  NavbarToggler,
  Nav,
  NavItem,
  NavLink,
  Container
} from 'reactstrap';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import axios from 'axios';
import { withRouter, RouteComponentProps } from 'react-router';
import { AppState } from '../../store';

import { logOut } from '../../store/user/actions';

interface HeaderProps extends RouteComponentProps {
  logOut: typeof logOut;
  email: string;
  _id: string;
}

class Header extends React.Component<HeaderProps> {
  state = {
    isOpen: false
  };

  logOut = (e: React.MouseEvent) => {
    e.preventDefault();
    localStorage.removeItem('token');
    delete axios.defaults.headers.common.authorization;
    this.props.logOut();
  };

  toggle = () => {
    const { isOpen } = this.state;
    this.setState({
      isOpen: !isOpen
    });
  };

  render() {
    const { _id, email } = this.props;
    return (
      <React.Fragment>
        <Navbar color='light' light expand='md'>
          <Container>
            <Link to='/home' className='navbar-brand'>
              Glendon Philipp Baculio
            </Link>
            <NavbarToggler onClick={this.toggle} />
            <Collapse isOpen={this.state.isOpen} navbar>
              <Nav className='ml-auto' navbar>
                {email && _id ? (
                  <React.Fragment>
                    <NavItem>
                      <NavLink disabled style={{ color: 'black' }}>
                        <strong>{this.props.email}</strong>
                      </NavLink>
                    </NavItem>
                    <NavItem>
                      <button
                        type='button'
                        style={{
                          backgroundColor: '#F8F9FA',
                          border: 'none',
                          cursor: 'pointer'
                        }}
                        className='nav-link'
                        onClick={this.logOut}>
                        Logout
                      </button>
                    </NavItem>
                  </React.Fragment>
                ) : (
                  <React.Fragment>
                    <NavItem>
                      <Link className='nav-link' to='/login'>
                        Login
                      </Link>
                    </NavItem>
                    <NavItem>
                      <Link className='nav-link' to='/signup'>
                        Signup
                      </Link>
                    </NavItem>
                  </React.Fragment>
                )}
              </Nav>
            </Collapse>
          </Container>
        </Navbar>
      </React.Fragment>
    );
  }
}

const mapStateToProps = ({ user }: AppState) => ({
  email: user.email,
  _id: user._id
});

export default connect(
  mapStateToProps,
  { logOut }
)(withRouter(Header));
