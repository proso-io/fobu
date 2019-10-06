import React from 'react';
import { storiesOf } from '@storybook/react';
import '../src/styling/index.scss';
import FormBuilder from '../src/components/FormBuilder';

storiesOf('FormBuilder', module).add('with no value', () => (
  <div className="formBuilder">
    <FormBuilder />
  </div>
));
export default {
  title: 'FormBuilder'
};
