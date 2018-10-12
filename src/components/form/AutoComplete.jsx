import React from 'react';
import { AutoComplete as PrimeAutoComplete } from 'primereact/components/autocomplete/AutoComplete';
import ObjectUtils from 'primereact/components/utils/ObjectUtils';

class AutoComplete extends PrimeAutoComplete {
  renderChips() {
    if (this.props.value && this.props.value.length) {
      return this.props.value.map((val, index) => {
        return (
          <li
            key={index + 'multi-item'}
            className="ui-autocomplete-token ui-state-highlight ui-corner-all"
          >
            <span
              className="ui-autocomplete-token-icon fa fa-fw fa-close"
              onClick={e => this.removeItem(e, index)}
            />
            <span className="ui-autocomplete-token-label">
              {this.formatValue(val)}
            </span>
          </li>
        );
      });
    } else {
      return null;
    }
  }

  formatValue(value) {
    if (value)
      if (this.props.selectedItemTemplate) {
        const resolvedFieldData = this.props.selectedItemTemplate(value);
        return resolvedFieldData ? resolvedFieldData : value;
      } else if (this.props.field) {
        const resolvedFieldData = ObjectUtils.resolveFieldData(
          value,
          this.props.field
        );
        return resolvedFieldData !== null ? resolvedFieldData : value;
      } else {
        return value;
      }
    else {
      return '';
    }
  }
}

export default AutoComplete;
