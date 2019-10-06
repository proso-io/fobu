import React from 'react';
import PropTypes from 'prop-types';
import './Checkbox.scss';

function Checkbox(props) {
  const { label, id, value, onValueChange, placeholder, errorString } = props;
  return (
    <div className="checkbox__container">
      <div className="checkbox__drawingContainer">
        <input
          id={id}
          type="checkbox"
          className="checkbox__input"
          checked={value}
          placeholder={placeholder}
          onChange={e => {
            onValueChange(id, e.target.value);
          }}
        />
        <span className="checkbox__custom"></span>
      </div>
      <label className="checkbox__label" htmlFor={id}>
        {label}
      </label>
    </div>
  );
}

Checkbox.propTypes = {
  id: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  onValueChange: PropTypes.func,
  value: PropTypes.bool,
  disabled: PropTypes.bool
};

Checkbox.defaultProps = {
  onValueChange: () => {},
  value: false,
  placeholder: null
};

export default Checkbox;
