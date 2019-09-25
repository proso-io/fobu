import React from 'react';
import { storiesOf } from '@storybook/react';
import SectionContainer from '../src/components/SectionContainer';
import GroupContainer from '../src/components/GroupContainer';
import Input from '../src/components/Input';

storiesOf('GroupContainer', module)
  .add('with title and description under a section', () =>
    <div className="formBuilder">
      <SectionContainer id="try" title="Example Title" description="This is an example description. This can run pretty long." >
        <GroupContainer id="try2" title="Example Group Title" description="this is an example group description and this can run long too">
          <Input id="1" type="text" label="Here is example one" value="daf" />
          <Input id="2" type="text" label="Here is example two" value="dsf" />
        </GroupContainer>
      </SectionContainer>
    </div>);
export default {
  title: 'GroupContainer'
};
