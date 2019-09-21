import React from 'react';
import PropTypes from 'prop-types';
import InputTypes from './InputTypes';
import './Input.scss';

function Input(props) {
  const { label, id, value, onValueChange } = props;
  return (
    <>
      <label htmlFor={id}>
        {label}
        <input
          id={id}
          value={value}
          onChange={e => {
            onValueChange(id, e.target.value);
          }}
        />
      </label>
    </>
  );
}

Input.propTypes = {
   id: PropTypes.string.isRequired,
   label: PropTypes.string.isRequired,
   value: PropTypes.string,
   type: PropTypes.oneOf(InputTypes).isRequired,
   disabled: PropTypes.bool,
   errorString: PropTypes.string
}

export default Input;
