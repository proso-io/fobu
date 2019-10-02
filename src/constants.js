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

export function getDefaultParamsForFormElement(inputType) {
  switch (inputType) {
    case 'input':
      return DEFAULT_INPUT_PARAMS;
      break;
    case 'input':
      return DEFAULT_CHECKBOX_PARAMS;
      break;
    default:
  }
}
