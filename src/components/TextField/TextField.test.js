import React from 'react';
import ReactDOM from 'react-dom';
import TextField from './TextField';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<TextField />, div);
});
