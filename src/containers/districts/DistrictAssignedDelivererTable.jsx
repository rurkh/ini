import React, { Fragment, Component } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Column } from 'primereact/components/column/Column';
import { Calendar } from 'primereact/components/calendar/Calendar';
import { connect } from 'react-redux';
import format from 'date-fns/format';
import classNames from 'classnames';
import isBefore from 'date-fns/is_before';

import DataTable from 'components/data/DataTable';
import LinkButton from 'components/common/LinkButton';
import EntityActions from 'components/common/EntityActions';
import {
  fetchDeliverers,
  makeGetDeliverersList,
  isDeliverersLoading,
  getDeliverersError,
  updateDelivererTime,
  deleteAssignment,
} from 'modules/deliverers/deliverers';

class DistrictAssignedDelivererTable extends Component {
  static propTypes = {
    districts: PropTypes.array,
    isLoading: PropTypes.bool.isRequired,
    trans: PropTypes.func.isRequired,
  };

  state = {
    toDeleteUser: {},
  };

  componentDidMount() {
    const { fetchDeliverers, districtId, deliverers } = this.props;
    !deliverers.length && fetchDeliverers(districtId);
  }

  componentWillReceiveProps(nextProps) {
    const { fetchDeliverers, districtId } = this.props;
    if (!nextProps.deliverers.length && nextProps.districtId !== districtId) {
      fetchDeliverers(nextProps.districtId);
    }
  }

  deleteAssignment = ({ id }) => {
    this.props.deleteAssignment(id);
  };

  renderActiveLabel = rowData => {
    const { active } = rowData;

    const spanClass = classNames('status', {
      'status-active': active,
      'status-inactive': !active,
    });
    return <span className={spanClass} />;
  };

  renderActions = rowData => {
    return (
      <EntityActions
        iconType="link"
        entity={rowData}
        entityName="assignment"
        onDelete={this.deleteAssignment}
      />
    );
  };

  updateTime = (fieldProps, e) => {
    const { field, rowData: { id, start_date, end_date } } = fieldProps;
    const startDate = field === 'start_date' ? e.value : start_date;
    const endDate = field === 'end_date' ? e.value : end_date;
    if (endDate && isBefore(endDate, startDate)) {
      return false;
    }

    this.props.updateDelivererTime(id, {
      start_date: startDate ? format(startDate, 'YYYY-MM-DD') : null,
      end_date: endDate ? format(endDate, 'YYYY-MM-DD') : null,
    });
  };

  renderDate = props => {
    const { rowData, rowData: { can_edit } } = props;
    if (!can_edit) {
      return this.dateTemplate(rowData, props);
    }
    return (
      <Calendar
        dateFormat="dd.mm.yy"
        className="district-calendar"
        readOnlyInput
        value={props.rowData[props.field]}
        onChange={this.updateTime.bind(null, props)}
        showButtonBar={props.field !== 'start_date'}
      />
    );
  };

  dateTemplate = (rowData, column) => {
    const value = rowData[column.field];
    return value ? (
      format(value, 'DD.MM.YYYY')
    ) : (
      <span className="no-value">—</span>
    );
  };

  renderTagsColumn = (rowData, column) => {
    return (rowData.tags || []).join(', ');
  };

  render() {
    const { isLoading, deliverers, trans, districtId } = this.props;
    return (
      <Fragment>
        <div className="row no-gutters align-items-center mb-15">
          <div className="col-auto">
            <div className="item--label">
              <FormattedMessage
                id="district.assigned_deliverer.header"
                defaultMessage="Assigned Deliverer for this Districts"
              />
            </div>
          </div>
          <div className="col-auto">
            <LinkButton
              icon="ui-icon-add"
              className="cyan-btn btn-sm panel-title-btn"
              to={`/districts/${districtId}/assign`}
            />
          </div>
        </div>
        <DataTable
          loading={isLoading && !deliverers.length}
          value={deliverers}
          rows={deliverers.length}
          editable
        >
          <Column
            field="username"
            header={trans('deliverers.column.username')}
            sortable
          />
          <Column
            field="lastname"
            header={trans('deliverers.column.lastname')}
            sortable
          />
          <Column
            field="firstname"
            header={trans('deliverers.column.firstname')}
            sortable
          />
          <Column
            field="tag"
            header={trans('deliverers.column.tag')}
            body={this.renderTagsColumn}
            sortable
          />
          <Column
            field="start_date"
            header={trans('deliverers.column.start_date')}
            editor={this.renderDate}
            body={this.dateTemplate}
            className="td-date"
            sortable
          />
          <Column
            field="end_date"
            header={trans('deliverers.column.end_date')}
            editor={this.renderDate}
            body={this.dateTemplate}
            className="td-date"
            sortable
          />
          <Column
            header={trans('deliverers.column.active')}
            field="active"
            body={this.renderActiveLabel}
            className="td-centered td-active"
            sortable
          />
          <Column
            header={trans('deliverers.column.action')}
            body={this.renderActions}
            className="td-centered td-action"
          />
        </DataTable>
      </Fragment>
    );
  }
}

const mapStateToProps = (state, props) => {
  const getDeliverersList = makeGetDeliverersList();
  return {
    isLoading: isDeliverersLoading(state),
    deliverers: getDeliverersList(state, props),
    error: getDeliverersError(state),
  };
};

export default connect(mapStateToProps, {
  fetchDeliverers,
  updateDelivererTime,
  deleteAssignment,
})(DistrictAssignedDelivererTable);
