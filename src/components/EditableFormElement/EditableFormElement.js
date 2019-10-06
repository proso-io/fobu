import React from 'react';
import PropTypes from 'prop-types';
import './EditableFormElement.scss';
import { SUPPORTED_FORM_ELEMENTS } from '../../constants';
import { getFormElementForSchema } from '../../utils/formUtils';
import { FaCog, FaArrowUp, FaArrowDown, FaTrash } from 'react-icons/fa';

function EditableFormElement(props) {
  const { schema, onValueChange, onEditClickFunctions } = props;
  let formElement = getFormElementForSchema(schema, onValueChange);
  return (
    <div className="editableFormElement__wrapper">
      {formElement}
      <div className="editableFormElement__controls">
        <button
          onClick={() => onEditClickFunctions['settings'](schema)}
          className="editableFormElement__editControl">
          <FaCog />
        </button>
        <button
          onClick={() => onEditClickFunctions['up'](schema)}
          className="editableFormElement__editControl">
          <FaArrowUp />
        </button>
        <button
          onClick={() => onEditClickFunctions['down'](schema)}
          className="editableFormElement__editControl">
          <FaArrowDown />
        </button>
        <button
          onClick={() => onEditClickFunctions['delete'](schema)}
          className="editableFormElement__editControl">
          <FaTrash />
        </button>
      </div>
    </div>
  );
}

EditableFormElement.propTypes = {
  schema: PropTypes.shape({
    id: PropTypes.string,
    type: PropTypes.oneOf(SUPPORTED_FORM_ELEMENTS),
    elementParams: PropTypes.object
  }).isRequired,
  onValueChange: PropTypes.func,
  onEditClickFunctions: PropTypes.shape({
    settings: PropTypes.func,
    up: PropTypes.func,
    down: PropTypes.func,
    delete: PropTypes.func
  })
};

EditableFormElement.defaultProps = {
  onValueChange: () => {},
  onEditClickFunctions: {
    settings: () => {},
    up: () => {},
    down: () => {},
    delete: () => {}
  }
};

export default EditableFormElement;
