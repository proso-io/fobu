import React from 'react';
import PropTypes from 'prop-types';
import InputFieldsRenderer from '../InputFieldsRenderer';
import './FormElementSettings.scss';

function FormElementSettings(props) {}

FormElementSettings.propTypes = {
  id: PropTypes.string.isRequired,
  elementParams: PropTypes.object.isRequired
};

FormElementSettings.defaultProps = {};

export default FormElementSettings;
