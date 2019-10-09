import React from 'react';
import ReactDOM from 'react-dom';
import BlockSettings from './BlockSettings';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<BlockSettings />, div);
});
