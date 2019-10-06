import React from 'react';
import PropTypes from 'prop-types';
import InputFieldRenderer from '../InputFieldRenderer';
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
  const {
    inputType,
    onFormElementSettingsChange,
    formElementParams,
    formElementId
  } = props;
  const formElementSettings = FORM_ELEMENTS_SETTINGS_SCHEMA[inputType];
  return formElementSettings.settingsSchema.map(formElementSchema => (
    <InputFieldRenderer
      onValueChange={(id, value) => {
        let changedParamMap = {};
        changedParamMap[id] = value;
        let elementParams = Object.assign(
          {},
          formElementParams,
          changedParamMap
        );
        onFormElementSettingsChange(formElementId, elementParams);
      }}
      formElementSchema={formElementSchema}
      editMode={formElementSettings.editMode}
    />
  ));
}

FormElementSettings.propTypes = {
  formElementType: PropTypes.oneOf(SUPPORTED_FORM_ELEMENTS).isRequired,
  formElementParams: PropTypes.obj,
  formElementId: PropTypes.string,
  onFormElementSettingsChange: PropTypes.func.isRequired
};

FormElementSettings.defaultProps = {};

export default FormElementSettings;
