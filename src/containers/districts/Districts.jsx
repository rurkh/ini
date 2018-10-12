import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose, lifecycle } from 'recompose';
import { FormattedMessage } from 'react-intl';

import DistrictAssignedDelivererTable from 'containers/districts/DistrictAssignedDelivererTable';
import ReclamationsTable from 'containers/reclamations/ReclamationsTable';
import DeliveryCharacteristicsTable from 'containers/districts/DeliveryCharacteristicsTable';
import DistrictDetailsWithRoutes from './DistrictDetailsWithRoutes';
import {
  fetchDistricts,
  getDistrictsList,
  isDistrictsLoading,
  getDistrictsError,
  deleteDistrict,
} from 'modules/districts/districts';
import withTrans from 'components/hoc/withTrans';
import DistrictTable from 'components/districts/DistrictTable';
import {
  CreateDistrictDialog,
  EditDistrictDialog,
} from './DistrictFormDialogs';
import CreateButton from 'components/button/CreateButton';
import ExportButton from 'components/button/ExportButton';
import PageTitle from 'components/common/PageTitle';
import Panel from 'components/common/Panel';
import EntityListing from 'components/entity/EntityListing';
import EntityDetailsPanel from 'components/entity/EntityDetailsPanel';

const entityListingProps = {
  entitiesProp: 'districts',
  entityName: 'district',
  entityKey: 'id',
  editComponent: EditDistrictDialog,
  createComponent: CreateDistrictDialog,
};

const DistrictListing = compose(
  connect(
    state => ({
      isLoading: isDistrictsLoading(state),
      districts: getDistrictsList(state),
      error: getDistrictsError(state),
    }),
    { fetchDistricts }
  ),
  lifecycle({
    componentDidMount() {
      this.props.fetchDistricts();
    },
  })
)(EntityListing);

const DistrictDetailsPanel = connect(null, { onDelete: deleteDistrict })(
  EntityDetailsPanel
);

class Districts extends Component {
  static contextTypes = {
    canCreate: PropTypes.func.isRequired,
  };

  onTableMount = table => {
    this.table = table;
  };

  export = () => {
    this.table.exportCSV();
  };

  renderTableActions() {
    const { canCreate } = this.context;

    return (
      <Fragment>
        {!!canCreate('district') && <CreateButton to="/districts/create" />}
        <ExportButton onClick={this.export} />
      </Fragment>
    );
  }

  renderContent = ({ selection, ...props }) => (
    <Fragment>
      <div className="col-12 col-lg-5 mb-20 mb-lg-0">
        <Panel actions={this.renderTableActions()}>
          <DistrictTable
            {...props}
            selectedDistrict={selection}
            onTableMount={this.onTableMount}
          />
        </Panel>
      </div>
      <div className="col-12 col-lg-7 district-details">
        <DistrictDetailsPanel {...props} entity={selection}>
          <DistrictDetailsWithRoutes {...props} district={selection} />
          <DistrictAssignedDelivererTable
            trans={props.trans}
            districtId={selection.id}
          />
          <DeliveryCharacteristicsTable
            trans={props.trans}
            districtId={selection.id}
          />
          <ReclamationsTable trans={props.trans} districtId={selection.id} />
        </DistrictDetailsPanel>
      </div>
    </Fragment>
  );

  render() {
    return (
      <div className="row">
        <div className="col-12">
          <PageTitle icon="map">
            <FormattedMessage
              id="districts.page_title"
              defaultMessage="Districts Management"
            />
          </PageTitle>
        </div>

        <DistrictListing {...this.props} {...entityListingProps}>
          {this.renderContent}
        </DistrictListing>
      </div>
    );
  }
}

export default withTrans(Districts);
