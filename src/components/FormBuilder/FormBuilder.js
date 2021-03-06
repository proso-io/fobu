import React from 'react';
import PropTypes from 'prop-types';
import './FormBuilder.scss';
import BlockRenderer from '../BlockRenderer';
import BlockSettings from '../BlockSettings';
import BuilderHeader from './BuilderHeader';
import Modal from '../Modal';
import { validateForm } from '../../utils/formUtils';
import { getBlock } from '../../utils/commonUtils';
import {
  getDefaultParamsForBlock,
  SUPPORTED_BLOCKS_CONFIG,
  ID_DELIMITER
} from '../../constants';
import { STRINGS } from '../../strings';

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

class FormBuilder extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      formTitle: props.formTitle || '',
      editMode: true,
      formSchema: props.formSchema || { children: [] },
      formData: props.formData || {},
      editingBlockSchemaId: null,
      settingsModalOpen: false,
      selectedBlockId: null,
      activeBlockIndex: 0,
      formErrors: []
    };
    [
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

    if (!props.builderMode) {
      this.state.editMode = false;
    }
  }

  generateId(nodeType, parentId) {
    return `${
      parentId ? parentId + ID_DELIMITER : ''
    }${nodeType}_${Date.now()}`;
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
    this.setState(
      prevState => {
        let newState = JSON.parse(JSON.stringify(prevState)),
          parentBlock,
          selectedFormArea,
          newBlockId = this.generateId(blockType, parentId);

        parentBlock = getBlock(newState.formSchema, parentId);

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
          newState.activeBlockIndex = newState.formSchema.children.length - 1;
        }
        return newState;
      },
      () =>
        this.props.onFormSchemaChange({
          schema: this.state.formSchema,
          title: this.state.formTitle
        })
    );
  }

  onValueChange(id, value) {
    this.setState(
      prevState => {
        let newState = JSON.parse(JSON.stringify(prevState));
        newState.formData[id] = value;
        return newState;
      },
      () => this.props.onFormDataChange({ formData: this.state.formData })
    );
  }

  onBlockSettingsChange(blockId, elementParams) {
    this.setState(
      prevState => {
        let newState = JSON.parse(JSON.stringify(prevState));
        let block = getBlock(newState.formSchema, blockId);
        newState.formData[block.id] = getDefaultParamsForBlock(
          block.type
        ).value;
        block.elementParams = elementParams;
        // adding name to element id if its a form element. Helps in rendering.
        if (
          elementParams.name &&
          block.type !== 'section' &&
          block.type !== 'group'
        ) {
          let newId = block.id;
          if (newId.match(/\|.*/g)) {
            newId = block.id.replace(/\|.*/g, `|${elementParams.name}`);
          } else {
            newId = `${newId}|${elementParams.name}`;
          }
          block.id = newId;

          newState.editingBlockSchemaId = newId;
        }
        return newState;
      },
      () =>
        this.props.onFormSchemaChange({
          schema: this.state.formSchema,
          title: this.state.formTitle
        })
    );
  }

  settingsModalToggle() {
    this.setState({ settingsModalOpen: !this.state.settingsModalOpen });
  }

  moveArrayElement(arr, from, to) {
    arr.splice(to, 0, arr.splice(from, 1)[0]);
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

  onBlockUpClick(schema) {
    this.setState(
      prevState => {
        let newState = JSON.parse(JSON.stringify(prevState));
        let blockParent = getBlock(newState.formSchema, schema.id, null, true);

        const currentBlockIndex = blockParent.children.findIndex(
          block => block.id === schema.id
        );
        if (currentBlockIndex > 0) {
          this.moveArrayElement(
            blockParent.children,
            currentBlockIndex,
            currentBlockIndex - 1
          );
        }
        return newState;
      },
      () =>
        this.props.onFormSchemaChange({
          schema: this.state.formSchema,
          title: this.state.formTitle
        })
    );
  }

  onBlockDownClick(schema) {
    this.setState(
      prevState => {
        let newState = JSON.parse(JSON.stringify(prevState));
        let blockParent = getBlock(newState.formSchema, schema.id, null, true);

        const currentBlockIndex = blockParent.children.findIndex(
          block => block.id === schema.id
        );
        if (currentBlockIndex < blockParent.children.length - 1) {
          this.moveArrayElement(
            blockParent.children,
            currentBlockIndex,
            currentBlockIndex + 1
          );
        }
        return newState;
      },
      () =>
        this.props.onFormSchemaChange({
          schema: this.state.formSchema,
          title: this.state.formTitle
        })
    );
  }

  onBlockDeleteClick(schema) {
    this.setState(
      prevState => {
        let newState = JSON.parse(JSON.stringify(prevState));
        let blockParent = getBlock(newState.formSchema, schema.id, null, true);

        /* TODO delete any conditions that are there dependent on this element */

        delete newState.formData[schema.id];

        /* If the block being deleted was selected, we should de-select it */
        if (newState.selectedBlockId === schema.id) {
          newState.selectedBlockId = null;
        }

        const currentBlockIndex = blockParent.children.findIndex(
          block => block.id === schema.id
        );

        blockParent.children.splice(currentBlockIndex, 1);

        return newState;
      },
      () =>
        this.props.onFormSchemaChange({
          schema: this.state.formSchema,
          title: this.state.formTitle
        })
    );
  }

  onNavNextClick(e) {
    e.preventDefault();
    if (this.state.activeBlockIndex < this.state.formSchema.children.length) {
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
    this.setState({ formTitle: e.target.value }, () =>
      this.props.onFormSchemaChange({
        schema: this.state.formSchema,
        title: this.state.formTitle
      })
    );
  }

  onSubmit(e) {
    e.preventDefault();
    this.setState({ formErrors: [] });
    const errors = validateForm(this.state.formData, this.state.formSchema);
    if (errors.length > 0) {
      this.setState({ formErrors: errors });
    } else {
      if (this.props.onDataSubmit) {
        this.props.onDataSubmit(this.state.formData, this.state.formSchema);
      }
    }
  }

  getErrorsOnActivePage() {
    return this.state.formErrors.filter(
      error => error.pageId === this.state.activeBlockIndex
    ).length;
  }

  getFormMarkup(formSchema, editMode) {
    return formSchema.children.map((blockSchema, index) => {
      return (
        <div
          key={blockSchema.id}
          style={{
            display: this.state.activeBlockIndex === index ? 'block' : 'none'
          }}>
          <BlockRenderer
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
        </div>
      );
    });
  }

  setEditMode = value => {
    this.setState({ editMode: value });
  };

  render() {
    const editingBlockSchema = getBlock(
      this.state.formSchema,
      this.state.editingBlockSchemaId
    );
    const { formSchema } = this.state;
    const { className, saveFormSchemaState, builderMode } = this.props;

    return (
      <div className={`${className ? className : ''} ` + 'formBuilder'}>
        {this.props.builderMode && (
          <BuilderHeader
            blocksConfig={SUPPORTED_BLOCKS_CONFIG}
            onSaveClick={() =>
              this.props.onSchemaSubmit({
                schema: this.state.formSchema,
                title: this.state.formTitle
              })
            }
            createNewBlock={this.createNewBlock}
            setEditMode={this.setEditMode}
            editMode={this.state.editMode}
            selectedBlockId={this.state.selectedBlockId}
            saveButtonState={saveFormSchemaState}
          />
        )}
        <br />
        <div className="form__wrapper">
          <div className="form__header">
            <div className="form__title">
              {this.state.editMode ? (
                <input
                  value={this.state.formTitle}
                  onChange={this.onFormTitleValueChange}
                  className="form__titleInput"
                  placeholder="Your form title here.."
                />
              ) : (
                <h4>{this.state.formTitle}</h4>
              )}
            </div>

            <p>
              Page {this.state.activeBlockIndex + 1} of{' '}
              {formSchema.children.length ? formSchema.children.length : 1}
            </p>

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
            {this.state.formSchema.children.length > 0 && !builderMode ? (
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
  onDataSubmit: PropTypes.func.isRequired,
  onSchemaSubmit: PropTypes.func.isRequired,
  onFormSchemaChange: PropTypes.func,
  onFormDataChange: PropTypes.func,
  builderMode: PropTypes.bool,
  formData: PropTypes.object,
  formSchema: PropTypes.object,
  formTitle: PropTypes.string,
  saveFormSchemaState: PropTypes.oneOf(['saving', 'unsaved', 'saved'])
};

FormBuilder.defaultProps = {
  builderMode: true,
  formData: {},
  formSchema: { children: [] },
  onFormSchemaChange: () => {},
  onFormDataChange: () => {}
};

export default FormBuilder;
