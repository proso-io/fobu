import React from 'react';
import ReactDOM from 'react-dom';
import BlockDataSettings from './BlockDataSettings';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<BlockDataSettings />, div);
});
