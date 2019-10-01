import React from 'react';
import { storiesOf } from '@storybook/react';
import '../src/styling/index.scss';
import Input from '../src/components/Input';

storiesOf('Input', module)
  .add('with no value', () => (
    <div className="formBuilder">
      <Input id="try" type="text" label="Here is example one" />
    </div>
  ))
  .add('with value', () => (
    <div className="formBuilder">
      <Input id="try" type="text" label="Here is example one" value="daf" />
    </div>
  ))
  .add('with error string', () => (
    <div className="formBuilder">
      <Input
        errorString="There is an error with this input"
        id="try"
        type="text"
        label="Here is example one"
        value="daf"
      />
    </div>
  ));
export default {
  title: 'Input'
};
