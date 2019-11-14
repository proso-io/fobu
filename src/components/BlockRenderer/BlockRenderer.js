import React from 'react';
import PropTypes from 'prop-types';
import './BlockRenderer.scss';
import { SUPPORTED_BLOCKS } from '../../constants';
import {
  getBlockForSchema,
  getEditableBlockForSchema
} from '../../utils/formUtils';

function BlockRenderer(props) {
  const {
    blockSchema,
    formData,
    editMode,
    onValueChange,
    onEditClickFunctions,
    selectedBlockId,
    formErrors
  } = props;

  return (
    <React.Fragment key={blockSchema.id}>
      {editMode
        ? getEditableBlockForSchema(
            blockSchema,
            formData,
            onValueChange,
            formErrors,
            onEditClickFunctions,
            selectedBlockId,
            editMode
          )
        : getBlockForSchema(blockSchema, formData, onValueChange, formErrors)}
    </React.Fragment>
  );
}

BlockRenderer.propTypes = {
  blockSchema: PropTypes.shape({
    id: PropTypes.string,
    type: PropTypes.oneOf(SUPPORTED_BLOCKS),
    elementParams: PropTypes.object
  }).isRequired,
  formData: PropTypes.object.isRequired,
  formErrors: PropTypes.arrayOf(
    PropTypes.shape({
      pageId: PropTypes.number,
      inputId: PropTypes.string,
      error: PropTypes.string
    })
  ).isRequired,
  onValueChange: PropTypes.func,
  editMode: PropTypes.bool,
  onEditClickFunctions: PropTypes.shape({
    settings: PropTypes.func.isRequired,
    up: PropTypes.func.isRequired,
    down: PropTypes.func.isRequired,
    delete: PropTypes.func.isRequired,
    select: PropTypes.func
  }),
  selectedBlockId: PropTypes.string,
  isActive: PropTypes.bool
};

BlockRenderer.defaultProps = {
  editMode: true,
  onValueChange: () => {},
  onEditClickFunctions: {
    settings: () => {},
    up: () => {},
    down: () => {},
    delete: () => {},
    select: () => {}
  },
  selectedBlockId: null,
  isActive: false
};

export default BlockRenderer;
