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
    <div className="editableFormElementWrapper">
      {formElement}
      <div className="formElementEditControls">
        <button
          onClick={onEditClickFunctions['settings']}
          className="editControl">
          <FaCog />
        </button>
        <button onClick={onEditClickFunctions['up']} className="editControl">
          <FaArrowUp />
        </button>
        <button onClick={onEditClickFunctions['down']} className="editControl">
          <FaArrowDown />
        </button>
        <button
          onClick={onEditClickFunctions['delete']}
          className="editControl">
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
