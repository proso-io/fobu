import React from 'react';
import PropTypes from 'prop-types';
import './EditableBlock.scss';
import { SUPPORTED_BLOCKS } from '../../constants';
import { getBlockForSchema } from '../../utils/formUtils';
import {
  FaCog,
  FaArrowUp,
  FaArrowDown,
  FaTrash,
  FaMousePointer
} from 'react-icons/fa';

function isBlockSelected(selectedBlockId, blockSchema) {
  return selectedBlockId && selectedBlockId === blockSchema.id;
}

function getWrapperClassName(selectedBlockId, blockSchema) {
  return `editableFormElement__wrapper ${
    isBlockSelected(selectedBlockId, blockSchema)
      ? 'editableFormElement__wrapper--selected'
      : ''
  }`;
}

function EditableBlock(props) {
  const {
    schema,
    onValueChange,
    onEditClickFunctions,
    selectedBlockId
  } = props;
  let blockMarkup = getBlockForSchema(
    schema,
    onValueChange,
    onEditClickFunctions,
    selectedBlockId
  );
  return (
    <div className={getWrapperClassName(selectedBlockId, schema)}>
      {blockMarkup}
      <div className="editableFormElement__controls">
        {(schema.type === 'section' || schema.type === 'group') && (
          <button
            onClick={() => onEditClickFunctions['select'](schema)}
            className="editableFormElement__editControl">
            <FaMousePointer />
          </button>
        )}
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

EditableBlock.propTypes = {
  schema: PropTypes.shape({
    id: PropTypes.string.isRequired,
    type: PropTypes.oneOf(SUPPORTED_BLOCKS).isRequired,
    elementParams: PropTypes.object.isRequired,
    children: PropTypes.array
  }).isRequired,
  onValueChange: PropTypes.func,
  onEditClickFunctions: PropTypes.shape({
    settings: PropTypes.func,
    up: PropTypes.func,
    down: PropTypes.func,
    delete: PropTypes.func,
    select: PropTypes.func
  }),
  selectedBlockId: PropTypes.string
};

EditableBlock.defaultProps = {
  onValueChange: () => {},
  onEditClickFunctions: {
    settings: () => {},
    up: () => {},
    down: () => {},
    delete: () => {},
    select: () => {}
  }
};

export default EditableBlock;
