import React from 'react';
import PropTypes from 'prop-types';
import './Select.scss';
import { STRINGS } from '../../constants';

function Select(props) {
  const {
    id,
    label,
    options,
    onValueChange,
    forceChoose,
    disabled,
    required,
    multiple,
    value,
    errorString
  } = props;
  if (!forceChoose && value === '') {
    // if user doesnt want to show "pick an option" but hasnt sent a value, pick the first value
    setTimeout(function() {
      onValueChange(id, options[0].value);
    });
  } else if (forceChoose && value !== '') {
    setTimeout(function() {
      onValueChange(id, '');
    });
  }
  return (
    <div
      className={
        errorString !== ''
          ? 'select__container select__container--error'
          : 'select__container'
      }>
      <label className="select__label" htmlFor={id}>
        {label}
      </label>
      <select
        className="select"
        disabled={disabled}
        required={required}
        multiple={multiple}
        value={value}
        onChange={e => onValueChange(id, e.target.value)}>
        <option value="">{STRINGS.PICK_AN_OPTION_TEXT}</option>
        {options.map(option => {
          return (
            <option
              key={`${id}-${option.value}`}
              className="select__option"
              value={option.value}>
              {option.label}
            </option>
          );
        })}
      </select>
      <div className="select__feedbackMessage">{errorString}</div>
    </div>
  );
}

Select.propTypes = {
  id: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string,
      label: PropTypes.string
    })
  ).isRequired,
  onValueChange: PropTypes.func,
  errorString: PropTypes.string,
  forceChoose: PropTypes.bool, // if true, select will show "pick an option" by default
  disabled: PropTypes.bool,
  required: PropTypes.bool,
  multiple: PropTypes.bool,
  value: PropTypes.string
};

Select.defaultProps = {
  onValueChange: () => {},
  errorString: '',
  forceChoose: false,
  disabled: false,
  required: false,
  multiple: false,
  value: ''
};

export default Select;
