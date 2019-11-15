import React from 'react';
import { storiesOf } from '@storybook/react';
import '../src/styling/index.scss';
import Tags from '../src/components/Tags';

storiesOf('Tags', module)
  .add('with no value', () => (
    <div className="formBuilder">
      <Tags id="try" label="Here is example one" />
    </div>
  ))
  .add('with value', () => (
    <div className="formBuilder">
      <Tags id="try" label="Here is example one" value={['option1']} />
    </div>
  ))
  .add('with error string', () => (
    <div className="formBuilder">
      <Tags
        id="try"
        errorString="There is an error with this input"
        label="Here is example one"
        value={['option1']}
      />
    </div>
  ));
export default {
  title: 'Tags'
};
