import React from 'react';
import PropTypes from 'prop-types';
import BlockRenderer from '../BlockRenderer';
import BlockConditionalSettings from '../BlockConditionalSettings';
import './BlockSettings.scss';
import { BLOCK_SETTINGS_SCHEMA, SUPPORTED_BLOCKS } from '../../constants';

/*
Given a block, this component renders the settings for that block.
On changing something here, formBuilder updates the form schema
*/
class BlockSettings extends React.Component {
  constructor(props) {
    super(props);
    const { elementParams, type } = this.props.blockSchema;
    let initialBlockSettings = BLOCK_SETTINGS_SCHEMA[type];
    let blockSettingsData = {};
    initialBlockSettings.settingsSchema.forEach(setting => {
      if (elementParams[setting.id]) {
        blockSettingsData[setting.id] = elementParams[setting.id];
      }
    });
    this.initialBlockSettings = initialBlockSettings;
    this.state = {
      blockSettingsSchema: this.initialBlockSettings.settingsSchema,
      blockSettingsData: blockSettingsData
    };
    this.onChange = this.onChange.bind(this);
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
    const { blockSchema, onBlockSettingsChange, blockId } = this.props;
    return (
      <div className="blockSettings__container">
        {this.state.blockSettingsSchema.map(settingsBlockSchema => (
          <div
            key={settingsBlockSchema.id}
            className="blockSettings__blockContainer">
            <BlockRenderer
              onValueChange={(id, value) => this.onChange(id, value)}
              blockSchema={settingsBlockSchema}
              formData={this.state.blockSettingsData}
              formErrors={[]}
              editMode={this.initialBlockSettings.editMode}
            />
          </div>
        ))}
        <BlockConditionalSettings
          id="conditions"
          conditions={blockSchema.elementParams.conditions}
          formSchema={this.props.formSchema}
          onValueChange={this.onChange}
        />
      </div>
    );
  }
}

BlockSettings.propTypes = {
  blockSchema: PropTypes.shape({
    id: PropTypes.string,
    type: PropTypes.oneOf(SUPPORTED_BLOCKS),
    elementParams: PropTypes.object
  }).isRequired,
  blockId: PropTypes.string.isRequired,
  onBlockSettingsChange: PropTypes.func.isRequired
};

BlockSettings.defaultProps = {};

export default BlockSettings;
