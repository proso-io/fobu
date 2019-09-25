import React from 'react';
import { storiesOf } from '@storybook/react';
import SectionContainer from '../src/components/SectionContainer';

storiesOf('SectionContainer', module)
  .add('with just title', () => <div className="formBuilder"><SectionContainer id="try" title="Example Title"></SectionContainer></div>)
  .add('with title and description', () => <div className="formBuilder"><SectionContainer id="try" title="Example Title" description="This is an example description. This can run pretty long." ></SectionContainer></div>);
export default {
  title: 'SectionContainer'
};
