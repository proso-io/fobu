import React from 'react';
import { storiesOf } from '@storybook/react';
import '../src/styling/index.scss';
import Textarea from '../src/components/Textarea';

storiesOf('Textarea', module)
  .add('with no value', () => (
    <div className="formBuilder">
      <Textarea id="try" label="Here is example one" forceChoose={true} />
    </div>
  ))
  .add('with value', () => (
    <div className="formBuilder">
      <Textarea id="try" label="Here is example one" value="option1" />
    </div>
  ))
  .add('with error string', () => (
    <div className="formBuilder">
      <Textarea
        id="try"
        errorString="There is an error with this input"
        label="Here is example one"
        value="option1"
      />
    </div>
  ));
export default {
  title: 'Textarea'
};
