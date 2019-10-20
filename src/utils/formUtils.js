import React from 'react';
import Input from '../components/Input';
import Select from '../components/Select';
import Checkbox from '../components/Checkbox';
import GroupContainer from '../components/GroupContainer';
import SectionContainer from '../components/SectionContainer';
import BlockDataSettings from '../components/BlockDataSettings';
import {
  EditModeInput,
  EditModeSelect,
  EditModeCheckbox,
  EditModeGroupContainer,
  EditModeSectionContainer
} from '../components/EditableBlock';
import { SUPPORTED_CONDITIONAL_FUNCTIONS } from '../constants';

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

export function getBlockForSchema(schema, formData, onValueChange) {
  let blockMarkup;

  const shouldRender = applyConditions(schema, formData);
  if (!shouldRender) {
    return <React.Fragment key={schema.id}></React.Fragment>;
  }

  if (formData.hasOwnProperty(schema.id)) {
    // this condition applies to form elements. They have value.
    schema.elementParams.value = formData[schema.id];
  }

  const commonProps = {
    onValueChange: onValueChange,
    ...schema.elementParams,
    id: schema.id,
    key: schema.id
  };

  switch (schema.type) {
    case 'input':
      blockMarkup = <Input {...commonProps} />;
      break;
    case 'checkbox':
      blockMarkup = <Checkbox {...commonProps} />;
      break;
    case 'select':
      blockMarkup = <Select {...commonProps} />;
      break;
    case 'dataSettings':
      blockMarkup = <BlockDataSettings {...commonProps} />;
      break;
    case 'group':
      blockMarkup = (
        <GroupContainer {...commonProps}>
          {schema.children.map(childSchema => {
            return getBlockForSchema(
              childSchema,
              formData,
              onValueChange,
              onEditClickFunctions,
              selectedBlockId,
              editMode
            );
          })}
        </GroupContainer>
      );
      break;
    case 'section':
      blockMarkup = (
        <SectionContainer {...commonProps}>
          {schema.children.map(childSchema => {
            return getBlockForSchema(
              childSchema,
              formData,
              onValueChange,
              onEditClickFunctions,
              selectedBlockId,
              editMode
            );
          })}
        </SectionContainer>
      );
      break;
    default:
      blockMarkup = '';
  }

  return blockMarkup;
}

export function getEditableBlockForSchema(
  schema,
  formData,
  onValueChange,
  onEditClickFunctions,
  selectedBlockId
) {
  let blockMarkup;

  const shouldRender = applyConditions(schema, formData);
  if (!shouldRender) {
    return <React.Fragment key={schema.id}></React.Fragment>;
  }

  if (formData.hasOwnProperty(schema.id)) {
    // this condition applies to form elements. They have value.
    schema.elementParams.value = formData[schema.id];
  }

  const commonProps = {
    blockProps: { ...schema, onValueChange: onValueChange },
    blockSchema: schema,
    key: schema.id,
    selectedBlockId: selectedBlockId,
    onEditClickFunctions: onEditClickFunctions
  };

  switch (schema.type) {
    case 'input':
      blockMarkup = <EditModeInput {...commonProps} />;
      break;
    case 'checkbox':
      blockMarkup = <EditModeCheckbox {...commonProps} />;
      break;
    case 'select':
      blockMarkup = <EditModeSelect {...commonProps} />;
      break;
    case 'group':
      blockMarkup = (
        <EditModeGroupContainer
          {...commonProps}
          selectable={true}
          selectedBlockId={selectedBlockId}>
          {schema.children.map(childSchema => {
            return getEditableBlockForSchema(
              childSchema,
              formData,
              onValueChange,
              onEditClickFunctions,
              selectedBlockId
            );
          })}
        </EditModeGroupContainer>
      );
      break;
    case 'section':
      blockMarkup = (
        <EditModeSectionContainer
          {...commonProps}
          selectable={true}
          selectedBlockId={selectedBlockId}>
          {schema.children.map(childSchema => {
            return getEditableBlockForSchema(
              childSchema,
              formData,
              onValueChange,
              onEditClickFunctions,
              selectedBlockId
            );
          })}
        </EditModeSectionContainer>
      );
      break;
    default:
      blockMarkup = '';
  }

  return blockMarkup;
}
