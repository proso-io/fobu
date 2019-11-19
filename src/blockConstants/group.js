export const config = {
  previewImageName: 'group.png',
  controlName: 'Group',
  defaultData: {
    title: 'Your group title here',
    description: 'Any extra text that can aid the user'
  },
  settingsSchema: {
    editMode: false,
    settingsSchema: [
      {
        id: 'title',
        type: 'input',
        elementParams: { type: 'text', label: 'Group Title' }
      },
      {
        id: 'description',
        type: 'input',
        elementParams: { type: 'text', label: 'Group Description' }
      }
    ]
  }
};
