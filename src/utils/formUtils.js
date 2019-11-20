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
import {
  EditModeInput,
  EditModeSelect,
  EditModeCheckbox,
  EditModeTextarea,
  EditModeTags,
  EditModeImagesWithTags,
  EditModeGroupContainer,
  EditModeSectionContainer
} from '../components/EditableBlock';
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
    case 'textarea':
      blockMarkup = <EditModeTextarea {...commonProps} />;
      break;
    case 'tags':
      blockMarkup = <EditModeTags {...commonProps} />;
      break;
    case 'imagesWithTags':
      blockMarkup = <EditModeImagesWithTags {...commonProps} />;
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
              formErrors,
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
              formErrors,
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

/*
  if returnParent is true, getBlock returns the parent of matched block.
*/
export function getBlock(schema, blockId, parentId, returnParent) {
  if (!blockId) {
    return schema;
  }

  let id,
    idArr = blockId.split(ID_DELIMITER),
    children = schema.children;
  if (parentId) {
    id = `${parentId}${ID_DELIMITER}${idArr[0]}`;
  } else {
    id = idArr[0];
  }
  for (var i = 0; i < children.length; i++) {
    if (children[i].id === id) {
      if (idArr.length === 1) {
        return returnParent ? schema : children[i];
      } else {
        idArr.shift();
        return getBlock(
          children[i],
          idArr.join(ID_DELIMITER),
          id,
          returnParent
        );
      }
    }
  }
}
