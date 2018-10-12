import React, { Fragment, PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Column } from 'primereact/components/column/Column';

import DataTable from 'components/data/DataTable';
import SearchFilter from 'components/filters/SearchFilter';
import DistrictsFilter from 'components/filters/DistrictsFilter';
import TagsFilter from 'components/filters/TagsFilter';
import RolesFilter from 'components/filters/RolesFilter';
import {
  filterArrayOfValues,
  filterByDistricts,
} from 'utils/filterConstraints';

const availableFilters = ['roles', 'tags', 'districts'];

class UsersTable extends PureComponent {
  static propTypes = {
    users: PropTypes.array,
    selectedUser: PropTypes.object,
    isLoading: PropTypes.bool.isRequired,
    trans: PropTypes.func.isRequired,
    onRowSelect: PropTypes.func.isRequired,
    onTableMount: PropTypes.func,
    visibleFilters: PropTypes.arrayOf(PropTypes.oneOf(availableFilters)),
  };

  static defaultProps = {
    visibleFilters: availableFilters,
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
    const { visibleFilters } = this.props;

    return (
      <div className="users-filter pb-15">
        <div className="row flex-nowrap">
          <div className="col">
            <SearchFilter
              value={globalFilter}
              onChange={this.onGlobalFilterChange}
              name="globalFilter"
            />
          </div>
          {visibleFilters.includes('roles') && (
            <div className="col">
              <RolesFilter
                value={filters.user_roles ? filters.user_roles.value : null}
                name="user_roles"
                onChange={this.onFilterChanage}
              />
            </div>
          )}
          {visibleFilters.includes('tags') && (
            <div className="col">
              <TagsFilter
                value={filters.tags ? filters.tags.value : null}
                onChange={this.onFilterChanage}
              />
            </div>
          )}
          {visibleFilters.includes('districts') && (
            <div className="col">
              <DistrictsFilter
                value={filters.districts ? filters.districts.value : null}
                onChange={this.onFilterChanage}
              />
            </div>
          )}
        </div>
      </div>
    );
  }

  renderRoleColumn = (rowData, column) => {
    const { trans } = this.props;

    return (rowData.user_roles || [])
      .map(role => trans(`users.roles.${role}`))
      .join(', ');
  };

  renderDistrictsColumn = (rowData, column) => {
    return (rowData.districts || []).map(district => district.name).join(', ');
  };

  renderTagsColumn = (rowData, column) => {
    return (rowData.tags || []).join(', ');
  };

  render() {
    const {
      isLoading,
      users,
      onRowSelect,
      selectedUser,
      onTableMount,
      trans,
    } = this.props;

    return (
      <Fragment>
        {this.renderFilters()}
        <div className="users-table">
          <DataTable
            ref={onTableMount}
            loading={isLoading && !users.length}
            value={users}
            selectionMode="single"
            selection={selectedUser}
            onSelectionChange={onRowSelect}
            rows={users.length}
            virtualScroll
            scrollable
            scrollHeight="auto"
            globalFilter={this.state.globalFilter}
            filters={this.state.filters}
          >
            <Column
              field="username"
              header={trans('users.column.username')}
              sortable
            />
            <Column
              field="firstname"
              header={trans('users.column.firstname')}
              sortable
            />
            <Column
              field="lastname"
              header={trans('users.column.lastname')}
              sortable
            />
            <Column
              field="user_roles"
              header={trans('users.column.roles')}
              body={this.renderRoleColumn}
              sortable
              filterMatchMode="custom"
              filterFunction={filterArrayOfValues}
            />
            <Column
              field="districts"
              header={trans('users.column.districts')}
              body={this.renderDistrictsColumn}
              filterMatchMode="custom"
              filterFunction={filterByDistricts}
            />
            <Column
              field="tags"
              header={trans('users.column.tags')}
              body={this.renderTagsColumn}
              filterMatchMode="custom"
              filterFunction={filterArrayOfValues}
            />
          </DataTable>
        </div>
      </Fragment>
    );
  }
}

export default UsersTable;
