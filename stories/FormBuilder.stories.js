import React from 'react';
import { storiesOf } from '@storybook/react';
import '../src/styling/index.scss';
import FormBuilder from '../src/components/FormBuilder';

storiesOf('FormBuilder', module).add('with no value', () => (
  <FormBuilder
    saveFormSchemaState="saved"
    formSchema={{
      children: [
        {
          children: [
            {
              elementParams: {
                errorString: '',
                name: 'orgname',
                value: '',
                type: 'text',
                label: 'Organization name'
              },
              type: 'input',
              id: 'section_1574738029415-input_1574738033056|orgname'
            },
            {
              elementParams: {
                errorString: '',
                name: 'location',
                value: '',
                type: 'text',
                label: 'Location'
              },
              type: 'input',
              id: 'section_1574738029415-input_1574738033584|location'
            },
            {
              elementParams: {
                errorString: '',
                value: '',
                type: 'date',
                label: 'Start date'
              },
              type: 'input',
              id: 'section_1574738029415-input_1574738034626'
            },
            {
              elementParams: {
                errorString: '',
                value: '',
                type: 'date',
                label: 'End date'
              },
              type: 'input',
              id: 'section_1574738029415-input_1574738092764'
            }
          ],
          elementParams: {
            description: 'Any extra text that can aid the user',
            errorString: '',
            title: 'General Details'
          },
          type: 'section',
          id: 'section_1574738029415'
        },
        {
          children: [
            {
              elementParams: {
                errorString: '',
                value: true,
                label: 'Is special?'
              },
              type: 'checkbox',
              id: 'section_1574738122664-checkbox_1574738129056'
            },
            {
              elementParams: {
                errorString: '',
                placeholder: 'Enter detailed text here..',
                value: '',
                rows: 5,
                cols: 40,
                label: 'Why is it special?'
              },
              type: 'textarea',
              id: 'section_1574738122664-textarea_1574738131413'
            },
            {
              elementParams: {
                errorString: '',
                value: '',
                type: 'text',
                label: 'Any other details?'
              },
              type: 'input',
              id: 'section_1574738122664-input_1574738132390'
            }
          ],
          elementParams: {
            description: 'Any extra text that can aid the user',
            errorString: '',
            title: 'Special details'
          },
          type: 'section',
          id: 'section_1574738122664'
        }
      ]
    }}
  />
));
export default {
  title: 'FormBuilder'
};
