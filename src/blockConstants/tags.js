export const config = {
  previewImageName: 'tags.png',
  controlName: 'Tags',
  defaultData: {
    name: 'Your internal key here',
    type: 'text',
    label: 'Your label here',
    placeholder: 'Your placeholder here',
    value: []
  },
  validator: (blockObj, elemNode, value) => {
    if (blockObj.required) {
      return {
        isValid: value.length > 0,
        message: 'Please add atleast one tag.'
      };
    } else {
      return true;
    }
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
        elementParams: { type: 'text', label: 'Tags Input Label' }
      },
      {
        id: 'placeholder',
        type: 'input',
        elementParams: { type: 'text', label: 'Tags Input Placeholder' }
      },
      {
        id: 'required',
        type: 'checkbox',
        elementParams: { label: 'Is Required?', value: false }
      }
    ]
  }
};
