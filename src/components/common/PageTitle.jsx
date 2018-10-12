import React from 'react';
import PropTypes from 'prop-types';

const PageTitle = ({ icon, children }) => {
  return (
    <h1 className="page-title">
      {icon && <i className="material-icons">{icon}</i>}
      {children}
    </h1>
  );
};

PageTitle.propTypes = {
  icon: PropTypes.string,
  children: PropTypes.node.isRequired,
};

export default PageTitle;
