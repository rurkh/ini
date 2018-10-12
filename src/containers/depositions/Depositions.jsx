import React, { Fragment, Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose, lifecycle } from 'recompose';
import { FormattedMessage } from 'react-intl';

import {
  fetchDepositions,
  getDepositionsList,
  isDepositionsLoading,
  getDepositionsError,
  deleteDeposition,
} from 'modules/depositions/depositions';
import DepositionTable from 'components/depositions/DepositionTable';
import {
  CreateDepositionDialog,
  EditDepositionDialog,
} from './DepositionDialogs';
import withTrans from 'components/hoc/withTrans';
import DepositionDetails from 'components/depositions/DepositionDetails';
import DepositionDistrictTable from 'components/depositions/DepositionDistrictTable';
import CreateButton from 'components/button/CreateButton';
import ExportButton from 'components/button/ExportButton';
import PageTitle from 'components/common/PageTitle';
import Panel from 'components/common/Panel';
import EntityListing from 'components/entity/EntityListing';
import EntityDetailsPanel from 'components/entity/EntityDetailsPanel';

const entityListingProps = {
  entitiesProp: 'depositions',
  entityName: 'deposition',
  entityKey: 'id',
  editComponent: EditDepositionDialog,
  createComponent: CreateDepositionDialog,
};

const DepositionsListing = compose(
  connect(
    state => ({
      isLoading: isDepositionsLoading(state),
      depositions: getDepositionsList(state),
      error: getDepositionsError(state),
    }),
    { fetchDepositions }
  ),
  lifecycle({
    componentDidMount() {
      this.props.fetchDepositions();
    },
  })
)(EntityListing);

const DepositionDetailsPanel = connect(null, { onDelete: deleteDeposition })(
  EntityDetailsPanel
);

class Depositions extends Component {
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
        {!!canCreate('deposition') && <CreateButton to="/depositions/create" />}
        <ExportButton onClick={this.export} />
      </Fragment>
    );
  }

  renderContent = ({ selection, ...props }) => (
    <Fragment>
      <div className="col-12 col-lg-5 mb-20 mb-lg-0">
        <Panel actions={this.renderTableActions()}>
          <DepositionTable
            {...props}
            selectedDeposition={selection}
            onTableMount={this.onTableMount}
          />
        </Panel>
      </div>
      <div className="col-12 col-lg-7 deposition-details">
        <DepositionDetailsPanel {...props} entity={selection}>
          <DepositionDetails {...props} deposition={selection} />
          <div className="deposition-districts">
            <div className="item--label mb-15">
              <FormattedMessage
                id="deposition.assigned_districts.header"
                defaultMessage="Assigned Districts"
              />
            </div>
            <DepositionDistrictTable
              districts={selection.districts}
              trans={this.props.trans}
            />
          </div>
        </DepositionDetailsPanel>
      </div>
    </Fragment>
  );

  render() {
    return (
      <div className="row">
        <div className="col-12">
          <PageTitle icon="location_searching">
            <FormattedMessage
              id="depositions.page_title"
              defaultMessage="Depositions Management"
            />
          </PageTitle>
        </div>

        <DepositionsListing {...this.props} {...entityListingProps}>
          {this.renderContent}
        </DepositionsListing>
      </div>
    );
  }
}

export default withTrans(Depositions);
