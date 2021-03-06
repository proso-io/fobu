import React from 'react';
import { storiesOf } from '@storybook/react';
import '../src/styling/index.scss';
import { formDataUploader } from '../src/utils/uploadUtils';

storiesOf('Uploader', module).add('uploader to window', () => {
  return (
    <div>
      {formDataUploader(
        'https://www.mocky.io/v2/5c0452da3300005100d01d1f',
        { a: 'b', c: 'd' },
        {}
      )}
    </div>
  );
});

export default {
  title: 'Uploader'
};
