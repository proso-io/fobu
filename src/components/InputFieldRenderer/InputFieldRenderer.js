import React from 'react';
import PropTypes from 'prop-types';
import './InputFieldRenderer.scss';
import { SUPPORTED_FORM_ELEMENTS } from '../../constants';
import { getFormElementForSchema } from '../../utils/formUtils';

function InputFieldRenderer(props) {
  const {
    formElementSchema,
    editMode,
    onValueChange,
    onEditClickFunctions
  } = props;
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
}

InputFieldRenderer.propTypes = {
  formElementSchema: PropTypes.shape({
    id: PropTypes.string,
    type: PropTypes.oneOf(SUPPORTED_FORM_ELEMENTS),
    elementParams: PropTypes.object
  }).isRequired,
  onValueChange: PropTypes.func,
  editMode: PropTypes.bool,
  onEditClickFunctions: PropTypes.shape({
    settings: PropTypes.func,
    up: PropTypes.func,
    down: PropTypes.func,
    delete: PropTypes.func
  })
};

InputFieldRenderer.defaultProps = {
  editMode: true,
  onValueChange: () => {},
  onEditClickFunctions: {
    settings: () => {},
    up: () => {},
    down: () => {},
    delete: () => {}
  }
};

export default InputFieldRenderer;
