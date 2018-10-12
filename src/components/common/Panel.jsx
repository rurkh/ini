import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { NavLink } from 'react-router-dom';

const PanelTabs = ({ children }) => {
  return (
    <div className="panel-tabs">
      {children.map(({ href, label, className, ...props }) => {
        return href ? (
          <NavLink
            to={href}
            className={classNames('panel-tab', className)}
            activeClassName="active"
            {...props}
          >
            {label}
          </NavLink>
        ) : (
          <span className={classNames('panel-tab', className)} {...props}>
            {label}
          </span>
        );
      })}
    </div>
  );
};

PanelTabs.propTypes = {
  children: PropTypes.arrayOf(
    PropTypes.shape({
      href: PropTypes.string,
      label: PropTypes.string.isRequired,
      className: PropTypes.string,
    })
  ),
};

const PanelTitle = ({ children }) => (
  <h2 className="panel-title">
    <span className="overflow-ellipsis">{children}</span>
  </h2>
);

PanelTitle.propTypes = {
  children: PropTypes.string.isRequired,
};

const Panel = ({
  title,
  tabs,
  actions,
  children,
  className,
  scrollable = true,
}) => {
  return (
    <div className={classNames('panel', className)}>
      {!!(title || actions || tabs) && (
        <div className="panel-header">
          {!!title && <PanelTitle>{title}</PanelTitle>}
          {!!tabs && <PanelTabs>{tabs}</PanelTabs>}
          {!!actions && <div className="panel-actions">{actions}</div>}
        </div>
      )}
      <div
        className={classNames('panel-content', {
          'panel-content-scrollable': scrollable,
        })}
      >
        {React.Children.map(children, child => (
          <div className="panel-content-item">{child}</div>
        ))}
      </div>
    </div>
  );
};

Panel.propTypes = {
  title: PropTypes.string,
  tabs: PropTypes.array,
  actions: PropTypes.node,
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  scrollable: PropTypes.bool,
};

export default Panel;
