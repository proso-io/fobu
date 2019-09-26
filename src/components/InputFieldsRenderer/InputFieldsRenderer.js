import React from 'react';
import PropTypes from 'prop-types';
import './InputFieldsRenderer.scss';

function InputFieldsRenderer(props) {
  const {id, title, description, children} = props;
  return (

  )
}

InputFieldsRenderer.propTypes = {
 id: PropTypes.string.isRequired,
 title: PropTypes.string.isRequired,
 description: PropTypes.string
}

InputFieldsRenderer.defaultProps = {
  description: ""
}

export default InputFieldsRenderer;
