export const config = {
  previewImageName: 'imageWithTags.png',
  controlName: 'Images with tags',
  defaultData: {
    name: '',
    label: 'Drop files here or click to add..',
    value: []
  },
  validator: (blockObj, elemNode, value) => {
    if (blockObj.required) {
      if (value.length == 0) {
        return {
          isValid: false,
          message: 'Please add atleast one image.'
        };
      } else {
        if (blockObj.tagsRequired) {
          // if any of the images passes this test => they have no tags => the validation should fail.
          return {
            isValid: !value.some(
              imageWithTags => imageWithTags.tags.length === 0
            ),
            message: 'All of the images need to have atleast one tag.'
          };
        }
      }
    } else {
      return {
        isValid: true
      };
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
        elementParams: { type: 'text', label: 'Images with tags Label' }
      },
      {
        id: 'required',
        type: 'checkbox',
        elementParams: { label: 'Is Required?', value: false }
      },
      {
        id: 'tagsRequired',
        type: 'checkbox',
        elementParams: {
          label: 'Are Tags Required For All Images?',
          value: false
        }
      }
    ]
  }
};
