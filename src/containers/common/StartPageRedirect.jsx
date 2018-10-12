import React from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import _first from 'lodash/first';

import { getUserPortalAreas, getUserStartPage } from 'modules/user';
import portalAreas from 'utils/portalAreas';

const StartPageRedirect = ({ startPageUrl }) => <Redirect to={startPageUrl} />;

const mapStateToProps = state => {
  const area = getUserStartPage(state) || _first(getUserPortalAreas(state));
  const url = portalAreas[area] ? portalAreas[area].url : '/404';
  return { startPageUrl: url };
};

export default connect(mapStateToProps)(StartPageRedirect);
