import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { compose, lifecycle } from 'recompose';

import Panel from 'components/common/Panel';
import withTrans from 'components/hoc/withTrans';
<<<<<<< Updated upstream
import DistrictDetails from '../districts/DistrictDetailsWithRoutes';
import { fetchDistricts, getDistrictsList } from 'modules/districts/districts';
import { getUserDefaultDistrict } from 'modules/user';
import DistrictsFilter from 'components/filters/DistrictsFilter';

=======
import DistrictDetails from 'components/districts/DistrictDetails';
import DistrictRoutesDialog from 'containers/districts/DistrictRoutesDialog';
import DistrictShapeDialog from 'containers/districts/DistrictShapeDialog';
import DistrictDepositionLocationDialog from 'containers/districts/DistrictDepositionLocationDialog';
import ReclamationsTable from 'containers/reclamations/ReclamationsTable';
import DeliveryCharacteristicsTable from 'containers/districts/DeliveryCharacteristicsTable';
import {
  fetchDistricts,
  makeGetDistictById,
} from 'modules/districts/districts';
import { getUserSettings } from 'modules/user';
import DistrictsFilter from 'components/filters/DistrictsFilter';

const ConnectedDetails = compose(
  withTrans,
  withRouter,
  connect((state, { districtId }) => {
    const districtById = makeGetDistictById(districtId);
    return {
      district: districtById(state),
    };
  }, {})
)(props => (
  <Fragment>
    <DistrictDetails {...props} />
    <Switch>
      <Route
        path="/my-data/:district/location"
        render={() => {
          return (
            <DistrictDepositionLocationDialog
              deposition={props.district.deposition}
            />
          );
        }}
      />
      <Route path="/my-data/:district/shape" component={DistrictShapeDialog} />
      <Route
        path="/my-data/:district/routes/:kind"
        component={DistrictRoutesDialog}
      />
    </Switch>
      <DeliveryCharacteristicsTable
          trans={props.trans}
          districtId={props.district.id}
      />
      <ReclamationsTable trans={props.trans} districtId={props.district.id} />
  </Fragment>
));

>>>>>>> Stashed changes
class MyDistricts extends PureComponent {
  static propTypes = {
    districts: PropTypes.array.isRequired,
  };

  state = {
    selectedDistrict: null,
  };

  onDistrictSelect = e => {
    this.setState({
      selectedDistrict: e.target.value,
    });
  };

  getSelectedDistrictId() {
    const { defaultDistrict, districts } = this.props;
    return (
      this.state.selectedDistrict ||
      defaultDistrict ||
      (!!districts.length && districts[0].id)
    );
  }

  renderMyDistrictActions = () => {
    return (
      <DistrictsFilter
        multiSelect={false}
        onChange={this.onDistrictSelect}
        value={this.getSelectedDistrictId()}
      />
    );
  };

  renderContent = () => {
    const { trans } = this.props;
    const districtId = this.getSelectedDistrictId();
    const district = this.props.districts.find(
      d => `${d.id}` === `${districtId}`
    );

    if (!districtId) {
      return <p>{trans('my_districts.no_district_selected')}</p>;
    }
    return (
      <DistrictDetails district={district} baseUrl="/my-data" trans={trans} />
    );
  };

  render() {
    const { trans } = this.props;
    return (
      <div className="col-12 col-lg-7 my-data-details">
        <Panel
          title={trans('my_districts.header', 'My Districts')}
          actions={this.renderMyDistrictActions()}
        >
          {this.renderContent()}
        </Panel>
      </div>
    );
  }
}

export default compose(
  withTrans,
  withRouter,
  connect(
    state => ({
      districts: getDistrictsList(state),
      defaultDistrict: getUserDefaultDistrict(state),
    }),
    { fetchDistricts }
  ),
  lifecycle({
    componentDidMount() {
      this.props.fetchDistricts();
    },
  })
)(MyDistricts);
