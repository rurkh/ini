import React, { PureComponent } from 'react';
import { InputText } from 'primereact/components/inputtext/InputText';
import { injectIntl } from 'react-intl';
import _throttle from 'lodash/throttle';

import trans from 'utils/transMsg';

class SearchFilter extends PureComponent {
  componentWillMount() {
    this._handleChange = _throttle(this.props.onChange, 500);
  }

  componentWillUnmount() {
    this._handleChange.cancel();
  }

  onSearch = e => {
    e.persist();
    this._handleChange(e);
  };

  render() {
    const { intl: { formatMessage }, ...props } = this.props;

    return (
      <div className="search-filter">
        <i className="fa fa-search" />
        <InputText
          type="search"
          onInput={this.onSearch}
          className="search-filter"
          placeholder={formatMessage(trans('app.filters.placeholder.search'))}
          {...props}
        />
      </div>
    );
  }
}

export default injectIntl(SearchFilter);
