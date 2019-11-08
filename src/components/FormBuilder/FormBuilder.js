import React from 'react';
import PropTypes from 'prop-types';
import './FormBuilder.scss';
import BlockRenderer from '../BlockRenderer';
import BlockSettings from '../BlockSettings';
import Modal from '../Modal';
import { getDefaultParamsForBlock, STRINGS } from '../../constants';

/*
1. All elements have id as - section_12324-group_345345-formElement_32343534
2. Section, groups and form elements are our recommended way of creating forms.
  However, all of them can be nested as desired.
3. Schema looks as below -
[
  id: section_12324,
  type: 'section',
  title: "Section Title",
  description: 'Section description',
  children: [
    {
      id: section_12324-group_345345,
      type: 'group',
      elementParams: {

      }
      title: "Group Title",
      description: 'Group description',
      children: [
        {
          id: section_12324-group_345345-formElement_32343534,
          type: "input",
          elementParams: {type: "text", label: "Your label here"}
        }
      ]
    }
  ]
]
*/
const ID_DELIMITER = '-';

class FormBuilder extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      formSchema: [],
      formData: {},
      editingBlockSchemaId: null,
      settingsModalOpen: false,
      selectedBlockId: null,
      activeBlockIndex: 0
    };
    [
      'getBlock',
      'createNewBlock',
      'onValueChange',
      'onBlockSettingsChange',
      'settingsModalToggle',
      'onBlockSettingsClick',
      'onBlockUpClick',
      'onBlockDownClick',
      'onBlockDeleteClick',
      'onBlockSelectClick',
      'getFormMarkup',
      'onNavNextClick',
      'onNavPreviousClick'
    ].forEach(fn => {
      this[fn] = this[fn].bind(this);
    });
  }

  generateId(nodeType, parentId) {
    return `${
      parentId ? parentId + ID_DELIMITER : ''
    }${nodeType}_${Date.now()}`;
  }

  getBlock(schema, blockId, parentId) {
    if (!blockId) {
      return schema;
    }

    let id,
      idArr = blockId.split(ID_DELIMITER),
      children = schema.children;
    if (parentId) {
      id = `${parentId}${ID_DELIMITER}${idArr[0]}`;
    } else {
      id = idArr[0];
    }
    for (var i = 0; i < children.length; i++) {
      if (children[i].id === id) {
        if (idArr.length === 1) {
          return children[i];
        } else {
          idArr.shift();
          return this.getBlock(children[i], idArr.join(ID_DELIMITER), id);
        }
      }
    }
  }

  getBlockSchema(newBlockId, blockType) {
    let blockSchema = {
      id: newBlockId,
      type: blockType
    };
    const defaultElementParams = getDefaultParamsForBlock(blockType);
    blockSchema['elementParams'] = defaultElementParams;

    if (blockType === 'section' || blockType === 'group') {
      blockSchema['children'] = [];
    }
    return blockSchema;
  }

  /*
  Block type can be "section", "group" or one of SUPPORTED_FORM_ELEMENTS
  */
  createNewBlock(parentId, blockType) {
    this.setState(prevState => {
      let newState = Object.assign({}, prevState),
        parentBlock,
        selectedFormArea,
        newBlockId = this.generateId(blockType, parentId);

      parentBlock = this.getBlock({ children: newState.formSchema }, parentId);

      selectedFormArea = parentBlock.children;

      const blockSchema = this.getBlockSchema(newBlockId, blockType);
      selectedFormArea.push(blockSchema);
      if (blockType !== 'section' && blockType !== 'group') {
        newState.formData[newBlockId] = blockSchema.elementParams.value;
      } else {
        newState.selectedBlockId = newBlockId;
      }

      if (!parentId) {
        // top-level form blocks can be active on a given page, no matter what they are.
        newState.activeBlockIndex = newState.formSchema.length - 1;
      }

      return newState;
    });
  }

  onValueChange(id, value) {
    this.setState(prevState => {
      let newState = JSON.parse(JSON.stringify(prevState));
      newState.formData[id] = value;
      return newState;
    });
  }

  onBlockSettingsChange(blockId, elementParams) {
    this.setState(prevState => {
      let newState = JSON.parse(JSON.stringify(prevState));
      let block = this.getBlock({ children: newState.formSchema }, blockId);
      newState.formData[block.id] = getDefaultParamsForBlock(block.type).value;
      block.elementParams = elementParams;
      return newState;
    });
  }

  settingsModalToggle() {
    this.setState({ settingsModalOpen: !this.state.settingsModalOpen });
  }

  onBlockSettingsClick(schema) {
    this.setState({
      editingBlockSchemaId: schema.id,
      settingsModalOpen: true
    });
  }

  onBlockSelectClick(schema) {
    this.setState({
      selectedBlockId:
        schema.id === this.state.selectedBlockId ? null : schema.id
    });
  }

  onBlockUpClick() {
    console.log('Up clicked!');
  }

  onBlockDownClick() {
    console.log('Down clicked!');
  }

  onBlockDeleteClick() {
    console.log('Delete clicked!');
  }

  onNavNextClick() {
    if (this.state.activeBlockIndex < this.state.formSchema.length) {
      this.setState({ activeBlockIndex: this.state.activeBlockIndex + 1 });
    }
  }

  onNavPreviousClick() {
    if (this.state.activeBlockIndex > 0) {
      this.setState({ activeBlockIndex: this.state.activeBlockIndex - 1 });
    }
  }

  getFormMarkup(formSchema, editMode) {
    return formSchema.map((blockSchema, index) => {
      return this.state.activeBlockIndex === index ? (
        <BlockRenderer
          key={blockSchema.id}
          blockSchema={blockSchema}
          editMode={editMode}
          onValueChange={this.onValueChange}
          onEditClickFunctions={{
            settings: this.onBlockSettingsClick,
            up: this.onBlockUpClick,
            down: this.onBlockDownClick,
            delete: this.onBlockDeleteClick,
            select: this.onBlockSelectClick
          }}
          selectedBlockId={this.state.selectedBlockId}
          formData={this.state.formData}
        />
      ) : (
        ''
      );
    });
  }

  render() {
    const editingBlockSchema = this.getBlock(
      { children: this.state.formSchema },
      this.state.editingBlockSchemaId
    );
    return (
      <div className="formBuilder">
        <button
          onClick={() =>
            this.createNewBlock(this.state.selectedBlockId, 'section')
          }>
          Create new section
        </button>
        <button
          onClick={() =>
            this.createNewBlock(this.state.selectedBlockId, 'group')
          }>
          Create new group
        </button>
        <button
          onClick={() =>
            this.createNewBlock(this.state.selectedBlockId, 'input')
          }>
          Create new input element
        </button>
        <button
          onClick={() =>
            this.createNewBlock(this.state.selectedBlockId, 'checkbox')
          }>
          Create new checkbox
        </button>
        <button
          onClick={() =>
            this.createNewBlock(this.state.selectedBlockId, 'select')
          }>
          Create new select element
        </button>
        <button
          onClick={() =>
            this.createNewBlock(this.state.selectedBlockId, 'textarea')
          }>
          Create new textarea element
        </button>
        <button
          onClick={() =>
            this.createNewBlock(this.state.selectedBlockId, 'tags')
          }>
          Create new tags input element
        </button>
        <button
          onClick={() =>
            this.createNewBlock(this.state.selectedBlockId, 'imagesWithTags')
          }>
          Create new images with tags input element
        </button>
        <br />
        <br />
        <div className="form__wrapper">
          <div className="form__header">
            <div className="form__title">
              <h3>Form title</h3>
            </div>

            <div className="form__navigationWrapper">
              <a
                onClick={this.onNavPreviousClick}
                className="form__navigationLink">
                Previous
              </a>
              <a onClick={this.onNavNextClick} className="form__navigationLink">
                Next
              </a>
            </div>
          </div>
          <div className="form__body">
            {this.getFormMarkup(this.state.formSchema, true)}
            <button className="button">{STRINGS.SUBMIT}</button>
          </div>
        </div>
        <Modal
          open={this.state.settingsModalOpen}
          onClose={this.settingsModalToggle}
          title={STRINGS.SETTINGS_MODAL_TITLE}>
          {this.state.settingsModalOpen && (
            <BlockSettings
              blockId={this.state.editingBlockSchemaId}
              blockSchema={editingBlockSchema}
              onBlockSettingsChange={this.onBlockSettingsChange}
              formSchema={this.state.formSchema}
            />
          )}
        </Modal>
      </div>
    );
  }
}

FormBuilder.propTypes = {};

FormBuilder.defaultProps = {};

export default FormBuilder;
