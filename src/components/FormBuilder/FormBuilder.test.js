import React from 'react';
import ReactDOM from 'react-dom';
import FormBuilder from './FormBuilder';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<FormBuilder />, div);
});
