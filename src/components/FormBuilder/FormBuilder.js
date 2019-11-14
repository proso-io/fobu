import React from 'react';
import PropTypes from 'prop-types';
import './FormBuilder.scss';
import BlockRenderer from '../BlockRenderer';
import BlockSettings from '../BlockSettings';
import Modal from '../Modal';
import Checkbox from '../Checkbox';
import { validateForm } from '../../utils/formUtils';
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
      formTitle: '',
      editMode: true,
      formSchema: [],
      formData: {},
      editingBlockSchemaId: null,
      settingsModalOpen: false,
      selectedBlockId: null,
      activeBlockIndex: 0,
      formErrors: []
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
      'onNavPreviousClick',
      'onFormTitleValueChange',
      'onSubmit'
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

  onNavNextClick(e) {
    e.preventDefault();
    if (this.state.activeBlockIndex < this.state.formSchema.length) {
      this.setState({ activeBlockIndex: this.state.activeBlockIndex + 1 });
    }
  }

  onNavPreviousClick(e) {
    e.preventDefault();
    if (this.state.activeBlockIndex > 0) {
      this.setState({ activeBlockIndex: this.state.activeBlockIndex - 1 });
    }
  }

  onFormTitleValueChange(e) {
    this.setState({ formTitle: e.target.value });
  }

  onSubmit(e) {
    e.preventDefault();
    this.setState({ formErrors: [] });
    const errors = validateForm(this.state.formData, this.state.formSchema);
    if (errors.length > 0) {
      this.setState({ formErrors: errors });
    }
  }

  getErrorsOnActivePage() {
    return this.state.formErrors.filter(
      error => error.pageId === this.state.activeBlockIndex
    ).length;
  }

  getFormMarkup(formSchema, editMode) {
    return formSchema.map((blockSchema, index) => {
      return this.state.activeBlockIndex === index ? (
        <BlockRenderer
          key={blockSchema.id}
          blockSchema={blockSchema}
          editMode={this.state.editMode}
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
          formErrors={this.state.formErrors}
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
        <Checkbox
          id="editMode"
          label="Edit mode"
          value={this.state.editMode}
          onValueChange={(id, value) => this.setState({ editMode: value })}
        />
        <br />
        <div className="form__wrapper">
          <div className="form__header">
            <div className="form__title">
              {this.state.editMode ? (
                <input
                  value={this.state.formTitle}
                  onChange={this.onFormTitleValueChange}
                  className="form__titleInput"
                  placeholder="Enter your form title here..."
                />
              ) : (
                <h3>{this.state.formTitle}</h3>
              )}
            </div>

            <div className="form__navigationWrapper">
              <a
                href="#"
                onClick={this.onNavPreviousClick}
                className="form__navigationLink">
                Previous
              </a>
              <a
                href="#"
                onClick={this.onNavNextClick}
                className="form__navigationLink">
                Next
              </a>
            </div>
          </div>

          {this.state.formErrors && this.state.formErrors.length > 0 && (
            <div className="form__errorsHeader">
              <div className="form__errorsTitle">
                <h5>{`${this.state.formErrors.length} errors found.`}</h5>
              </div>

              <div className="form__errorsOnPage">
                <p>{`${this.getErrorsOnActivePage()} on this page.`}</p>
              </div>
            </div>
          )}

          <div className="form__body">
            {this.getFormMarkup(this.state.formSchema, true)}
            {this.state.formSchema.length > 0 ? (
              <button onClick={this.onSubmit} className="button form__submit">
                {STRINGS.SUBMIT}
              </button>
            ) : (
              ''
            )}
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

FormBuilder.propTypes = {
  submitUrl: PropTypes.string.isRequired
};

FormBuilder.defaultProps = {};

export default FormBuilder;
