import React, { useState } from 'react';
import PropTypes from 'prop-types';
import BlockRenderer from '../BlockRenderer';
import './BlockSettings.scss';
import { BLOCK_SETTINGS_SCHEMA, SUPPORTED_BLOCKS } from '../../constants';

/*
Given a block, this component renders the settings for that block.
On changing something here, formBuilder updates the form schema
*/
class BlockSettings extends React.Component {
  constructor(props) {
    super(props);
    let initialBlockSettings = BLOCK_SETTINGS_SCHEMA[this.props.blockType];
    initialBlockSettings.settingsSchema = initialBlockSettings.settingsSchema.map(
      setting => {
        if (props.blockParams[setting.id]) {
          setting.elementParams.value = props.blockParams[setting.id];
        }
        return setting;
      }
    );
    this.initialBlockSettings = initialBlockSettings;
    this.state = {
      blockSettingsSchema: this.initialBlockSettings.settingsSchema
    };
  }

  onChange(id, value) {
    let changedParamMap = {};
    changedParamMap[id] = value;

    /* Following changes the displayed settings blocks */
    let newBlockSettingsSchema = [].concat(this.state.blockSettingsSchema);
    let changedBlockSettingArr = newBlockSettingsSchema.filter(
      schema => schema.id === id
    );
    if (changedBlockSettingArr && changedBlockSettingArr.length === 1) {
      let changedBlockSetting = changedBlockSettingArr[0];
      changedBlockSetting.elementParams = Object.assign(
        {},
        changedBlockSetting.elementParams,
        { value: value }
      );
      this.setState({ blockSettingsSchema: newBlockSettingsSchema });
    }

    /* Following changes the block params for which the user is editing the settings */
    let elementParams = Object.assign(
      {},
      this.props.blockParams,
      changedParamMap
    );
    this.props.onBlockSettingsChange(this.props.blockId, elementParams);
  }

  render() {
    const { blockType, onBlockSettingsChange, blockId } = this.props;
    return this.state.blockSettingsSchema.map(blockSchema => (
      <BlockRenderer
        key={blockSchema.id}
        onValueChange={(id, value) => this.onChange(id, value)}
        blockSchema={blockSchema}
        editMode={this.initialBlockSettings.editMode}
      />
    ));
  }
}

BlockSettings.propTypes = {
  blockType: PropTypes.oneOf(SUPPORTED_BLOCKS).isRequired,
  blockParams: PropTypes.object.isRequired,
  blockId: PropTypes.string.isRequired,
  onBlockSettingsChange: PropTypes.func.isRequired
};

BlockSettings.defaultProps = {};

export default BlockSettings;
