import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';
import { Column } from 'primereact/components/column/Column';

import DataTable from 'components/data/DataTable';
import SearchFilter from 'components/filters/SearchFilter';
import { filterArrayOfValues } from 'utils/filterConstraints';
import MeansOfTransportationFilter from 'components/filters/MeansOfTransportation';

class DistrictTable extends PureComponent {
  static propTypes = {
    districts: PropTypes.array,
    selectedDistrict: PropTypes.object,
    isLoading: PropTypes.bool.isRequired,
    trans: PropTypes.func.isRequired,
    onRowSelect: PropTypes.func.isRequired,
    onTableMount: PropTypes.func,
  };

  state = {
    globalFilter: '',
    filters: {},
  };

  onGlobalFilterChange = e => {
    this.setState({ globalFilter: e.target.value });
  };

  onFilterChanage = e => {
    this.setState(({ filters }) => {
      return {
        filters: { ...filters, [e.target.name]: { value: e.target.value } },
      };
    });
  };

  renderFilters() {
    const { globalFilter, filters } = this.state;

    return (
      <div className="districts-filter pb-15">
        <div className="row">
          <div className="col-6">
            <SearchFilter
              value={globalFilter}
              onChange={this.onGlobalFilterChange}
              name="globalFilter"
            />
          </div>
          <div className="col-6">
            <MeansOfTransportationFilter
              value={
                filters.means_of_transportation
                  ? filters.means_of_transportation.value
                  : null
              }
              onChange={this.onFilterChanage}
            />
          </div>
        </div>
      </div>
    );
  }

  render() {
    const {
      isLoading,
      districts,
      onRowSelect,
      onTableMount,
      selectedDistrict,
      trans,
    } = this.props;

    return (
      <Fragment>
        {this.renderFilters()}
        <div className="districts-table">
          <DataTable
            ref={onTableMount}
            loading={isLoading && !districts.length}
            value={districts}
            selectionMode="single"
            selection={selectedDistrict}
            onSelectionChange={onRowSelect}
            rows={districts.length}
            virtualScroll
            scrollable
            scrollHeight="auto"
            globalFilter={this.state.globalFilter}
            filters={this.state.filters}
          >
            <Column field="id" header={trans('districts.column.id')} sortable />
            <Column
              field="name"
              header={trans('districts.column.name')}
              sortable
            />
            <Column
              field="means_of_transportation"
              header={trans('districts.column.means_of_transportation')}
              filterMatchMode="custom"
              filterFunction={filterArrayOfValues}
            />
            <Column
              field="deposition.id"
              header={trans('districts.column.deposition')}
              sortable
            />
            <Column
              field="distance"
              header={trans('districts.column.distance')}
              sortable
            />
          </DataTable>
        </div>
      </Fragment>
    );
  }
}

export default DistrictTable;
