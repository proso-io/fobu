import React from 'react';
import ReactDOM from 'react-dom';
import Input from './Input';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<Input type="text" value="hello world" id="test" label="test label"  />, div);
});
