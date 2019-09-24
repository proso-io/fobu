import React from 'react';
import { storiesOf } from '@storybook/react';
import Input from '../src/components/Input';

storiesOf('Input', module)
  .add('with no value', () => <Input id="try" type="text" label="Here is example one" />)
  .add('with value', () => <Input id="try" type="text" label="Here is example one" value="daf" />)
  .add('with error string', () => <Input errorString="There is an error with this input" id="try" type="text" label="Here is example one" value="daf" />);
export default {
  title: 'Input'
};
