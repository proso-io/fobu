import React from 'react';
import ReactDOM from 'react-dom';
import EditableFormElement from './EditableFormElement';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(
    <div className="formBuilder">
      <EditableFormElement />
    </div>,
    div
  );
});
