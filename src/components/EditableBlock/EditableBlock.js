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
  return class EditableBlock extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        hovered: false
      };
      this.setHovered.bind(this);
    }

    setHovered(event, value) {
      event.stopPropagation();
      this.setState({ hovered: value });
    }

    render() {
      const {
        onEditClickFunctions,
        selectedBlockId,
        children,
        selectable,
        ...blockProps
      } = this.props;

      return (
        <div
          className={getWrapperClassName(selectedBlockId, blockProps.id)}
          onMouseEnter={e => this.setHovered(e, true)}
          onMouseLeave={e => this.setHovered(e, false)}>
          <BlockComponent {...blockProps}>{children}</BlockComponent>
          {this.state.hovered && (
            <div className="editableFormElement__controls">
              {selectable && (
                <button
                  onClick={() => onEditClickFunctions['select'](blockProps)}
                  className="editableFormElement__editControl">
                  <FaMousePointer />
                </button>
              )}
              <button
                onClick={() => onEditClickFunctions['settings'](blockProps)}
                className="editableFormElement__editControl">
                <FaCog />
              </button>
              <button
                onClick={() => onEditClickFunctions['up'](blockProps)}
                className="editableFormElement__editControl">
                <FaArrowUp />
              </button>
              <button
                onClick={() => onEditClickFunctions['down'](blockProps)}
                className="editableFormElement__editControl">
                <FaArrowDown />
              </button>
              <button
                onClick={() => onEditClickFunctions['delete'](blockProps)}
                className="editableFormElement__editControl">
                <FaTrash />
              </button>
            </div>
          )}
        </div>
      );
    }
  };
}

export default getEditableBlock;
