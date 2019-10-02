import React from 'react';
import PropTypes from 'prop-types';
import './FormBuilder.scss';
import SectionContainer from '../SectionContainer';
import GroupContainer from '../GroupContainer';
import InputFieldsRenderer from '../InputFieldsRenderer';
import { getDefaultParamsForFormElement } from '../../constants';

/*
1. All elements have id as - section_12324-group_345345-formElement_32343534
2. We need the user to create sections. They can't directly put in form elements.
3. Once user has created sections, they can either create groups or directly put in form elements. Fobu supports both.
4. Schema looks like below -
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

  splitFormElementId(id) {
    let idArr = id.split('-'),
      returnObj = {};
    if (idArr.length == 3) {
      // this is if the user created sections, groups and form elements
      returnObj = {
        sectionId: idArr[0],
        groupId: `${idArr[0]}-${idArr[1]}`
      };
    } else if (idArr.length == 2) {
      // this is if the user only created sections and directly put form elements in them
      returnObj = {
        sectionId: idArr[0]
      };
    }
    return returnObj;
  }

  getSectionChildrenWithId(formSchema, sectionId, defaultSection) {
    let filteredResults = formSchema.filter(
      section => section.id === sectionId
    );
    return filteredResults.length === 1
      ? filteredResults[0].children
      : defaultSection;
  }

  getGroupChildrenWithId(formSchema, sectionId, groupId, defaultGroup) {
    let selectedSectionChildren = this.getSectionChildrenWithId(
      formSchema,
      sectionId
    );
    let filteredResults = selectedSectionChildren.filter(
      group => group.id === groupId
    );
    return filteredResults.length === 1
      ? filteredResults[0].children
      : defaultGroup;
  }

  getFormElementWithId(formSchema, sectionId, groupId, formElementId) {
    let selectedGroupChildren = this.getGroupChildrenWithId(
      formSchema,
      sectionId,
      groupId
    );
    let filteredResults = selectedGroupChildren.filter(
      formElement => formElement.id === formElementId
    );
    return filteredResults.length === 1 ? filteredResults[0].children : null;
  }

  createNewSection(title, description) {
    let sectionId = this.generateId('section', '');
    let newSection = {
      id: sectionId,
      type: 'section',
      title: title,
      description: '',
      children: []
    };
    this.setState({ formSchema: [...this.state.formSchema, newSection] });
  }

  createNewGroup(sectionId, title, description) {
    this.setState(prevState => {
      let newState = JSON.parse(JSON.stringify(prevState)),
        newGroupId = this.generateId('group', sectionId),
        selectedFormArea;
      if (!sectionId) {
        selectedFormArea = newState.formSchema;
      } else {
        selectedFormArea = this.getSectionChildrenWithId(
          newState.formSchema,
          sectionId,
          newState.formSchema
        );
      }
      selectedFormArea.push({
        id: newGroupId,
        type: 'group',
        title: title,
        description: '',
        children: []
      });
      return newState;
    });
  }

  createNewFormElement(sectionId, groupId, inputType) {
    this.setState(prevState => {
      let newState = JSON.parse(JSON.stringify(prevState)),
        newFormElementId = this.generateId('formElement', groupId),
        defaultElementParams = getDefaultParamsForFormElement(inputType),
        selectedFormArea;

      if (!sectionId) {
        selectedFormArea = newState.formSchema;
      } else {
        selectedFormArea = this.getGroupChildrenWithId(
          newState.formSchema,
          sectionId,
          groupId,
          newState.formSchema
        );
      }

      newState.formData[formElementId] = defaultElementParams.value; // all default params for input elements will have a "value" field
      selectedFormArea.push({
        id: newFormElementId,
        type: inputType,
        elementParams: defaultElementParams
      });
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
