import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';
import { Column } from 'primereact/components/column/Column';

import DataTable from 'components/data/DataTable';
import { filterByDistricts } from 'utils/filterConstraints';
import SearchFilter from 'components/filters/SearchFilter';
import DistrictsFilter from 'components/filters/DistrictsFilter';

class DepositionTable extends PureComponent {
  static propTypes = {
    depositions: PropTypes.array,
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

  renderDistrictsColumn = (rowData, column) => {
    return (rowData.districts || []).map(district => district.name).join(', ');
  };

  renderFilters() {
    const { globalFilter, filters } = this.state;

    return (
      <div className="depositions-filter pb-15">
        <div className="row">
          <div className="col-6">
            <SearchFilter
              value={globalFilter}
              onChange={this.onGlobalFilterChange}
              name="globalFilter"
            />
          </div>
          <div className="col-6">
            <DistrictsFilter
              value={filters.districts ? filters.districts.value : null}
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
      depositions,
      onRowSelect,
      onTableMount,
      selectedDeposition,
      trans,
    } = this.props;

    return (
      <Fragment>
        {this.renderFilters()}
        <div className="depositions-table">
          <DataTable
            ref={onTableMount}
            loading={isLoading && !depositions.length}
            value={depositions}
            selectionMode="single"
            selection={selectedDeposition}
            onSelectionChange={onRowSelect}
            rows={depositions.length}
            virtualScroll
            scrollable
            scrollHeight="auto"
            globalFilter={this.state.globalFilter}
            filters={this.state.filters}
          >
            <Column
              field="id"
              header={trans('depositions.column.id')}
              sortable
            />
            <Column
              field="name"
              header={trans('depositions.column.name')}
              sortable
            />
            <Column
              field="perimeter"
              header={trans('depositions.column.perimeter')}
              sortable
            />
            <Column
              field="districts"
              header={trans('depositions.column.districts')}
              body={this.renderDistrictsColumn}
              filterMatchMode="custom"
              filterFunction={filterByDistricts}
            />
          </DataTable>
        </div>
      </Fragment>
    );
  }
}

export default DepositionTable;
