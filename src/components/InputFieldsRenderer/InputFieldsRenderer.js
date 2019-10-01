import React from 'react';
import PropTypes from 'prop-types';
import './InputFieldsRenderer.scss';
import { SUPPORTED_FORM_ELEMENTS } from '../../constants';
import { getFormElementForSchema } from '../../utils/formUtils';

function InputFieldsRenderer(props) {
  const {
    formElementSchemas,
    editMode,
    onValueChange,
    onEditClickFunctions
  } = props;
  return formElementSchemas.map(formElementSchema => {
    return (
      <React.Fragment key={formElementSchema.id}>
        {getFormElementForSchema(
          formElementSchema,
          onValueChange,
          editMode,
          onEditClickFunctions
        )}
      </React.Fragment>
    );
  });
}

InputFieldsRenderer.propTypes = {
  formElementSchemas: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      type: PropTypes.oneOf(SUPPORTED_FORM_ELEMENTS),
      elementParams: PropTypes.object
    })
  ).isRequired,
  onValueChange: PropTypes.func,
  editMode: PropTypes.bool,
  onEditClickFunctions: PropTypes.shape({
    settings: PropTypes.func,
    up: PropTypes.func,
    down: PropTypes.func,
    delete: PropTypes.func
  })
};

InputFieldsRenderer.defaultProps = {
  editMode: true,
  onValueChange: () => {},
  onEditClickFunctions: {
    settings: () => {},
    up: () => {},
    down: () => {},
    delete: () => {}
  }
};

export default InputFieldsRenderer;
