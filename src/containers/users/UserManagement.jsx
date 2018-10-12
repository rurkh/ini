import React, { Fragment, Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose, lifecycle } from 'recompose';
import { FormattedMessage } from 'react-intl';

import {
  fetchUsers,
  deleteUser,
  getUsersList,
  isUsersLoading,
  getUsersError,
} from 'modules/users/users';
import CreateButton from 'components/button/CreateButton';
import ExportButton from 'components/button/ExportButton';
import PageTitle from 'components/common/PageTitle';
import Panel from 'components/common/Panel';
import UserDetails from 'components/users/UserDetails';
import UsersTable from 'components/users/UsersTable';
import { CreateUserDialog, EditUserDialog } from './UserFormDialogs';
import withTrans from 'components/hoc/withTrans';
import EntityListing from 'components/entity/EntityListing';
import EntityDetailsPanel from 'components/entity/EntityDetailsPanel';

const entityListingProps = {
  entitiesProp: 'users',
  entityName: 'user',
  entityKey: 'username',
  editComponent: EditUserDialog,
  createComponent: CreateUserDialog,
};

const UsersListing = compose(
  connect(
    state => ({
      isLoading: isUsersLoading(state),
      users: getUsersList(state),
      error: getUsersError(state),
    }),
    { fetchUsers }
  ),

  lifecycle({
    componentDidMount() {
      this.props.fetchUsers();
    },
  })
)(EntityListing);

const UserDetailsPanel = connect(null, { onDelete: deleteUser })(
  EntityDetailsPanel
);

class UserManagement extends Component {
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
        {!!canCreate('user') && (
          <CreateButton to="/users/create" icon="ui-icon-person-add" />
        )}
        <ExportButton onClick={this.export} />
      </Fragment>
    );
  }

  renderContent = ({ selection, ...props }) => (
    <Fragment>
      <div className="col-12 col-lg-8 mb-20 mb-lg-0">
        <Panel actions={this.renderTableActions()}>
          <UsersTable
            {...props}
            selectedUser={selection}
            onTableMount={this.onTableMount}
          />
        </Panel>
      </div>
      <div className="col-12 col-lg-4">
        <UserDetailsPanel {...props} entity={selection}>
          <UserDetails {...props} user={selection} />
        </UserDetailsPanel>
      </div>
    </Fragment>
  );

  render() {
    return (
      <div className="row">
        <div className="col-12">
          <PageTitle icon="people">
            <FormattedMessage
              id="users.page_title"
              defaultMessage="User Management"
            />
          </PageTitle>
        </div>

        <UsersListing {...this.props} {...entityListingProps}>
          {this.renderContent}
        </UsersListing>
      </div>
    );
  }
}

export default withTrans(UserManagement);
