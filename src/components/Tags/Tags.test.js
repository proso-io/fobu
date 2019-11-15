import React from 'react';
import ReactDOM from 'react-dom';
import Tags from './Tags';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<Tags />, div);
});
