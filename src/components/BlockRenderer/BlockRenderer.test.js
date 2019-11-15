import React from 'react';
import ReactDOM from 'react-dom';
import BlockRenderer from './BlockRenderer';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<BlockRenderer />, div);
});
