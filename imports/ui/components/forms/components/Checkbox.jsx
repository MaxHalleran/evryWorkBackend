import React from 'react';
import PropTypes from 'prop-types';

const Checkbox = ({ type = 'checkbox', id, checked = false, onChange, label }) => (
  <div className="form-check">
    <input type={type} id={id} checked={checked} className="form-check-input" onChange={onChange} />
    {label &&
      <label className="form-check-label" htmlFor={id}>{label}</label>
    }
  </div>
);

Checkbox.propTypes = {
  type: PropTypes.string,
  id: PropTypes.string,
  label: PropTypes.string,
  checked: PropTypes.bool,
  onChange: PropTypes.func.isRequired,
}

export default Checkbox;
