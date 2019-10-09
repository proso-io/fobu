import React from 'react';
import PropTypes from 'prop-types';
import BlockRenderer from '../BlockRenderer';
import './BlockSettings.scss';
import { BLOCK_SETTINGS_SCHEMA, SUPPORTED_BLOCKS } from '../../constants';

/*
Given a block, this component renders the settings for that block.
On changing something here, formBuilder updates the form schema
*/
function BlockSettings(props) {
  const { blockType, onBlockSettingsChange, blockParams, blockId } = props;
  const blockSettings = BLOCK_SETTINGS_SCHEMA[blockType];
  return blockSettings.settingsSchema.map(blockSchema => (
    <BlockRenderer
      onValueChange={(id, value) => {
        let changedParamMap = {};
        changedParamMap[id] = value;
        let elementParams = Object.assign({}, blockParams, changedParamMap);
        onBlockSettingsChange(blockId, elementParams);
      }}
      blockSchema={blockSchema}
      editMode={blockSettings.editMode}
    />
  ));
}

BlockSettings.propTypes = {
  blockType: PropTypes.oneOf(SUPPORTED_BLOCKS).isRequired,
  blockParams: PropTypes.object.isRequired,
  blockId: PropTypes.string.isRequired,
  onBlockSettingsChange: PropTypes.func.isRequired
};

BlockSettings.defaultProps = {};

export default BlockSettings;
