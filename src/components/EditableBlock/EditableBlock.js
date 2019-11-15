import React, { useState } from 'react';
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

function isBlockSelected(selectedBlockId, blockId) {
  return selectedBlockId && selectedBlockId === blockId;
}

function getWrapperClassName(selectedBlockId, blockId) {
  return `editableFormElement__wrapper ${
    isBlockSelected(selectedBlockId, blockId)
      ? 'editableFormElement__wrapper--selected'
      : ''
  } `;
}

/*
Given a component, this function returns the same component with edit controls added in.
Needs a component fn as input
*/
function getEditableBlock(BlockComponent) {
  const EditableBlock = function(props) {
    const [hovered, setHovered] = useState(false);
    const {
      onEditClickFunctions,
      selectedBlockId,
      children,
      selectable,
      blockSchema,
      blockProps
    } = props;

    return (
      <div
        className={getWrapperClassName(selectedBlockId, blockProps.id)}
        onMouseEnter={e => setHovered(true)}
        onMouseLeave={e => setHovered(false)}>
        <BlockComponent
          id={blockProps.id}
          {...blockProps.elementParams}
          onValueChange={blockProps.onValueChange}>
          {children}
        </BlockComponent>
        {hovered && (
          <div className="editableFormElement__controls">
            {selectable && (
              <button
                onClick={() => onEditClickFunctions['select'](blockSchema)}
                className="editableFormElement__editControl">
                <FaMousePointer />
              </button>
            )}
            <button
              onClick={() => onEditClickFunctions['settings'](blockSchema)}
              className="editableFormElement__editControl">
              <FaCog />
            </button>
            <button
              onClick={() => onEditClickFunctions['up'](blockSchema)}
              className="editableFormElement__editControl">
              <FaArrowUp />
            </button>
            <button
              onClick={() => onEditClickFunctions['down'](blockSchema)}
              className="editableFormElement__editControl">
              <FaArrowDown />
            </button>
            <button
              onClick={() => onEditClickFunctions['delete'](blockSchema)}
              className="editableFormElement__editControl">
              <FaTrash />
            </button>
          </div>
        )}
      </div>
    );
  };

  EditableBlock.propTypes = {
    blockProps: PropTypes.shape({
      id: PropTypes.string.isRequired,
      elementParams: PropTypes.object.isRequired,
      onValueChange: PropTypes.function
    }),
    selectedBlockId: PropTypes.string,
    blockSchema: PropTypes.shape({
      id: PropTypes.string,
      type: PropTypes.oneOf(SUPPORTED_BLOCKS),
      elementParams: PropTypes.object
    }).isRequired,
    onEditClickFunctions: PropTypes.shape({
      settings: PropTypes.func.isRequired,
      up: PropTypes.func.isRequired,
      down: PropTypes.func.isRequired,
      delete: PropTypes.func.isRequired,
      select: PropTypes.func
    }),
    selectedBlockId: PropTypes.string,
    selectable: PropTypes.bool,
    selectedBlockId: PropTypes.string
  };

  return EditableBlock;
}

export default getEditableBlock;
