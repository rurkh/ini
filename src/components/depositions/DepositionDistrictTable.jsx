import React, { Fragment, PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Column } from 'primereact/components/column/Column';

import DataTable from 'components/data/DataTable';

class DepositionDistrictTable extends PureComponent {
  static propTypes = {
    districts: PropTypes.arrayOf(PropTypes.any),
    trans: PropTypes.func.isRequired,
  };

  static defaultProps = {
    districts: [],
  };

  renderTime = ({ nominal_delivery_time: value }) => {
    if (!value) {
      return '';
    }
    return (
      <Fragment>
        {value}
        <span className="suffix">
          {this.props.trans('districts.target_time.suffix', 'min')}
        </span>
      </Fragment>
    );
  };

  renderDistance = ({ distance }) => {
    if (!distance) {
      return '';
    }
    return (
      <Fragment>
        {distance}
        <span className="suffix">
          {this.props.trans('districts.distance.suffix', 'km')}
        </span>
      </Fragment>
    );
  };

  renderNameLabel = deposition => (
    <Link to={`/districts/${deposition.id}`}>{deposition.name}</Link>
  );

  render() {
    const { districts, trans } = this.props;
    return (
      <DataTable value={districts} rows={districts.length}>
        <Column
          field="id"
          header={trans('depositions.districts.column.id')}
          sortable
        />
        <Column
          field="name"
          header={trans('depositions.districts.column.name')}
          body={this.renderNameLabel}
          sortable
        />
        <Column
          field="nominal_delivery_time"
          header={trans('depositions.districts.time')}
          body={this.renderTime}
          sortable
        />
        <Column
          field="distance"
          header={trans('depositions.districts.column.distance')}
          body={this.renderDistance}
          sortable
        />
      </DataTable>
    );
  }
}

export default DepositionDistrictTable;
