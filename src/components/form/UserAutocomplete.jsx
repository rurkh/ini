import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import _trim from 'lodash/trim';

import AutoComplete from 'components/form/AutoComplete';
import withTrans from 'components/hoc/withTrans';
import { makeGetUsersByRoleNameProp } from 'modules/users/users';

class UserAutocomplete extends PureComponent {
  static propTypes = {
    users: PropTypes.arrayOf(PropTypes.object),
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
  };

  state = { suggestions: [] };

  suggestUsers = ({ query }) => {
    const suggestions = this.props.users.filter(user => {
      // filter any user in which any field starts with given query.
      return ['firstname', 'lastname', 'username'].reduce(
        (filter, prop) =>
          filter ||
          (!!user[prop] &&
            user[prop].toLowerCase().startsWith(query.toLowerCase())),
        false
      );
    });
    this.setState({ suggestions });
  };

  getValue() {
    const { users, value } = this.props;

    if (!value) {
      return value;
    }

    // Single-value case.
    if (typeof value === 'string') {
      return users.find(u => u.username === value) || value;
    }

    // Multi-value case.
    if (Array.isArray(value)) {
      return value.map(
        v => (typeof v === 'string' ? users.find(u => u.username === v) : v)
      );
    }

    return value;
  }

  itemTemplate = item => {
    // needed for cases when given value doesn't exist in users collection.
    if (!item) {
      return item;
    }
    const { username, firstname, lastname } = item;
    const fullName = _trim(`${firstname || ''} ${lastname || ''}`);
    return !!fullName ? `${username}: ${fullName}` : username;
  };

  selectedItemTemplate = item => {
    // needed for cases when given value doesn't exist in users collection.
    if (!item) {
      return item;
    }
    const { username, firstname, lastname } = item;
    const fullName = _trim(`${firstname || ''} ${lastname || ''}`);
    return fullName || username;
  };

  render() {
    const { users, value, trans, ...props } = this.props;
    const { suggestions } = this.state;
    const fieldValue = this.getValue();

    return (
      <AutoComplete
        placeholder={trans(
          'app.fields.user_autocomplete.placeholder',
          'Start typing the name'
        )}
        suggestions={suggestions}
        completeMethod={this.suggestUsers}
        itemTemplate={this.itemTemplate}
        selectedItemTemplate={this.selectedItemTemplate}
        value={fieldValue}
        {...props}
      />
    );
  }
}

const makeMapStateToProps = () => {
  const getUsersByRole = makeGetUsersByRoleNameProp();
  return (state, props) => ({ users: getUsersByRole(state, props) });
};
export default withTrans(connect(makeMapStateToProps)(UserAutocomplete));
