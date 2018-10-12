import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { injectIntl } from 'react-intl';

import { getRolesOptions } from 'modules/core/enum';
import trans from 'utils/transMsg';
import MultiSelect from 'components/form/MultiSelect';

class RolesFilter extends PureComponent {
  onChange = e => {
    const { name = 'roles', onChange } = this.props;
    const value = e.value;
    typeof onChange === 'function' && onChange({ target: { name, value } });
  };

  render() {
    const { roles, intl: { formatMessage }, onChange, ...props } = this.props;

    return (
      <MultiSelect
        options={roles}
        name="roles"
        defaultLabel={formatMessage(trans('app.filters.placeholder.roles'))}
        onChange={this.onChange}
        {...props}
      />
    );
  }
}

const enhance = compose(
  injectIntl,
  connect((state, { intl: { formatMessage } }) => ({
    roles: getRolesOptions(state).map(({ value, label }) => ({
      value,
      label: formatMessage(trans(`app.roles.${value}`)),
    })),
  }))
);

export default enhance(RolesFilter);
