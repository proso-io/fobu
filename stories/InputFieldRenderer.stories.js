import React from 'react';
import { storiesOf } from '@storybook/react';
import SectionContainer from '../src/components/SectionContainer';
import GroupContainer from '../src/components/GroupContainer';
import InputFieldRenderer from '../src/components/InputFieldRenderer';
import '../src/styling/index.scss';

storiesOf('InputFieldRenderer', module)
  .add('with 2 text fields and a checkbox in editable mode', () => (
    <div className="formBuilder">
      <SectionContainer
        id="try"
        title="Example Title"
        description="This is an example description. This can run pretty long.">
        <GroupContainer
          id="try2"
          title="Example Group Title"
          description="This is an example group description and this can run long too">
          <InputFieldRenderer
            editMode={true}
            onValueChange={() => {}}
            formElementSchema={{
              id: 'section_1-group_1-formElement_1',
              type: 'input',
              elementParams: { type: 'text', label: 'Test field 1' }
            }}
          />
          <InputFieldRenderer
            editMode={true}
            onValueChange={() => {}}
            formElementSchema={{
              id: 'section_1-group_1-formElement_2',
              type: 'input',
              elementParams: { type: 'text', label: 'Test field 2' }
            }}
          />
          <InputFieldRenderer
            editMode={true}
            onValueChange={() => {}}
            formElementSchema={{
              id: 'section_1-group_1-formElement_3',
              type: 'checkbox',
              elementParams: { label: 'Test field 3' }
            }}
          />
        </GroupContainer>
      </SectionContainer>
    </div>
  ))
  .add('with 2 text fields and a checkbox in non-editable mode', () => (
    <div className="formBuilder">
      <SectionContainer
        id="try"
        title="Example Title"
        description="This is an example description. This can run pretty long.">
        <GroupContainer
          id="try2"
          title="Example Group Title"
          description="This is an example group description and this can run long too">
          <InputFieldRenderer
            editMode={false}
            onValueChange={() => {}}
            formElementSchema={{
              id: 'section_1-group_1-formElement_1',
              type: 'input',
              elementParams: { type: 'text', label: 'Test field 1' }
            }}
          />
          <InputFieldRenderer
            editMode={false}
            onValueChange={() => {}}
            formElementSchema={{
              id: 'section_1-group_1-formElement_2',
              type: 'input',
              elementParams: { type: 'text', label: 'Test field 2' }
            }}
          />
          <InputFieldRenderer
            editMode={false}
            onValueChange={() => {}}
            formElementSchema={{
              id: 'section_1-group_1-formElement_3',
              type: 'checkbox',
              elementParams: { label: 'Test field 3' }
            }}
          />
        </GroupContainer>
      </SectionContainer>
    </div>
  ));
export default {
  title: 'InputFieldsRenderer'
};
