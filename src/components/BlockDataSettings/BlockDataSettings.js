import React from 'react';
import PropTypes from 'prop-types';
import './BlockDataSettings.scss';
import Input from '../Input';
import { SUPPORTED_BLOCKS } from '../../constants';
import { STRINGS } from '../../strings';
import { FaMinus } from 'react-icons/fa';

function BlockDataSettings(props) {
  const { id, value, onValueChange } = props;

  function addNewOption(e) {
    e.preventDefault();
    onValueChange(id, [].concat(value, [{ label: '', value: '' }]));
  }

  function deleteOption(index) {
    let newOptions = [].concat(value);
    newOptions.splice(index, 1);
    onValueChange(id, newOptions);
  }

  function onOptionChange(id, field, fieldValue) {
    let newOptions = [].concat(value);
    id = id.replace(field, '');
    newOptions[id][field] = fieldValue;
    onValueChange(id, newOptions);
  }

  return (
    <div className="dataSettings__container">
      <p className="dataSettings__title">
        {STRINGS.ELEMENT_DATA_SETTINGS_TITLE}
      </p>
      <div className="dataSettings__controlsContainer">
        <a
          className="dataSettings__control dataSettings__control--addOption"
          href="#"
          onClick={addNewOption}>
          {STRINGS.ADD_NEW_OPTION_TEXT}
        </a>
      </div>
      <div className="dataSettings__optionsContainer">
        {value.map((option, index) => (
          <div key={'row' + index} className="dataSettings__optionWrapper">
            <Input
              key={'label' + String(index)}
              id={'label' + String(index)}
              label={STRINGS.OPTION_LABEL_LABEL_TEXT}
              type="text"
              onValueChange={(id, value) => onOptionChange(id, 'label', value)}
              placeholder="For eg.. Cloth for work"
              value={option.label}
            />
            <div className="horizontal20" />
            <Input
              key={'value' + String(index)}
              id={'value' + String(index)}
              label={STRINGS.OPTION_VALUE_LABEL_TEXT}
              type="text"
              onValueChange={(id, value) => onOptionChange(id, 'value', value)}
              placeholder="For eg.. CFW"
              value={option.value}
            />
            <div className="horizontal20" />
            <button
              onClick={() => deleteOption(index)}
              className="dataSettings__deleteControl">
              <FaMinus />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

BlockDataSettings.propTypes = {
  id: PropTypes.string.isRequired,
  value: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string,
      value: PropTypes.string
    })
  ),
  onValueChange: PropTypes.func
};

BlockDataSettings.defaultProps = {
  value: [],
  onValueChange: () => {}
};

export default BlockDataSettings;
