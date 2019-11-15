import React from 'react';
import ReactDOM from 'react-dom';
import FilesWithTags from './FilesWithTags';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<FilesWithTags />, div);
});
