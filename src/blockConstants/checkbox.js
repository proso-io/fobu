export const config = {
  previewImageName: 'checkbox.png',
  controlName: 'Checkbox',
  defaultData: {
    name: '',
    label: 'Your label here',
    value: true
  },
  validator: (blockObj, elemNode, value) => {
    return {
      isValid: value !== null,
      message: "Can't be null."
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
        elementParams: { type: 'text', label: 'Checkbox Label', value: false }
      }
    ]
  }
};
