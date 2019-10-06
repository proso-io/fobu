import React from 'react';
import ReactDOM from 'react-dom';
import InputFieldRenderer from './InputFieldRenderer';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<InputFieldRenderer />, div);
});
