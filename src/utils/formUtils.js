import React from 'react';
import Input from '../components/Input';
import Select from '../components/Select';
import Checkbox from '../components/Checkbox';
import GroupContainer from '../components/GroupContainer';
import SectionContainer from '../components/SectionContainer';
import EditableBlock from '../components/EditableBlock';

export function getBlockForSchema(
  schema,
  onValueChange,
  onEditClickFunctions,
  selectedBlockId,
  editMode
) {
  let blockMarkup;
  if (editMode) {
    // will be true if form is in form builder mode. If the form is being rendered, editMode will be false
    blockMarkup = (
      <EditableBlock
        key={schema.id}
        schema={schema}
        onValueChange={onValueChange}
        onEditClickFunctions={onEditClickFunctions}
        selectedBlockId={selectedBlockId}
      />
    );
  } else {
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
  }

  return blockMarkup;
}
