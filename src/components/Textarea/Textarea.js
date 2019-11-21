import React from 'react';
import PropTypes from 'prop-types';
import './Textarea.scss';
import { STRINGS } from '../../strings';

function Textarea(props) {
  const {
    id,
    label,
    placeholder,
    onValueChange,
    maxlength,
    rows,
    cols,
    disabled,
    required,
    value,
    errorString,
    className
  } = props;
  return (
    <div
      className={
        `${className ? className : ''} ` +
        (errorString !== ''
          ? 'textarea__container textarea__container--error'
          : 'textarea__container')
      }>
      <label className="textarea__label" htmlFor={id}>
        {label}
      </label>
      <textarea
        id={id}
        className="textarea"
        placeholder={placeholder}
        disabled={disabled}
        required={required}
        maxLength={maxlength}
        rows={rows}
        value={value}
        cols={cols}
        onChange={e => onValueChange(id, e.target.value)}></textarea>
      <div className="textarea__feedbackMessage">{errorString}</div>
    </div>
  );
}

Textarea.propTypes = {
  id: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  onValueChange: PropTypes.func,
  errorString: PropTypes.string,
  disabled: PropTypes.bool,
  required: PropTypes.bool,
  value: PropTypes.string
};

Textarea.defaultProps = {
  onValueChange: () => {},
  errorString: '',
  disabled: false,
  required: false,
  value: ''
};

export default Textarea;
