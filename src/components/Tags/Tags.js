import React from 'react';
import PropTypes from 'prop-types';
import './Tags.scss';
import { STRINGS } from '../../constants';

const addKeys = [9, 13];
const removeKeys = [8];

function Tag(props) {
  const { tagString, onTagDelete } = props;
  return (
    <span className="tag">
      <span>{tagString}</span>
      <a className="tag__cross" href="#" onClick={onTagDelete}>
        x
      </a>
    </span>
  );
}

function Tags(props) {
  const {
    id,
    label,
    placeholder,
    onValueChange,
    disabled,
    required,
    value,
    errorString
  } = props;

  function onTagDelete(event, tag) {
    event.preventDefault();
    let newValue = [].concat(value);
    let index = newValue.indexOf(tag);
    if (index !== -1) newValue.splice(index, 1);
    onValueChange(id, newValue);
  }

  function onKeyDown(e) {
    let inputValue = e.target.value;
    let keyCode = e.keyCode;
    let key = e.key;
    let add = addKeys.indexOf(keyCode) !== -1 || addKeys.indexOf(key) !== -1;
    let remove =
      removeKeys.indexOf(keyCode) !== -1 || removeKeys.indexOf(key) !== -1;

    if (inputValue) {
      inputValue = inputValue.trim();
    }

    let empty = inputValue === '';

    if (add && !empty) {
      if (value.indexOf(inputValue) === -1) {
        let newValue = [].concat(value, [inputValue]);
        onValueChange(id, newValue);
      }
      e.target.value = '';
    }

    if (remove && empty) {
      let newValue = [].concat(value);
      newValue.pop();
      onValueChange(id, newValue);
    }
  }

  return (
    <div
      className={
        errorString !== ''
          ? 'tags__container tags__container--error'
          : 'tags__container'
      }>
      <label className="tags__label" htmlFor={id}>
        {label}
      </label>
      <div className="tags__wrapper">
        {value.map(tag => (
          <Tag
            key={tag}
            onTagDelete={e => onTagDelete(event, tag)}
            tagString={tag}
          />
        ))}

        <span className="tags__newInputContainer">
          <input
            disabled={disabled}
            className="tags__newInput"
            type="text"
            placeholder={placeholder}
            onKeyDown={onKeyDown}
          />
        </span>
      </div>
      <div className="tags__feedbackMessage">{errorString}</div>
    </div>
  );
}

Tags.propTypes = {
  id: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  onValueChange: PropTypes.func,
  errorString: PropTypes.string,
  disabled: PropTypes.bool,
  required: PropTypes.bool,
  value: PropTypes.array
};

Tags.defaultProps = {
  placeholder: '',
  onValueChange: () => {},
  errorString: '',
  disabled: false,
  required: false,
  value: []
};

export default Tags;
