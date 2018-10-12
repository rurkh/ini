import React from 'react';
import PropTypes from 'prop-types';
import { InputText } from 'primereact/components/inputtext/InputText';

import FieldFeedback from './FieldFeedback';

const renderAddon = addon => {
  if (Array.isArray(addon)) {
    return addon.map((item, index) => (
      <span className="ui-inputgroup-addon" key={index}>
        {item}
      </span>
    ));
  } else {
    return <span className="ui-inputgroup-addon">{addon}</span>;
  }
};

const renderField = ({ label, id, error, ...props }) => {
  return (
    <span className="md-inputfield">
      <InputText id={id} {...props} />
      <label htmlFor={id}>
        {label}
        {!!props.required && <span className="field-required">*</span>}
      </label>
      <FieldFeedback error={error} />
    </span>
  );
};

const TextField = ({ prefix, suffix, ...props }) => {
  if (prefix || suffix) {
    return (
      <div className="ui-inputgroup">
        {prefix && renderAddon(prefix)}
        {renderField(props)}
        {suffix && renderAddon(suffix)}
      </div>
    );
  } else {
    return renderField(props);
  }
};

TextField.propTypes = {
  label: PropTypes.string,
  id: PropTypes.string,
  error: PropTypes.string,
  prefix: PropTypes.any,
  suffix: PropTypes.any,
};

export default TextField;
