import React from 'react';
import ReactDOM from 'react-dom';
import SectionContainer from './SectionContainer';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<SectionContainer id="test" title="Test Section"  />, div);
});
