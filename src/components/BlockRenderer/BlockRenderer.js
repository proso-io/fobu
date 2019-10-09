import React from 'react';
import PropTypes from 'prop-types';
import './BlockRenderer.scss';
import { SUPPORTED_BLOCKS } from '../../constants';
import { getBlockForSchema } from '../../utils/formUtils';

function BlockRenderer(props) {
  const {
    blockSchema,
    editMode,
    onValueChange,
    onEditClickFunctions,
    selectedBlockId
  } = props;
  return (
    <React.Fragment key={blockSchema.id}>
      {getBlockForSchema(
        blockSchema,
        onValueChange,
        onEditClickFunctions,
        selectedBlockId,
        editMode
      )}
    </React.Fragment>
  );
}

BlockRenderer.propTypes = {
  blockSchema: PropTypes.shape({
    id: PropTypes.string,
    type: PropTypes.oneOf(SUPPORTED_BLOCKS),
    elementParams: PropTypes.object
  }).isRequired,
  onValueChange: PropTypes.func,
  editMode: PropTypes.bool,
  onEditClickFunctions: PropTypes.shape({
    settings: PropTypes.func.isRequired,
    up: PropTypes.func.isRequired,
    down: PropTypes.func.isRequired,
    delete: PropTypes.func.isRequired,
    select: PropTypes.func
  }),
  selectedBlockId: PropTypes.string
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
  selectedBlockId: null
};

export default BlockRenderer;
