import React from 'react';
import PropTypes from 'prop-types';
import './FormBuilder.scss';
import SectionContainer from '../SectionContainer';
import GroupContainer from '../GroupContainer';
import InputFieldRenderer from '../InputFieldRenderer';
import FormElementSettings from '../FormElementSettings';
import Modal from '../Modal';
import { getDefaultParamsForFormElement, STRINGS } from '../../constants';

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
      settingsModalOpen: false
    };
    [
      'getBlock',
      'createNewBlock',
      'onValueChange',
      'onFormElementSettingsChange',
      'settingsModalToggle',
      'onFormElementUpClick',
      'onFormElementDownClick',
      'onFormElementDeleteClick',
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

  getBlockSchema(newFormElementId, blockType, blockParams) {
    let blockSchema = {
      id: newFormElementId,
      type: blockType
    };
    if (blockType !== 'section' && blockType !== 'group') {
      const defaultElementParams = getDefaultParamsForFormElement(blockType);
      blockSchema['elementParams'] = defaultElementParams;
    } else {
      blockSchema = Object.assign(blockSchema, {
        title: blockParams.title,
        description: blockParams.description,
        children: []
      });
    }
    return blockSchema;
  }

  /*
  Block type can be "section", "group" or one of SUPPORTED_FORM_ELEMENTS
  */
  createNewBlock(parentId, blockType, blockParams) {
    this.setState(prevState => {
      let newState = Object.assign({}, prevState),
        parentBlock,
        selectedFormArea,
        newFormElementId = this.generateId(blockType, parentId);

      parentBlock = this.getBlock(newState.formSchema, parentId);
      if (!parentBlock || !parentBlock.children) {
        selectedFormArea = newState.formSchema;
      } else {
        selectedFormArea = parentBlock.children;
      }
      selectedFormArea.push(
        this.getBlockSchema(newFormElementId, blockType, blockParams)
      );
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

  onFormElementSettingsChange(formElementId, elementParams) {
    this.setState(prevState => {
      let newState = JSON.parse(JSON.stringify(prevState));
      let formElement = this.getBlock(newState.formSchema, formElementId);
      formElement.elementParams = elementParams;
      return newState;
    });
  }

  settingsModalToggle() {
    this.setState({ settingsModalOpen: !this.state.settingsModalOpen });
  }

  onFormElementSettingsClick(schema) {
    this.setState({
      editingFormElementSchema: schema,
      settingsModalOpen: true
    });
  }

  onFormElementUpClick() {
    console.log('Up clicked!');
  }

  onFormElementDownClick() {
    console.log('Down clicked!');
  }

  onFormElementDeleteClick() {
    console.log('Delete clicked!');
  }

  getFormMarkup(schema, editMode) {
    if (!schema) {
      return;
    }
    return schema.map(block => {
      if (block.type === 'section') {
        return (
          <SectionContainer key={block.id} {...block}>
            {this.getFormMarkup(schema.children, editMode)}
          </SectionContainer>
        );
      } else if (block.type === 'group') {
        return (
          <GroupContainer key={block.id} {...block}>
            {this.getFormMarkup(schema.children, editMode)}
          </GroupContainer>
        );
      } else {
        return (
          <InputFieldRenderer
            key={block.id}
            formElementSchema={schema}
            editMode={editMode}
            onValueChange={this.onValueChange}
            onEditClickFunctions={{
              settings: this.onFormElementSettingsClick,
              up: this.onFormElementUpClick,
              down: this.onFormElementDownClick,
              delete: this.onFormElementDeleteClick
            }}
          />
        );
      }
    });
  }

  render() {
    const editingFormElementSchema = this.state.editingFormElementSchema;
    return (
      <div className="formBuilder">
        <button
          onClick={() =>
            this.createNewBlock(null, 'section', { title: 'New section' })
          }>
          Create new section
        </button>
        <br />
        <br />
        {this.getFormMarkup(this.state.formSchema)}
        <Modal
          open={this.state.settingsModalOpen}
          onClose={this.settingsModalToggle}
          title={STRINGS.SETTINGS_MODAL_TITLE}>
          {editingFormElementSchema.id && (
            <FormElementSettings
              formElementId={editingFormElementSchema.id}
              formElementParams={editingFormElementSchema.elementParams}
              formElementType={editingFormElementSchema.type}
              onFormElementSettingsChange={this.onFormElementSettingsChange}
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
