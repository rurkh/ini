import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { isAuthenticated } from 'modules/auth';
import { getUserPortalAreas } from 'modules/user';

const PrivateRoute = ({
  component: Component,
  userHasAccess,
  render,
  ...rest
}) => {
  return (
    <Route
      {...rest}
      render={props => {
        if (userHasAccess) {
          return !!Component ? <Component {...props} /> : render(props);
        } else {
          return <Redirect to={'/403'} />;
        }
      }}
    />
  );
};

PrivateRoute.propTypes = {
  component: PropTypes.func,
  portalArea: PropTypes.string,
  render: PropTypes.func,
};

PrivateRoute.defaultProps = {
  portalArea: false,
  render: () => null,
};

const mapStateToProps = (state, { portalArea }) => ({
  userHasAccess:
    isAuthenticated(state) &&
    (!portalArea || getUserPortalAreas(state).includes(portalArea)),
});

export default connect(mapStateToProps)(PrivateRoute);
