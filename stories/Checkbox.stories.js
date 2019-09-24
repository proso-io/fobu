import React from 'react';
import { storiesOf } from '@storybook/react';
import Checkbox from '../src/components/Checkbox';

storiesOf('Checkbox', module)
  .add('with false value', () => <Checkbox id="try" type="text" value={false} label="Here is example one" />)
  .add('with true value', () => <Checkbox id="try" type="text" value={true} label="Here is example one" />)
export default {
  title: 'Checkbox'
};
