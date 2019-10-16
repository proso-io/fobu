import React from 'react';
import Input from '../components/Input';
import Select from '../components/Select';
import Checkbox from '../components/Checkbox';
import GroupContainer from '../components/GroupContainer';
import SectionContainer from '../components/SectionContainer';
import {
  EditModeInput,
  EditModeSelect,
  EditModeCheckbox,
  EditModeGroupContainer,
  EditModeSectionContainer
} from '../components/EditableBlock';

export function getBlockForSchema(schema, onValueChange) {
  let blockMarkup;

  switch (schema.type) {
    case 'input':
      blockMarkup = (
        <Input
          onValueChange={onValueChange}
          {...schema.elementParams}
          id={schema.id}
          key={schema.id}
        />
      );
      break;
    case 'checkbox':
      blockMarkup = (
        <Checkbox
          onValueChange={onValueChange}
          {...schema.elementParams}
          id={schema.id}
          key={schema.id}
        />
      );
      break;
    case 'select':
      blockMarkup = (
        <Select
          onValueChange={onValueChange}
          {...schema.elementParams}
          id={schema.id}
          key={schema.id}
        />
      );
      break;
    case 'group':
      blockMarkup = (
        <GroupContainer
          onValueChange={onValueChange}
          {...schema.elementParams}
          id={schema.id}
          key={schema.id}>
          {schema.children.map(childSchema => {
            return getBlockForSchema(
              childSchema,
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
        <SectionContainer
          onValueChange={onValueChange}
          {...schema.elementParams}
          id={schema.id}
          key={schema.id}>
          {schema.children.map(childSchema => {
            return getBlockForSchema(
              childSchema,
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
  onValueChange,
  onEditClickFunctions,
  selectedBlockId
) {
  let blockMarkup;

  switch (schema.type) {
    case 'input':
      blockMarkup = (
        <EditModeInput
          blockProps={{ ...schema, onValueChange: onValueChange }}
          blockSchema={schema}
          key={schema.id}
          selectedBlockId={selectedBlockId}
          onEditClickFunctions={onEditClickFunctions}
        />
      );
      break;
    case 'checkbox':
      blockMarkup = (
        <EditModeCheckbox
          blockProps={{ ...schema, onValueChange: onValueChange }}
          blockSchema={schema}
          key={schema.id}
          selectedBlockId={selectedBlockId}
          onEditClickFunctions={onEditClickFunctions}
        />
      );
      break;
    case 'select':
      blockMarkup = (
        <EditModeSelect
          blockProps={{ ...schema, onValueChange: onValueChange }}
          blockSchema={schema}
          key={schema.id}
          selectedBlockId={selectedBlockId}
          onEditClickFunctions={onEditClickFunctions}
        />
      );
      break;
    case 'group':
      blockMarkup = (
        <EditModeGroupContainer
          blockProps={{ ...schema }}
          blockSchema={schema}
          key={schema.id}
          selectedBlockId={selectedBlockId}
          onEditClickFunctions={onEditClickFunctions}
          selectable={true}
          selectedBlockId={selectedBlockId}
          onEditClickFunctions={onEditClickFunctions}>
          {schema.children.map(childSchema => {
            return getEditableBlockForSchema(
              childSchema,
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
          blockProps={{ ...schema }}
          blockSchema={schema}
          key={schema.id}
          selectedBlockId={selectedBlockId}
          onEditClickFunctions={onEditClickFunctions}
          selectable={true}
          selectedBlockId={selectedBlockId}
          onEditClickFunctions={onEditClickFunctions}>
          {schema.children.map(childSchema => {
            return getEditableBlockForSchema(
              childSchema,
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
