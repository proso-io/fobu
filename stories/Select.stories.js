import React from 'react';
import { storiesOf } from '@storybook/react';
import '../src/styling/index.scss';
import Select from '../src/components/Select';

storiesOf('Select', module)
  .add('with no value', () => (
    <div className="formBuilder">
      <Select
        id="try"
        options={[
          { value: 'option1', label: 'Option 1' },
          { value: 'option2', label: 'Option 2' }
        ]}
        label="Here is example one"
        forceChoose={true}
      />
    </div>
  ))
  .add('with value', () => (
    <div className="formBuilder">
      <Select
        id="try"
        options={[
          { value: 'option1', label: 'Option 1' },
          { value: 'option2', label: 'Option 2' }
        ]}
        label="Here is example one"
        value="option1"
      />
    </div>
  ))
  .add('with error string', () => (
    <div className="formBuilder">
      <Select
        id="try"
        errorString="There is an error with this input"
        options={[
          { value: 'option1', label: 'Option 1' },
          { value: 'option2', label: 'Option 2' }
        ]}
        label="Here is example one"
        value="option1"
      />
    </div>
  ));
export default {
  title: 'Select'
};
