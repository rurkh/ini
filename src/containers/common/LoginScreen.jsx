import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { InputText } from 'primereact/components/inputtext/InputText';
import { Button } from 'primereact/components/button/Button';
import { FormattedMessage, injectIntl } from 'react-intl';

import { signIn, getAccessToken, getAuthErrors } from 'modules/auth';
import withBodyClass from 'components/hoc/withBodyClass';
import logo from 'assets/images/logo/initrack-logo-square.png';

const loginButtonText = {
  id: 'auth.button.login',
  defaultMessage: 'Sign In',
};

class LoginScreen extends Component {
  static propTypes = {
    signIn: PropTypes.func.isRequired,
  };

  state = {
    username: '',
    password: '',
  };

  login = e => {
    e.preventDefault();

    const { username, password } = this.state;
    this.props.signIn(username, password);
  };

  onInputChangeHandler = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  render() {
    const { username, password } = this.state;
    const { formatMessage } = this.props.intl;

    return (
      <div className="card login-panel ui-fluid">
        <form onSubmit={this.login}>
          <div className="login-panel__item">
            <img src={logo} alt="logo" />
          </div>
          <div className="login-panel__item">
            <span className="md-inputfield">
              <InputText
                id="float-input-username"
                name="username"
                onChange={this.onInputChangeHandler}
                className="ui-inputtext ui-corner-all ui-state-default ui-widget"
                type="text"
              />
              <label htmlFor="float-input-username">
                <FormattedMessage
                  id="auth.label.username"
                  defaultMessage="Username"
                />
              </label>
            </span>
          </div>
          <div className="login-panel__item">
            <span className="md-inputfield">
              <InputText
                id="float-input-password"
                name="password"
                onChange={this.onInputChangeHandler}
                className="ui-inputtext ui-corner-all ui-state-default ui-widget"
                type="password"
              />
              <label htmlFor="float-input-password">
                <FormattedMessage
                  id="auth.label.password"
                  defaultMessage="Password"
                />
              </label>
            </span>
          </div>

          <div className="login-panel__item error-message-login">
            <p className="ui-field-error">{this.props.errorMessage}</p>
          </div>
          <div className="login-panel__item">
            <Button
              type="submit"
              label={formatMessage(loginButtonText)}
              disabled={!username || !password ? 'disabled' : false}
              className="ui-button-primary"
              icon="ui-icon-person"
              iconPos="left"
            />
          </div>
        </form>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  token: getAccessToken(state),
  errorMessage: getAuthErrors(state),
});

export default connect(mapStateToProps, {
  signIn,
})(withBodyClass('login-body')(injectIntl(LoginScreen)));
