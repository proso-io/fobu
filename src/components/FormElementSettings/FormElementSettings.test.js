import React from 'react';
import ReactDOM from 'react-dom';
import FormElementSettings from './FormElementSettings';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<FormElementSettings />, div);
});
