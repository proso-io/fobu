export const config = {
  previewImageName: 'section.png',
  controlName: 'Section',
  defaultData: {
    title: 'Your section title here',
    description: 'Any extra text that can aid the user'
  },
  settingsSchema: {
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
  }
};
