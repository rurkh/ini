import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import { Column } from 'primereact/components/column/Column';
import { Checkbox } from 'primereact/components/checkbox/Checkbox';
import { Route, Switch, withRouter } from 'react-router-dom';
import { Link } from 'react-router-dom';
import _compact from 'lodash/compact';

import LinkButton from 'components/common/LinkButton';
import DataTable from 'components/data/DataTable';
import CharacteristicsDetailsDialog from 'containers/districts/CharacteristicsDetailsDialog';
import {
  CreateCharacteristicDialog,
  EditCharacteristicDialog,
} from './CharacteristicsFormDialogs';
import EntityActions from 'components/common/EntityActions';

import {
  fetchCharacteristics,
  updateCharacteristics,
  deleteCharacteristics,
  makeGetCharacteristicsList,
  isCharacteristicsLoading,
  getCharacteristicsError,
} from 'modules/delivery_characteristics/delivery_characteristics';

class DeliveryCharacteristicsTable extends PureComponent {
  static propTypes = {
    characteristics: PropTypes.array,
    trans: PropTypes.func.isRequired,
    fetchCharacteristics: PropTypes.func.isRequired,
    updateCharacteristics: PropTypes.func.isRequired,
    deleteCharacteristics: PropTypes.func.isRequired,
    districtId: PropTypes.string,
  };

  state = {
    modalVisible: false,
    id: null,
  };

  componentDidMount() {
    const { fetchCharacteristics, districtId, characteristics } = this.props;
    !characteristics.length && fetchCharacteristics(districtId);
  }

  componentWillReceiveProps(nextProps) {
    const { fetchCharacteristics, districtId } = this.props;
    if (
      !nextProps.characteristics.length &&
      nextProps.districtId !== districtId
    ) {
      fetchCharacteristics(nextProps.districtId);
    }
  }

  handleClickTrash = ({ id = {} }) => {
    this.props.deleteCharacteristics(id);
  };

  handleClickActive = ({ value, checked }) => {
    const { updateCharacteristics, match: { path } } = this.props;

    updateCharacteristics(value, { active: checked });
  };

  renderHintLabel = characteristic => {
    const { match: { path } } = this.props;
      const baseUrl = path.split("/").slice(0,2).join('/');
     return <Link
          to={`${baseUrl}/${characteristic.district_id}/characteristics/${
              characteristic.id
              }`}
      >
          {characteristic.hint}
      </Link>
  };

  renderLocationLabel = ({ street, postal_code, city }) =>
    _compact([street, postal_code, city]).join(', ');

  renderActiveCheckbox = characteristic => (
    <Checkbox
      value={characteristic.id}
      checked={characteristic.active}
      onChange={this.handleClickActive}
    />
  );

  renderEditLabel = characteristic => {
    const { districtId, match: { path } } = this.props;
      const baseUrl = path.split("/").slice(0,2).join('/');
    return (
      <EntityActions
        iconType="link"
        entityName="characteristic"
        entity={characteristic}
        editUrl={`${baseUrl}/${districtId}/characteristics/${
          characteristic.id
        }/edit`}
        onDelete={this.handleClickTrash}
      />
    );
  };

  renderHeader() {
    const { districtId, trans,  match: { path } } = this.props;
    const baseUrl = path.split("/").slice(0,2).join('/');
    return (
      <div className="row no-gutters align-items-center mb-15">
        <div className="col-auto">
          <div className="item--label">
            <span>
              {trans('characteristics.header.delivery_characteristics')}
            </span>
          </div>
        </div>
        <div className="col-auto">
          <LinkButton
            icon="ui-icon-add"
            className="cyan-btn btn-sm panel-title-btn"
            to={`${baseUrl}/${districtId}/characteristics/create`}
          />
        </div>
      </div>
    );
  }

  render() {
    const { characteristics, trans, isLoading,  match: { path } } = this.props;
      const baseUrl = path.split("/").slice(0,2).join('/');
    return (
      <Fragment>
        {this.renderHeader()}
        <Switch>
          <Route
            path={`${baseUrl}/:district/characteristics/create`}
            component={CreateCharacteristicDialog}
          />
          {characteristics.length && (
            <Fragment>
              <Route
                path={`${baseUrl}/:district/characteristics/:characteristic/edit`}
                render={props => (
                  <EditCharacteristicDialog
                    characteristic={characteristics.find(
                      item => `${item.id}` === props.match.params.characteristic
                    )}
                    {...props}
                  />
                )}
              />
              <Route
                exact
                path={`${baseUrl}/:district/characteristics/:characteristic`}
                render={props => (
                  <CharacteristicsDetailsDialog
                    characteristic={characteristics.find(
                      item => `${item.id}` === props.match.params.characteristic
                    )}
                    {...props}
                  />
                )}
              />
            </Fragment>
          )}
        </Switch>
        <DataTable
          loading={isLoading && !characteristics.length}
          value={characteristics}
          rows={characteristics.length}
        >
          <Column
            header={trans('characteristics.column.hint')}
            body={this.renderHintLabel}
          />
          <Column
            field="city"
            header={trans('characteristics.column.location')}
            body={this.renderLocationLabel}
            sortable
          />
          <Column
            header={trans('characteristics.column.active')}
            className="td-centered td-active"
            body={this.renderActiveCheckbox}
          />
          <Column
            header={trans('characteristics.column.action')}
            className="td-centered td-action"
            body={this.renderEditLabel}
          />
        </DataTable>
      </Fragment>
    );
  }
}

const makeMapStateToProps = () => {
  const getCharacteristicsList = makeGetCharacteristicsList();
  return (state, props) => ({
    characteristics: getCharacteristicsList(state, props),
    isLoading: isCharacteristicsLoading(state),
    error: getCharacteristicsError(state),
  });
};

const enhancer = compose(
  withRouter,
  connect(makeMapStateToProps, {
    updateCharacteristics,
    deleteCharacteristics,
    fetchCharacteristics,
  })
);

export default enhancer(DeliveryCharacteristicsTable);
