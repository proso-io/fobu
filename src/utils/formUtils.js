import React from 'react';
import Input from '../components/Input';
import Select from '../components/Select';
import Checkbox from '../components/Checkbox';
import Textarea from '../components/Textarea';
import Tags from '../components/Tags';
import ImagesWithTags from '../components/ImagesWithTags';

import GroupContainer from '../components/GroupContainer';
import SectionContainer from '../components/SectionContainer';
import BlockDataSettings from '../components/BlockDataSettings';
import EditableBlock from '../components/EditableBlock';
import {
  SUPPORTED_CONDITIONAL_FUNCTIONS,
  ID_DELIMITER,
  getValidator
} from '../constants';

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

function getInputError(inputId, formErrors) {
  return formErrors.filter(error => error.inputId === inputId);
}

export function getBlockForSchema(schema, formData, onValueChange, formErrors) {
  let blockMarkup;

  const shouldRender = applyConditions(schema, formData);
  if (!shouldRender) {
    return <React.Fragment key={schema.id}></React.Fragment>;
  }

  if (formData.hasOwnProperty(schema.id)) {
    // this condition applies to form elements. They have value.
    schema.elementParams.value = formData[schema.id];
  }

  const errorObjs = getInputError(schema.id, formErrors);
  if (errorObjs.length === 1) {
    schema.elementParams.errorString = errorObjs[0].error;
  } else {
    schema.elementParams.errorString = '';
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
    case 'textarea':
      blockMarkup = <Textarea {...commonProps} />;
      break;
    case 'tags':
      blockMarkup = <Tags {...commonProps} />;
      break;
    case 'imagesWithTags':
      blockMarkup = <ImagesWithTags {...commonProps} />;
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
              formErrors
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
              formErrors
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
  formErrors,
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

  const errorObjs = getInputError(schema.id, formErrors);
  if (errorObjs.length === 1) {
    schema.elementParams.errorString = errorObjs[0].error;
  } else {
    schema.elementParams.errorString = '';
  }

  const editableBlockProps = {
    blockId: schema.id,
    blockSchema: schema,
    key: schema.id,
    selectedBlockId: selectedBlockId,
    onEditClickFunctions: onEditClickFunctions
  };

  const blockProps = {
    onValueChange: onValueChange,
    ...schema.elementParams,
    id: schema.id,
    key: schema.id
  };

  switch (schema.type) {
    case 'input':
      blockMarkup = (
        <EditableBlock {...editableBlockProps}>
          <Input {...blockProps} />
        </EditableBlock>
      );
      break;
    case 'checkbox':
      blockMarkup = (
        <EditableBlock {...editableBlockProps}>
          <Checkbox {...blockProps} />
        </EditableBlock>
      );
      break;
    case 'select':
      blockMarkup = (
        <EditableBlock {...editableBlockProps}>
          <Select {...blockProps} />
        </EditableBlock>
      );
      break;
    case 'textarea':
      blockMarkup = (
        <EditableBlock {...editableBlockProps}>
          <Textarea {...blockProps} />
        </EditableBlock>
      );
      break;
    case 'tags':
      blockMarkup = (
        <EditableBlock {...editableBlockProps}>
          <Tags {...blockProps} />
        </EditableBlock>
      );
      break;
    case 'imagesWithTags':
      blockMarkup = (
        <EditableBlock {...editableBlockProps}>
          <ImagesWithTags {...blockProps} />
        </EditableBlock>
      );
      break;
    case 'group':
      blockMarkup = (
        <EditableBlock
          {...editableBlockProps}
          selectable={true}
          selectedBlockId={selectedBlockId}>
          <GroupContainer {...blockProps}>
            {schema.children.map(childSchema => {
              return getEditableBlockForSchema(
                childSchema,
                formData,
                onValueChange,
                formErrors,
                onEditClickFunctions,
                selectedBlockId
              );
            })}
          </GroupContainer>
        </EditableBlock>
      );
      break;
    case 'section':
      blockMarkup = (
        <EditableBlock
          {...editableBlockProps}
          selectable={true}
          selectedBlockId={selectedBlockId}>
          <SectionContainer {...blockProps}>
            {schema.children.map(childSchema => {
              return getEditableBlockForSchema(
                childSchema,
                formData,
                onValueChange,
                formErrors,
                onEditClickFunctions,
                selectedBlockId
              );
            })}
          </SectionContainer>
        </EditableBlock>
      );
      break;
    default:
      blockMarkup = '';
  }

  return blockMarkup;
}

export function chunkArray(arr, n) {
  return arr.reduce((all, cur, i) => {
    const ch = Math.floor(i / n);
    all[ch] = [].concat(all[ch] || [], cur);
    return all;
  }, []);
}

function shouldFlatten(block) {
  return block.children && block.children.length > 0;
}

export function flatten(arr) {
  return arr.reduce(function(flat, block) {
    return flat.concat(shouldFlatten(block) ? flatten(block.children) : block);
  }, []);
}

export function validateForm(formData, formSchema) {
  /*
    errors: [
      {
        pageId: 1,
        inputId: "asfkbkjdf",
        error: "Can't be empty.."
      }
    ]
  */

  let errors = [],
    formElements,
    pageErrors = [];

  formSchema.children.forEach((block, index) => {
    if (block.children) {
      formElements = flatten(block.children);
    } else {
      formElements = [block];
    }

    let pageErrors = [];
    formElements.forEach(formElement => {
      const value = formData[formElement.id];
      const elemNode = document.getElementById(formElement.id);
      const validatorFn = getValidator(formElement.type);
      const validObj = validatorFn(formElement.elementParams, elemNode, value);

      if (!validObj.isValid) {
        pageErrors.push({
          pageId: index,
          inputId: formElement.id,
          error: validObj.message
        });
      }
    });

    errors = errors.concat(pageErrors);
  });

  return errors;
}
