import React from 'react';
import PropTypes from 'prop-types';
import './BlockConditionalSettings.scss';
import Input from '../Input';
import Select from '../Select';
import { SUPPORTED_CONDITIONALS } from '../../constants';
import { STRINGS } from '../../strings';
import { FaMinus, FaPlus } from 'react-icons/fa';
import { flatten } from '../../utils/formUtils';

function getConditionalValues(conditionalOptions) {
  return conditionalOptions.map(condition => condition.value);
}

function getFormElementOptions(formSchema) {
  let formElements = flatten(formSchema.children);
  let options = [];
  formElements.forEach(formElement => {
    if (formElement.elementParams && formElement.elementParams.label) {
      options.push({
        label: formElement.elementParams.label,
        value: formElement.id
      });
    }
  });
  return options;
}

function BlockConditionalSettings(props) {
  const { id, conditions, formSchema, onValueChange } = props;
  const formElementOptions = getFormElementOptions(formSchema);

  function addNewCondition(e) {
    e.preventDefault();
    if (formElementOptions.length > 0) {
      onValueChange(
        id,
        [].concat(conditions, [
          { dependentOnId: '', conditional: '=', shouldHaveValue: '' }
        ])
      );
    } else {
      alert('Need some form elements to be dependent on.');
    }
  }

  function onConditionChange(id, field, fieldValue) {
    let newConditions = [].concat(conditions);
    id = id.replace(field, '');
    newConditions[id][field] = fieldValue;
    onValueChange(id, newConditions);
  }

  function deleteCondition(e, index) {
    e.preventDefault();
    let newConditions = [].concat(conditions);
    newConditions.splice(index, 1);
    onValueChange(id, newConditions);
  }

  return (
    <div className="conditionalSettings__container">
      <div className="conditionalSettings__header">
        <p className="conditionalSettings__title">
          {STRINGS.CONDITIONAL_SETTINGS_TITLE}
        </p>
      </div>
      <div className="conditionalSettings__body">
        <p className="conditionalSettings__description">
          {STRINGS.CONDITIONAL_SETTINGS_DESCRIPTION}
        </p>

        <div className="conditionalSettings__controlsContainer">
          <a
            className="conditionalSettings__control conditionalSettings__control--addOption"
            href="#"
            onClick={addNewCondition}>
            {STRINGS.ADD_NEW_CONDITION_TEXT}
          </a>
        </div>
        {conditions && conditions.length > 0 && (
          <div className="conditionalSettings__conditionsContainer">
            {conditions.map((option, index) => (
              <div
                key={'row' + index}
                className="conditionalSettings__conditionWrapper">
                <Select
                  id={'dependentOnId' + index}
                  label={STRINGS.DEPENDENT_ON_ID_LABEL}
                  value={option.dependentOnId}
                  options={formElementOptions}
                  onValueChange={(id, value) =>
                    onConditionChange(id, 'dependentOnId', value)
                  }
                />

                <Select
                  id={'conditional' + index}
                  label={STRINGS.CONDITIONAL_TYPE_LABEL}
                  value={option.conditional}
                  options={SUPPORTED_CONDITIONALS}
                  onValueChange={(id, value) =>
                    onConditionChange(id, 'conditional', value)
                  }
                />

                <Input
                  id={'shouldHaveValue' + index}
                  label={STRINGS.SHOULD_HAVE_VALUE_LABEL}
                  value={option.shouldHaveValue}
                  type="text"
                  onValueChange={(id, value) =>
                    onConditionChange(id, 'shouldHaveValue', value)
                  }
                />

                <a
                  className="conditionalSettings__control conditionalSettings__control--deleteOption"
                  href="#"
                  onClick={e => deleteCondition(e, index)}>
                  {STRINGS.DELETE_CONDITION}
                </a>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

BlockConditionalSettings.propTypes = {
  id: PropTypes.string.isRequired,
  conditions: PropTypes.arrayOf(
    PropTypes.shape({
      dependentOnId: PropTypes.string,
      conditional: PropTypes.oneOf(
        getConditionalValues(SUPPORTED_CONDITIONALS)
      ),
      shouldHaveValue: PropTypes.string
    })
  ),
  formSchema: PropTypes.object,
  onValueChange: PropTypes.func
};

BlockConditionalSettings.defaultProps = {
  conditions: [],
  onValueChange: () => {}
};

export default BlockConditionalSettings;
