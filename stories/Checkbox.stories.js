import React from 'react';
import { storiesOf } from '@storybook/react';
import '../src/styling/index.scss';
import Checkbox from '../src/components/Checkbox';

storiesOf('Checkbox', module)
  .add('with false value', () => <div className="formBuilder"><Checkbox id="try" type="text" value={false} label="Here is example one" /></div>)
  .add('with true value', () => <div className="formBuilder"><Checkbox id="try" type="text" value={true} label="Here is example one" /></div>)
export default {
  title: 'Checkbox'
};
