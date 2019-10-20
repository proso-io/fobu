import InputTypes from './components/Input/InputTypes';

export const SUPPORTED_BLOCKS = [
  'checkbox',
  'input',
  'select',
  'section',
  'group',
  'dataSettings'
];

export const SUPPORTED_CONDITIONALS = [
  { label: 'Is equal to', value: '=' },
  { label: 'Is less than', value: '<' },
  { label: 'Is greater than', value: '>' },
  { label: 'Is not equal to', value: '!=' }
];

export const SUPPORTED_CONDITIONAL_FUNCTIONS = {
  '=': (value1, value2) => value1 === value2,
  '<': (value1, value2) => {
    try {
      return parseInt(value1) < parseInt(value2);
    } catch (err) {
      return false;
    }
  },
  '>': (value1, value2) => {
    try {
      return parseInt(value1) > parseInt(value2);
    } catch (err) {
      return false;
    }
  },
  '!=': (value1, value2) => value1 !== value2
};

const DEFAULT_BLOCK_PARAMS = {
  input: {
    type: 'text',
    label: 'Your label here',
    value: ''
  },
  checkbox: {
    label: 'Your label here',
    value: true
  },
  select: {
    label: 'Your label here',
    value: '',
    options: [
      { value: 'option1', label: 'Option 1' },
      { value: 'option2', label: 'Option 2' }
    ]
  },
  section: {
    title: 'Your section title here',
    description: 'Any extra text that can aid the user'
  },
  group: {
    title: 'Your group title here',
    description: 'Any extra text that can aid the user'
  }
};

export function getDefaultParamsForBlock(inputType) {
  return DEFAULT_BLOCK_PARAMS[inputType];
}

export const STRINGS = {
  PICK_AN_OPTION_TEXT: 'Pick an option',
  SETTINGS_MODAL_TITLE: 'Form Element Settings',
  ELEMENT_DATA_SETTINGS_TITLE: 'Element Data Settings',
  ADD_NEW_OPTION_TEXT: 'Add new option',
  OPTION_LABEL_LABEL_TEXT: 'Your label here',
  OPTION_VALUE_LABEL_TEXT: 'Your value here',
  ADD_NEW_CONDITION_TEXT: 'Add new condition',
  CONDITIONAL_SETTINGS_TITLE: 'Advanced Settings',
  CONDITIONAL_SETTINGS_DESCRIPTION:
    'Edit this section if this field depends on some other field. You can choose the field this field depends on and what the condition of dependency is.',
  DEPENDENT_ON_ID_LABEL: 'Active field is dependent on:',
  CONDITIONAL_TYPE_LABEL: 'On the condition',
  SHOULD_HAVE_VALUE_LABEL: 'Should have value',
  DELETE_CONDITION: 'Delete condition'
};

export const BLOCK_SETTINGS_SCHEMA = {
  input: {
    editMode: false,
    settingsSchema: [
      {
        id: 'label',
        type: 'input',
        elementParams: { type: 'text', label: 'Input Label' }
      },
      {
        id: 'placeholder',
        type: 'input',
        elementParams: { type: 'text', label: 'Input Placeholder' }
      },
      {
        id: 'pattern',
        type: 'input',
        elementParams: { type: 'text', label: 'Input Validation pattern' }
      },
      {
        id: 'type',
        type: 'select',
        elementParams: {
          label: 'Input Type',
          options: InputTypes.map(inputType => ({
            value: inputType,
            label: inputType
          }))
        }
      },
      {
        id: 'required',
        type: 'checkbox',
        elementParams: { label: 'Is Required?', value: false }
      }
    ]
  },
  checkbox: {
    editMode: false,
    settingsSchema: [
      {
        id: 'label',
        type: 'input',
        elementParams: { type: 'text', label: 'Checkbox Label', value: false }
      }
    ]
  },
  select: {
    editMode: false,
    settingsSchema: [
      {
        id: 'label',
        type: 'input',
        elementParams: { type: 'text', label: 'Select Label' }
      },
      {
        id: 'forceChoose',
        type: 'checkbox',
        elementParams: {
          label: `Show "${STRINGS.PICK_AN_OPTION_TEXT}" by default?`,
          value: false
        }
      },
      {
        id: 'isRequired',
        type: 'checkbox',
        elementParams: { label: 'Is Required?', value: false }
      },
      {
        id: 'options',
        type: 'dataSettings',
        elementParams: { options: [] }
      }
    ]
  },
  section: {
    editMode: false,
    settingsSchema: [
      {
        id: 'title',
        type: 'input',
        elementParams: { type: 'text', label: 'Section Title' }
      },
      {
        id: 'description',
        type: 'input',
        elementParams: { type: 'text', label: 'Section Description' }
      }
    ]
  },
  group: {
    editMode: false,
    settingsSchema: [
      {
        id: 'title',
        type: 'input',
        elementParams: { type: 'text', label: 'Group Title' }
      },
      {
        id: 'description',
        type: 'input',
        elementParams: { type: 'text', label: 'Group Description' }
      }
    ]
  }
};
