import React from 'react';
import ReactDOM from 'react-dom';
import GroupContainer from './GroupContainer';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(
    <GroupContainer
      id="test"
      title="Test Section"
      description="some description"
    />,
    div
  );
});
