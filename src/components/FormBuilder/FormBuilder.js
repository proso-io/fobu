import React from 'react';
import PropTypes from 'prop-types';
import './FormBuilder.scss';
import SectionContainer from '../SectionContainer';
import GroupContainer from '../GroupContainer';
import InputFieldsRenderer from '../InputFieldsRenderer';
import FormElementSettings from '../FormElementSettings';
import { getDefaultParamsForFormElement } from '../../constants';

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

class FormBuilder extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      formSchema: [],
      formData: {},
      settingsModalOpen: false
    };
  }

  generateId(nodeType, parentId) {
    return `${parentId ? parentId + '-' : ''}${nodeType}_${Date.now()}`;
  }

  getBlock(schema, blockId, parentId) {
    let id,
      idArr = blockId.split('-'),
      children = schema.children;
    if (parentId) {
      id = `${parentId}-${idArr[0]}`;
    } else {
      id = idArr[0];
    }
    for (var i = 0; i < children.length; i++) {
      if (children[i].id === id) {
        if (idArr.length === 1) {
          return children[i];
        } else {
          idArr.shift();
          return this.getBlock(children[i], idArr.join('-'), id);
        }
      }
    }
  }

  getBlockSchema(blockType, blockParams) {
    let blockSchema = {
      id: newFormElementId,
      type: inputType
    };
    if (blockType === 'formElement') {
      const defaultElementParams = getDefaultParamsForFormElement(
        blockParams.inputType
      );
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
  Block type can be "section", "group" or "formElement"
  */
  createNewBlock(parentId, blockType, blockParams) {
    this.setState(prevState => {
      let newState = Object.assign({}, prevState),
        selectedFormArea,
        newFormElementId = this.generateId(blockType, parentId);

      selectedFormArea = this.getBlock(newState.formSchema, parentId);
      if (selectedFormArea && selectedFormArea.children) {
        selectedFormArea.children.push(
          this.getBlockSchema(blockType, blockParams)
        );
      }
      if (blockType == 'formElement') {
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
      let { sectionId, groupId } = this.splitFormElementId(formElementId);
      let formElement = this.getFormElementWithId(
        newState.formSchema,
        sectionId,
        groupId,
        formElementId
      );
      formElement.elementParams = elementParams;
      return newState;
    });
  }

  settingsModalToggle() {
    this.setState({ settingsModalOpen: !this.state.settingsModalOpen });
  }

  render() {
    return <div className="formBuilder"></div>;
  }
}

FormBuilder.propTypes = {};

FormBuilder.defaultProps = {};

export default FormBuilder;
