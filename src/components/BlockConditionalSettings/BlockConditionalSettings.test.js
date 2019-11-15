import React from 'react';
import ReactDOM from 'react-dom';
import BlockConditionalSettings from './BlockConditionalSettings';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<BlockConditionalSettings />, div);
});
