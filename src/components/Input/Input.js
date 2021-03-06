import React from 'react';
import PropTypes from 'prop-types';
import InputTypes from './InputTypes';
import './Input.scss';

function Input(props) {
  const {
    label,
    id,
    type,
    value,
    onValueChange,
    placeholder,
    errorString,
    disabled,
    required,
    pattern,
    title,
    className
  } = props;
  return (
    <div
      className={
        `${className ? className : ''} ` +
        (errorString !== ''
          ? 'input__container input__container--error'
          : 'input__container')
      }>
      <label className="input__label" htmlFor={id}>
        {label}
      </label>
      <input
        id={id}
        className="input"
        type={type}
        value={value}
        required={required}
        disabled={disabled}
        placeholder={placeholder}
        pattern={pattern}
        title={title}
        onChange={e => {
          onValueChange(id, e.target.value);
        }}
      />
      <div className="input__feedbackMessage">{errorString}</div>
    </div>
  );
}

Input.propTypes = {
  id: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  type: PropTypes.oneOf(InputTypes).isRequired,
  onValueChange: PropTypes.func,
  placeholder: PropTypes.string,
  value: PropTypes.string,
  disabled: PropTypes.bool,
  required: PropTypes.bool,
  pattern: PropTypes.string,
  title: PropTypes.string,
  errorString: PropTypes.string
};

Input.defaultProps = {
  onValueChange: () => {},
  placeholder: 'Type something here..',
  errorString: '',
  disabled: false,
  required: false,
  value: '',
  pattern: '.*',
  title: ''
};

export default Input;
