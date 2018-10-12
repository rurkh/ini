import React, { Fragment, PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { Route, Switch, withRouter } from 'react-router-dom';
import { Column } from 'primereact/components/column/Column';
import _compact from 'lodash/compact';

import LinkButton from 'components/common/LinkButton';
import DataTable from 'components/data/DataTable';
import {
  CreateReclamationDialog,
  EditReclamationDialog,
} from './ReclamationsFormDialogs';
import EntityActions from 'components/common/EntityActions';

import {
  fetchReclamations,
  deleteReclamation,
  makeGetReclamationsList,
  isReclamationsLoading,
  getReclamationsError,
} from 'modules/reclamation/reclamation';

class ReclamationsTable extends PureComponent {
  static propTypes = {
    reclamations: PropTypes.array,
    trans: PropTypes.func.isRequired,
    fetchReclamations: PropTypes.func.isRequired,
    deleteReclamation: PropTypes.func.isRequired,
    districtId: PropTypes.string,
  };

  state = {
    modalVisible: false,
  };

  componentDidMount() {
    const { fetchReclamations, districtId, reclamations } = this.props;
    !reclamations.length && fetchReclamations(districtId);
  }

  componentWillReceiveProps(nextProps) {
    const { fetchReclamations, districtId } = this.props;
    if (!nextProps.reclamations.length && nextProps.districtId !== districtId) {
      fetchReclamations(nextProps.districtId);
    }
  }

  handleClickTrash = ({ id = {} }) => {
    this.props.deleteReclamation(id);
  };

  renderLocationLabel = ({ street, postal_code, city, lat, lng }) =>
    _compact([street, postal_code, city]).join(', ') ||
    _compact([lat, lng]).join(', ');

  renderEditLabel = reclamation => {
    const { districtId } = this.props;
    return (
      <EntityActions
        iconType="link"
        entityName="reclamation"
        entity={reclamation}
        editUrl={`/districts/${districtId}/reclamation/${reclamation.id}/edit`}
        onDelete={this.handleClickTrash}
      />
    );
  };

  renderHeader() {
    const { districtId, trans, match: { path } } = this.props;
      const baseUrl = path.split("/").slice(0,2).join('/');
    return (
      <div className="row no-gutters align-items-center mb-15">
        <div className="col-auto">
          <div className="item--label">
            <span>
              {trans('reclamations.header.reclamations_of_customers')}
            </span>
          </div>
        </div>
        <div className="col-auto">
          <LinkButton
            icon="ui-icon-add"
            className="cyan-btn btn-sm panel-title-btn"
            to={`${baseUrl}/${districtId}/reclamation/create`}
          />
        </div>
      </div>
    );
  }

  render() {
    const { reclamations, trans, isLoading, match: { path } } = this.props;
      const baseUrl = path.split("/").slice(0,2).join('/');
    return (
      <Fragment>
        {this.renderHeader()}
        <Switch>
          <Route
            path={`${baseUrl}/:district/reclamation/create`}
            component={CreateReclamationDialog}
          />
          {reclamations.length && (
            <Route
              path={`${baseUrl}/:district/reclamation/:reclamation/edit`}
              render={props => (
                <EditReclamationDialog
                  reclamation={reclamations.find(
                    item => `${item.id}` === props.match.params.reclamation
                  )}
                  {...props}
                />
              )}
            />
          )}
        </Switch>
        <DataTable
          loading={isLoading && !reclamations.length}
          value={reclamations}
          rows={reclamations.length}
        >
          <Column field="text" header={trans('reclamations.column.text')} />
          <Column
            field="contact_person"
            header={trans('reclamations.column.contact_person')}
          />
          <Column
            header={trans('reclamations.column.location')}
            body={this.renderLocationLabel}
          />
          <Column
            field="reclamation_date"
            header={trans('reclamations.column.date')}
          />
          <Column
            header={trans('reclamations.column.action')}
            className="td-centered td-action"
            body={this.renderEditLabel}
          />
        </DataTable>
      </Fragment>
    );
  }
}

const makeMapStateToProps = () => {
  const getReclamationsList = makeGetReclamationsList();
  return (state, props) => ({
    reclamations: getReclamationsList(state, props),
    isLoading: isReclamationsLoading(state),
    error: getReclamationsError(state),
  });
};

const enhancer = compose(
  withRouter,
  connect(makeMapStateToProps, {
    fetchReclamations,
    deleteReclamation,
  })
);

export default enhancer(ReclamationsTable);
