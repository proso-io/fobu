import React from 'react';
import EditableFormElement from '../components/EditableFormElement';
import Input from '../components/Input';
import Checkbox from '../components/Checkbox';

export function getFormElementForSchema(
  schema,
  onValueChange,
  editMode,
  onEditClickFunctions
) {
  let formElementSchema;
  if (editMode) {
    // will be true if form is in form builder mode. If the form is being rendered, editMode will be false
    formElementSchema = (
      <EditableFormElement
        schema={schema}
        onValueChange={onValueChange}
        onEditClickFunctions={onEditClickFunctions}
      />
    );
  } else {
    switch (schema.type) {
      case 'input':
        formElementSchema = (
          <Input
            onValueChange={onValueChange}
            {...schema.elementParams}
            id={schema.id}
          />
        );
        break;
      case 'checkbox':
        formElementSchema = (
          <Checkbox
            onValueChange={onValueChange}
            {...schema.elementParams}
            id={schema.id}
          />
        );
        break;
      default:
        formElementSchema = '';
    }
  }

  return formElementSchema;
}
