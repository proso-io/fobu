import InputTypes from './components/Input/InputTypes';

export const SUPPORTED_FORM_ELEMENTS = ['checkbox', 'input', 'select'];

const DEFAULT_INPUT_PARAMS = {
  type: 'text',
  label: 'Your label here',
  value: ''
};

const DEFAULT_CHECKBOX_PARAMS = {
  label: 'Your label here',
  value: true
};

const DEFAULT_SELECT_PARAMS = {
  label: 'Your label here',
  value: '',
  options: [
    { value: 'option1', label: 'Option 1' },
    { value: 'option2', label: 'Option 2' }
  ]
};

export function getDefaultParamsForFormElement(inputType) {
  switch (inputType) {
    case 'input':
      return DEFAULT_INPUT_PARAMS;
      break;
    case 'checkbox':
      return DEFAULT_CHECKBOX_PARAMS;
      break;
    case 'select':
      return DEFAULT_SELECT_PARAMS;
      break;
    default:
  }
}

export const STRINGS = {
  PICK_AN_OPTION_TEXT: 'Pick an option',
  SETTINGS_MODAL_TITLE: 'Form Element Settings'
};

export const FORM_ELEMENTS_SETTINGS_SCHEMA = {
  input: {
    editMode: false,
    formElementSchemas: [
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
        id: 'required',
        type: 'checkbox',
        elementParams: { label: 'Is Required?' }
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
      }
    ]
  },
  checkbox: {
    editMode: false,
    formElementSchemas: [
      {
        id: 'label',
        type: 'input',
        elementParams: { type: 'text', label: 'Checkbox Label' }
      }
    ]
  },
  select: {
    editMode: false,
    formElementSchemas: [
      {
        id: 'label',
        type: 'input',
        elementParams: { type: 'text', label: 'Select Label' }
      },
      {
        id: 'forceChoose',
        type: 'checkbox',
        elementParams: {
          label: `Show ${STRINGS.PICK_AN_OPTION_TEXT} by default?`
        }
      },
      {
        id: 'multiple',
        type: 'checkbox',
        elementParams: { label: 'Allow to pick multiple options?' }
      },
      {
        id: 'isRequired',
        type: 'checkbox',
        elementParams: { label: 'Is Required?' }
      }
    ]
  }
};
