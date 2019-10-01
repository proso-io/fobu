import React from 'react';
import { storiesOf } from '@storybook/react';
import '../src/styling/index.scss';
import Modal from '../src/components/Modal';

storiesOf('Modal', module)
  .add('with no footer children', () => (
    <div className="formBuilder">
      <Modal open={true} title="Sample Modal"></Modal>
    </div>
  ))
  .add('with footer children', () => (
    <div className="formBuilder">
      <Modal
        open={true}
        title="Sample Modal"
        footerChildren={<button>Save</button>}></Modal>
    </div>
  ));
export default {
  title: 'Modal'
};
