import InputTypes from '../components/Input/InputTypes';

export const config = {
  previewImageName: 'input.png',
  controlName: 'Input',
  defaultData: {
    name: '',
    type: 'text',
    label: 'Your label here',
    value: ''
  },
  validator: (blockObj, elemNode, value) => {
    return {
      isValid: elemNode.checkValidity(),
      message: elemNode.validationMessage
    };
  },
  settingsSchema: {
    editMode: false,
    settingsSchema: [
      {
        id: 'name',
        type: 'input',
        elementParams: {
          type: 'text',
          label: 'Your internal key to identify this value'
        }
      },
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
  }
};
