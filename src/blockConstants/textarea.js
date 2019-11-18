export const config = {
  previewImageName: 'textarea.png',
  controlName: 'Multiline input',
  defaultData: {
    name: 'Your internal key here',
    label: 'Your label here',
    placeholder: 'Your placeholder here',
    value: '',
    cols: 40,
    rows: 5
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
        elementParams: { type: 'text', label: 'Textarea Label' }
      },
      {
        id: 'placeholder',
        type: 'input',
        elementParams: { type: 'text', label: 'Textarea Placeholder' }
      },
      {
        id: 'maxlength',
        type: 'input',
        elementParams: { type: 'number', label: 'Textarea maximum length' }
      },
      {
        id: 'rows',
        type: 'input',
        elementParams: { type: 'number', label: 'Textarea rows (height)' }
      },
      {
        id: 'cols',
        type: 'input',
        elementParams: { type: 'number', label: 'Textarea columns (width)' }
      },
      {
        id: 'required',
        type: 'checkbox',
        elementParams: { label: 'Is Required?', value: false }
      }
    ]
  }
};
