import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Route, Switch } from 'react-router-dom';

import DistrictDepositionLocationDialog from './DistrictDepositionLocationDialog';
import DistrictShapeDialog from 'containers/districts/DistrictShapeDialog';
import DistrictRoutesDialog from 'containers/districts/DistrictRoutesDialog';
import { CreateAssignmentDialog } from './DistrictsAssignmentDialog';
import DistrictDetails from 'components/districts/DistrictDetails';

const DistrictDetailsWithRoutes = props => {
  const { baseUrl, district } = props;

  return (
    <Fragment>
      <DistrictDetails {...props} />
      <Switch>
        <Route
          path={`${baseUrl}/:district/location`}
          render={props => (
            <DistrictDepositionLocationDialog
              deposition={district.deposition}
              {...props}
            />
          )}
        />
        <Route
          path={`${baseUrl}/:district/shape`}
          component={DistrictShapeDialog}
        />
        <Route
          path={`${baseUrl}/:district/assign`}
          component={CreateAssignmentDialog}
        />
        <Route
          path={`${baseUrl}/:district/routes/:kind`}
          component={DistrictRoutesDialog}
        />
      </Switch>
    </Fragment>
  );
};

DistrictDetailsWithRoutes.propTypes = {
  baseUrl: PropTypes.string,
  district: PropTypes.shape({
    deposition: PropTypes.object.isRequired,
  }).isRequired,
};

DistrictDetailsWithRoutes.defaultProps = {
  baseUrl: '/districts',
};

export default DistrictDetailsWithRoutes;
