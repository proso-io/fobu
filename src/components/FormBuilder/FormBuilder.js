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
      editingFormElementSchema: {},
      settingsModalOpen: false,
      selectedBlockId: null
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
      'getFormMarkup'
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

  getBlockSchema(newFormElementId, blockType) {
    let blockSchema = {
      id: newFormElementId,
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
        newFormElementId = this.generateId(blockType, parentId);

      parentBlock = this.getBlock({ children: newState.formSchema }, parentId);

      selectedFormArea = parentBlock.children;

      const blockParams = this.getBlockSchema(newFormElementId, blockType);
      selectedFormArea.push(blockParams);
      if (blockType !== 'section' && blockType !== 'group') {
        newState.formData[newFormElementId] = blockParams.value;
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

  onBlockSettingsChange(formElementId, elementParams) {
    console.log(formElementId, elementParams);
    this.setState(prevState => {
      let newState = JSON.parse(JSON.stringify(prevState));
      let formElement = this.getBlock(
        { children: newState.formSchema },
        formElementId
      );
      formElement.elementParams = elementParams;
      return newState;
    });
  }

  settingsModalToggle() {
    this.setState({ settingsModalOpen: !this.state.settingsModalOpen });
  }

  onBlockSettingsClick(schema) {
    this.setState({
      editingFormElementSchema: schema,
      settingsModalOpen: true
    });
  }

  onBlockSelectClick(schema) {
    this.setState({ selectedBlockId: schema.id });
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

  getFormMarkup(formSchema, editMode) {
    return formSchema.map(blockSchema => {
      return (
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
        />
      );
    });
  }

  render() {
    const editingFormElementSchema = this.state.editingFormElementSchema;
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
        <br />
        <br />
        {this.getFormMarkup(this.state.formSchema, true)}
        <Modal
          open={this.state.settingsModalOpen}
          onClose={this.settingsModalToggle}
          title={STRINGS.SETTINGS_MODAL_TITLE}>
          {editingFormElementSchema.id && (
            <BlockSettings
              blockId={editingFormElementSchema.id}
              blockParams={editingFormElementSchema.elementParams}
              blockType={editingFormElementSchema.type}
              onBlockSettingsChange={this.onBlockSettingsChange}
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
