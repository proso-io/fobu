import React from 'react';
import { storiesOf } from '@storybook/react';
import TextField from '../src/components/TextField';

storiesOf('TextField', module)
  .add('with no text', () => <TextField />)
  .add('with text', () => <TextField value="daf" />);
export default {
  title: 'TextField'
};
