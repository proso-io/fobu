import React from 'react';
import ReactDOM from 'react-dom';
import Textarea from './Textarea';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<Textarea />, div);
});
