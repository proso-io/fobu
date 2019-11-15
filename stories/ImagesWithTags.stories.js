import React from 'react';
import { storiesOf } from '@storybook/react';
import '../src/styling/index.scss';
import ImagesWithTags from '../src/components/ImagesWithTags';

storiesOf('ImagesWithTags', module).add('with no value', () => (
  <div className="formBuilder">
    <ImagesWithTags
      id="try"
      label="Drop files here or click to upload files.."
    />
  </div>
));
export default {
  title: 'ImagesWithTags'
};
