import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import LoginScreen from './LoginScreen';
import Authorized from './Authorized';
import { appStart, appShutdown } from 'modules/core/app';
import { getAccessToken } from 'modules/auth';

class App extends Component {
  static propTypes = {
    appStart: PropTypes.func.isRequired,
    appShutdown: PropTypes.func.isRequired,
    ifAccessToken: PropTypes.bool.isRequired,
  };

  componentWillMount() {
    this.props.appStart();
  }

  componentWillUnmount() {
    this.props.appShutdown();
  }

  render() {
    const { ifAccessToken } = this.props;

    return (
      <Fragment>
        <div className="d-none d-md-block">
          {!ifAccessToken && <LoginScreen />}
          {ifAccessToken && <Authorized />}
        </div>
        <div className="mobile-message d-md-none">
          <i className="fa ui-icon-devices" />
          <FormattedMessage
            id="app.messages.use_wider_devices"
            defaultMessage="Please, use wider device"
          />
        </div>
      </Fragment>
    );
  }
}

export default withRouter(
  connect(state => ({ ifAccessToken: !!getAccessToken(state) }), {
    appStart,
    appShutdown,
  })(App)
);
