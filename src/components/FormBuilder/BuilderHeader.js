import React from 'react';
import Checkbox from '../Checkbox';

function BuilderHeader(props) {
  const {
    onSaveClick,
    blocksConfig,
    createNewBlock,
    editMode,
    setEditMode,
    selectedBlockId
  } = props;
  const blockKeys = Object.keys(blocksConfig);
  return (
    <div className="builderHeader">
      <div className="builderHeader__row builderHeader__titleRow">
        <h3>Form editor</h3>
        <Checkbox
          id="editMode"
          label="Edit mode"
          value={editMode}
          onValueChange={(id, value) => setEditMode(value)}
        />
        <a onClick={onSaveClick}>
          <strong>Save form</strong>
        </a>
      </div>
      <div className="builderHeader__row builderHeader__controlsRow">
        {blockKeys.map(blockKey => {
          const blockConfig = blocksConfig[blockKey];
          return (
            blockConfig.controlName && (
              <div
                key={blockKey}
                className="builderHeader__controlWrapper"
                onClick={e => createNewBlock(selectedBlockId, blockKey)}>
                <div className="builderHeader__controlImageWrapper">
                  <img
                    className="builderHeader__controlImage"
                    src={require('../../resources/' +
                      blockConfig.previewImageName)}
                  />
                </div>
                <div className="builderHeader__controlName">
                  {blockConfig.controlName}
                </div>
              </div>
            )
          );
        })}
      </div>
    </div>
  );
}

export default BuilderHeader;
