import React from 'react';
import PropTypes from 'prop-types';
import './EditableBlock.scss';
import { SUPPORTED_BLOCKS } from '../../constants';
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

class EditableBlock extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hovered: false
    };
  }

  setHovered = value => {
    this.setState({ hovered: value });
  };

  render() {
    const {
      onEditClickFunctions,
      selectedBlockId,
      children,
      selectable,
      blockSchema,
      blockId
    } = this.props;

    return (
      <div
        className={getWrapperClassName(selectedBlockId, blockId)}
        onMouseEnter={e => this.setHovered(true)}
        onMouseLeave={e => this.setHovered(false)}>
        {children}
        {this.state.hovered && (
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
  }
}

EditableBlock.propTypes = {
  blockId: PropTypes.string.isRequired,
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

export default EditableBlock;
