import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { injectIntl } from 'react-intl';
import { Dropdown } from 'primereact/components/dropdown/Dropdown';

import { getDepositionsOptions } from 'modules/depositions/depositions';
import trans from 'utils/transMsg';

class DepositionField extends PureComponent {
  onChange = e => {
    const { name = 'deposition', onChange } = this.props;
    const value = e.value;
    typeof onChange === 'function' && onChange({ target: { name, value } });
  };
  render() {
    const {
      depositions,
      intl: { formatMessage },
      onChange,
      ...props
    } = this.props;

    return (
      <Dropdown
        options={depositions}
        name="deposition"
        filter
        defaultLabel={formatMessage(trans('app.fields.placeholder.deposition'))}
        onChange={this.onChange}
        {...props}
      />
    );
  }
}

const enhance = compose(
  injectIntl,
  connect(state => ({
    depositions: getDepositionsOptions(state),
  }))
);

export default enhance(DepositionField);
