import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { Dropdown } from 'primereact/components/dropdown/Dropdown';

import { getDistrictsOptions } from 'modules/districts/districts';
import withTrans from 'components/hoc/withTrans';
import MultiSelect from 'components/form/MultiSelect';

class DistrictsFilter extends PureComponent {
  static propTypes = {
    multiSelect: PropTypes.bool,
    name: PropTypes.string,
  };

  static defaultProps = {
    multiSelect: true,
    name: 'districts',
  };

  onChange = e => {
    const { name, onChange } = this.props;
    const value = e.value;
    typeof onChange === 'function' && onChange({ target: { name, value } });
  };

  render() {
    const {
      districts,
      name,
      onChange,
      multiSelect,
      trans,
      ...props
    } = this.props;

    if (multiSelect) {
      return (
        <MultiSelect
          options={districts}
          name={name}
          filter
          defaultLabel={trans('app.filters.placeholder.districts')}
          onChange={this.onChange}
          {...props}
        />
      );
    }

    return (
      <Dropdown
        options={districts}
        name={name}
        editable
        filter
        placeholder={trans('app.fields.placeholder.district')}
        onChange={this.onChange}
        {...props}
      />
    );
  }
}

const enhance = compose(
  withTrans,
  connect(state => ({
    districts: getDistrictsOptions(state),
  }))
);

export default enhance(DistrictsFilter);
