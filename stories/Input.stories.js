import React from 'react';
import { storiesOf } from '@storybook/react';
import Input from '../src/components/Input';

storiesOf('Input', module)
  .add('with no text', () => <Input id="try" type="text" label="Here is example one" />)
  .add('with text', () => <Input id="try" type="text" label="Here is example one" value="daf" />);
export default {
  title: 'Input'
};
