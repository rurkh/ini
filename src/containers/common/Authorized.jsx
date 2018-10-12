/* global window */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import classNames from 'classnames';
import { Route, Switch, Redirect, withRouter } from 'react-router-dom';

import AppMenu from './AppMenu';
import AppTopbar from './AppTopbar';
import Splash from 'components/common/Splash';
import Notifications from './Notifications';
import PrivateRoute from 'components/common/PrivateRoute';
import AccessDenied from 'components/common/AccessDeniedPage';
import NotFound from 'components/common/NotFoundPage';
import StartPageRedirect from 'containers/common/StartPageRedirect';
import UserManagement from 'containers/users/UserManagement';
import Depositions from 'containers/depositions/Depositions';
import Districts from 'containers/districts/Districts';
import Messages from 'containers/messages/Messages';
import MyData from 'containers/my-data/MyData';
import { preloadData, isDataPreloaded } from 'modules/core/app';
import { getUserDetails } from 'modules/user';

class Authorized extends Component {
  static propTypes = {
    preloadData: PropTypes.func.isRequired,
    isPreloading: PropTypes.bool.isRequired,
  };

  static childContextTypes = {
    currentUser: PropTypes.object,
    canCreate: PropTypes.func,
    getUserDisplayName: PropTypes.func,
  };

  getChildContext() {
    const { currentUser } = this.props;

    return {
      currentUser,
      canCreate: this.userCanCreate,
      getUserDisplayName: this.getUserDisplayName,
    };
  }

  userCanCreate = entityName =>
    this.props.currentUser &&
    !!this.props.currentUser[`can_create_${entityName}s`];

  getUserDisplayName = user => {
    if (!user) {
      return '';
    }

    const { username, firstname = '', lastname = '' } = user;
    const fullName = `${firstname} ${lastname}`.trim();

    return fullName || username;
  };

  componentWillMount() {
    this.props.preloadData();
  }

  state = {
    toggled: window.outerWidth < 1300,
    rotateMenuButton: false,
  };

  toggleMenu = event => {
    event.preventDefault();

    this.setState({
      rotateMenuButton: !this.state.rotateMenuButton,
      topbarMenuActive: false,
      toggled: !this.state.toggled,
    });
  };

  render() {
    const { isPreloading } = this.props;

    if (isPreloading) {
      return <Splash />;
    }

    const layoutContainerClassName = classNames('layout-container', {
      'menu-layout-slim': this.state.toggled,
      'menu-layout-static': !this.state.toggled,
    });

    return (
      <div className={layoutContainerClassName}>
        <AppTopbar menuToggle={this.toggleMenu} />
        <AppMenu currentPath={this.props.location.pathname} />
        <Notifications history={this.props.history} />
        <div className="layout-main">
          <div className="ui-fluid">
            <Switch>
              <PrivateRoute
                path="/messages"
                portalArea="messages"
                render={() => (
                  <Switch>
                    <PrivateRoute
                      path="/messages/:category"
                      portalArea="messages"
                      component={Messages}
                    />
                    <Redirect to="/messages/inbox" />
                  </Switch>
                )}
              />
              <PrivateRoute
                path="/users/:user?"
                portalArea="users"
                component={UserManagement}
              />
              <PrivateRoute
                path="/depositions/:deposition?"
                portalArea="depositions"
                component={Depositions}
              />
              <PrivateRoute
                path="/districts/:district?"
                portalArea="districts"
                component={Districts}
              />
              <PrivateRoute
                path="/my-data"
                portalArea="my_data"
                component={MyData}
              />
              <Route path="/403" component={AccessDenied} />
              <Route path="/404" component={NotFound} />
              <StartPageRedirect />
            </Switch>
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(
  connect(
    state => ({
      isPreloading: isDataPreloaded(state),
      currentUser: getUserDetails(state),
    }),
    {
      preloadData,
    }
  )(Authorized)
);
