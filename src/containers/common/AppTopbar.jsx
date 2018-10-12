import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Menubar } from 'primereact/components/menubar/Menubar';
import { createStructuredSelector } from 'reselect';
import { injectIntl } from 'react-intl';

import { signOut } from 'modules/auth';
import {
  changeStartPage,
  getUserPortalAreas,
  getUserStartPage,
  getUserFullName,
} from 'modules/user';
import transMsg from 'utils/transMsg';

class AppTopbar extends PureComponent {
  static propTypes = {
    userMenus: PropTypes.arrayOf(PropTypes.any).isRequired,
    startScreen: PropTypes.string.isRequired,
  };

  trans(id) {
    const { formatMessage } = this.props.intl;
    return formatMessage(transMsg(id));
  }

  signOut = () => {
    this.props.signOut();
  };

  onSettingsChange = ({ item: { name } }) => {
    this.props.changeStartPage(name);
  };

  render() {
    const { username } = this.props;
    const menuModel = [
      {
        icon: 'ui-icon-person',
        label: username,
        iconPosition: 'right',
        items: [
          {
            label: this.trans('app.button.start_page'),
            items: this.props.userMenus.map(item => {
              return {
                label: this.trans(`app.portal_area.${item}`),
                name: item,
                command: this.onSettingsChange,
                icon: item === this.props.startScreen ? 'fa-check' : 'faw',
              };
            }),
          },
          { separator: true },
          {
            label: this.trans('app.button.sign_out'),
            command: this.signOut,
          },
        ],
      },
    ];

    return (
      <div className="topbar clearfix">
        <div className="topbar-left">
          <div className="logo" />
        </div>
        <div className="topbar-right">
          <a id="menu-button" onClick={this.props.menuToggle}>
            <i />
          </a>

          <Menubar
            className="topbar-items animated fadeInDown"
            model={menuModel}
          />
        </div>
      </div>
    );
  }
}

const mapStateToProps = createStructuredSelector({
  userMenus: getUserPortalAreas,
  startScreen: getUserStartPage,
  username: getUserFullName,
});

export default connect(mapStateToProps, {
  signOut,
  changeStartPage,
})(injectIntl(AppTopbar));
