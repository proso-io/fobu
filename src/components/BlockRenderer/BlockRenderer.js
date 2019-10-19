import React from 'react';
import PropTypes from 'prop-types';
import './BlockRenderer.scss';
import {
  SUPPORTED_BLOCKS,
  SUPPORTED_CONDITIONAL_FUNCTIONS
} from '../../constants';
import {
  getBlockForSchema,
  getEditableBlockForSchema
} from '../../utils/formUtils';

function applyCondition(value1, operator, value2) {
  const operatorFn = SUPPORTED_CONDITIONAL_FUNCTIONS[operator];
  return operatorFn(value1, value2);
}

function applyConditions(blockSchema, formData) {
  let shouldRender = true;
  if (
    blockSchema &&
    blockSchema.elementParams &&
    blockSchema.elementParams.conditions
  ) {
    // block should pass all conditions since conditions are evaluated as AND
    shouldRender = blockSchema.elementParams.conditions.every(condition => {
      if (formData.hasOwnProperty(condition.dependentOnId)) {
        return applyCondition(
          formData[condition.dependentOnId],
          condition.conditional,
          condition.shouldHaveValue
        );
      } else {
        return true;
      }
    });
  }
  return shouldRender;
}

function BlockRenderer(props) {
  const {
    blockSchema,
    formData,
    editMode,
    onValueChange,
    onEditClickFunctions,
    selectedBlockId
  } = props;
  const shouldRender = applyConditions(blockSchema, formData);
  return shouldRender ? (
    <React.Fragment key={blockSchema.id}>
      {editMode
        ? getEditableBlockForSchema(
            blockSchema,
            formData,
            onValueChange,
            onEditClickFunctions,
            selectedBlockId,
            editMode
          )
        : getBlockForSchema(blockSchema, formData, onValueChange)}
    </React.Fragment>
  ) : (
    <></>
  );
}

BlockRenderer.propTypes = {
  blockSchema: PropTypes.shape({
    id: PropTypes.string,
    type: PropTypes.oneOf(SUPPORTED_BLOCKS),
    elementParams: PropTypes.object
  }).isRequired,
  formData: PropTypes.object,
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
