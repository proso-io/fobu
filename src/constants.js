export const SUPPORTED_FORM_ELEMENTS = ['checkbox', 'input'];

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

export const PICK_AN_OPTION_TEXT = 'Pick an option';
