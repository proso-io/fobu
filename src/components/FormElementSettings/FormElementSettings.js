import React from 'react';
import PropTypes from 'prop-types';
import InputFieldsRenderer from '../InputFieldsRenderer';
import './FormElementSettings.scss';
import {
  FORM_ELEMENTS_SETTINGS_SCHEMA,
  SUPPORTED_FORM_ELEMENTS
} from '../../constants';

/*
Given a form element, this component renders the settings for that form element.
On changing something here, formBuilder updates the form schema
*/
function FormElementSettings(props) {
  const { inputType, onFormElementSettingsChange } = props;
  const formElementSettings = FORM_ELEMENTS_SETTINGS_SCHEMA[inputType];
  return (
    <InputFieldsRenderer
      onValueChange={onFormElementSettingsChange}
      onEditClickFunctions={onEditClickFunctions}
      {...formElementSettings}
    />
  );
}

FormElementSettings.propTypes = {
  formElementType: PropTypes.oneOf(SUPPORTED_FORM_ELEMENTS).isRequired,
  onFormElementSettingsChange: PropTypes.func.isRequired,
  onEditClickFunctions: PropTypes.shape({
    settings: PropTypes.func,
    up: PropTypes.func,
    down: PropTypes.func,
    delete: PropTypes.func
  }).isRequired
};

FormElementSettings.defaultProps = {};

export default FormElementSettings;
