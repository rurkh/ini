import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Checkbox } from 'primereact/components/checkbox/Checkbox';

import { getRoles } from 'modules/core/enum';

class RoleField extends Component {
  static propTypes = {
    roles: PropTypes.arrayOf(PropTypes.string).isRequired,
    value: PropTypes.arrayOf(PropTypes.string),
    onChange: PropTypes.func,
    label: PropTypes.string,
    name: PropTypes.string,
    trans: PropTypes.func.isRequired,
  };

  static defaultProps = {
    value: [],
    name: '',
  };

  handleChange = e => {
    let selectedValue = [...this.props.value];
    if (e.checked) {
      selectedValue.push(e.value);
    } else {
      selectedValue.splice(selectedValue.indexOf(e.value), 1);
    }

    this.props.onChange &&
      this.props.onChange({ name: this.props.name, value: selectedValue });
  };

  render() {
    const { trans, required, roles, value, label, name } = this.props;
    return (
      <Fragment>
        {label && (
          <span className="md-inputfield">
            <label>
              {label}
              {required && <span className="field-required">*</span>}
            </label>
          </span>
        )}
        {roles.map(role => {
          return (
            <div key={role} className="checkbox-wrapper">
              <Checkbox
                inputId={`${name}.${role}`}
                name={`${name}.${role}`}
                value={role}
                checked={value.includes(role)}
                onChange={this.handleChange}
              />
              <label htmlFor={`${name}.${role}`}>
                {trans(`app.roles.${role}`)}
              </label>
            </div>
          );
        })}
      </Fragment>
    );
  }
}

export default connect(state => ({ roles: getRoles(state) }))(RoleField);
