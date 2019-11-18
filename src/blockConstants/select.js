import { STRINGS } from '../strings';

export const config = {
  previewImageName: 'select.png',
  controlName: 'Select',
  defaultData: {
    name: 'Your internal key here',
    label: 'Your label here',
    value: '',
    options: [
      { value: 'option1', label: 'Option 1' },
      { value: 'option2', label: 'Option 2' }
    ]
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
  }
};
