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
    let blockSettingsData = {};
    initialBlockSettings.settingsSchema = initialBlockSettings.settingsSchema.map(
      setting => {
        if (props.blockParams[setting.id]) {
          blockSettingsData[setting.id] = props.blockParams[setting.id];
        }
        return setting;
      }
    );
    this.initialBlockSettings = initialBlockSettings;
    this.state = {
      blockSettingsSchema: this.initialBlockSettings.settingsSchema,
      blockSettingsData: blockSettingsData
    };
  }

  onChange(id, value) {
    /* Following changes the displayed settings blocks */
    this.setState(
      prevState => {
        let newState = JSON.parse(JSON.stringify(prevState));
        newState.blockSettingsData[id] = value;
        return newState;
      },
      function() {
        // gets called once state is updated

        /* Following changes the block params for which the user is editing the settings */
        this.props.onBlockSettingsChange(
          this.props.blockId,
          this.state.blockSettingsData
        );
      }
    );
  }

  render() {
    const { blockType, onBlockSettingsChange, blockId } = this.props;
    return this.state.blockSettingsSchema.map(blockSchema => (
      <BlockRenderer
        key={blockSchema.id}
        onValueChange={(id, value) => this.onChange(id, value)}
        blockSchema={blockSchema}
        formData={this.state.blockSettingsData}
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
