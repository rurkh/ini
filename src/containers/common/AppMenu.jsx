import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { NavLink } from 'react-router-dom';
import { injectIntl } from 'react-intl';
import _compact from 'lodash/compact';

import { getUnreadCount } from 'modules/messages/messages';
import { getUserPortalAreas } from 'modules/user';
import portalAreas from 'utils/portalAreas';
import transMsg from 'utils/transMsg';

class AppMenu extends Component {
  static defaultProps = {
    model: null,
    unread: 0,
  };

  static propTypes = {
    model: PropTypes.array,
    unread: PropTypes.number,
  };

  renderBadge({ badgeProp }) {
    if (badgeProp && this.props[badgeProp]) {
      return <span className="menu-item-badge">{this.props[badgeProp]}</span>;
    }
    return null;
  }

  renderNavLink(item) {
    return (
      <NavLink
        activeClassName="active"
        to={item.url || '#'}
        target={item.target}
      >
        <i className="material-icons">{item.icon}</i>
        <span>{item.label}</span>
        {this.renderBadge(item)}
        {!!item.items &&
          !!item.items.length && (
            <i className="material-icons submenu-icon">keyboard_arrow_down</i>
          )}
      </NavLink>
    );
  }

  renderSubMenu(items, className = '') {
    return (
      <ul className={className}>
        {items.map((item, i) => (
          <li key={item.name || i}>
            {this.renderNavLink(item)}
            {!!item.items &&
              !!item.items.length &&
              this.renderSubMenu(item.items)}
          </li>
        ))}
      </ul>
    );
  }

  render() {
    const { formatMessage } = this.props.intl;

    const menuItems = _compact(
      this.props.menus.map(item => {
        return typeof portalAreas[item] === 'object'
          ? {
              name: item,
              ...portalAreas[item],
              label: formatMessage(
                transMsg(portalAreas[item].label || `app.portal_area.${item}`)
              ),
            }
          : null;
      })
    );

    return (
      <div className="layout-menu layout-menu-dark side-menu">
        <div className="nano">
          <div className="nano-content">
            {this.renderSubMenu(
              menuItems,
              'ultima-menu ultima-main-menu clearfix'
            )}
            <div className="copyright">
              Copyright 2018 - iniTrack &copy; GmbH
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = createStructuredSelector({
  menus: getUserPortalAreas,
  unread: getUnreadCount,
});
export default injectIntl(connect(mapStateToProps)(AppMenu));
