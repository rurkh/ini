import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { injectIntl } from 'react-intl';
import { Dropdown } from 'primereact/components/dropdown/Dropdown';

import { getMeansOfTransportationOptions } from 'modules/core/enum';
import trans from 'utils/transMsg';
import MultiSelect from 'components/form/MultiSelect';

class MeansOfTransportationFilter extends PureComponent {
  static propTypes = {
    multiSelect: PropTypes.bool,
  };

  static defaultProps = {
    multiSelect: true,
  };

  onChange = e => {
    const { name = 'means_of_transportation', onChange } = this.props;
    const value = e.value;
    typeof onChange === 'function' && onChange({ target: { name, value } });
  };

  render() {
    const {
      multiSelect,
      meansOfTransportation,
      intl: { formatMessage },
      onChange,
      ...props
    } = this.props;

    if (multiSelect) {
      return (
        <MultiSelect
          options={meansOfTransportation}
          name="means_of_transportation"
          defaultLabel={formatMessage(
            trans('app.filters.placeholder.meansOfTransportation')
          )}
          onChange={this.onChange}
          {...props}
        />
      );
    } else {
      return (
        <Dropdown
          options={meansOfTransportation}
          name="means_of_transportation"
          editable
          onChange={this.onChange}
          {...props}
        />
      );
    }
  }
}

const enhance = compose(
  injectIntl,
  connect(state => ({
    meansOfTransportation: getMeansOfTransportationOptions(state),
  }))
);

export default enhance(MeansOfTransportationFilter);
