import { config as inputConfig } from './blockConstants/input';
import { config as checkboxConfig } from './blockConstants/checkbox';
import { config as textareaConfig } from './blockConstants/textarea';
import { config as selectConfig } from './blockConstants/select';
import { config as tagsConfig } from './blockConstants/tags';
import { config as sectionConfig } from './blockConstants/section';
import { config as groupConfig } from './blockConstants/group';
import { config as imagesWithTagsConfig } from './blockConstants/imagesWithTags';

export const ID_DELIMITER = '-';

export const SUPPORTED_BLOCKS_CONFIG = {
  section: sectionConfig,
  group: groupConfig,
  input: inputConfig,
  checkbox: checkboxConfig,
  textarea: textareaConfig,
  select: selectConfig,
  tags: tagsConfig,
  imagesWithTags: imagesWithTagsConfig,
  dataSettings: {}
};

export const SUPPORTED_CONDITIONALS = [
  { label: 'Is equal to', value: '=' },
  { label: 'Is less than', value: '<' },
  { label: 'Is greater than', value: '>' },
  { label: 'Is not equal to', value: '!=' }
];

export const SUPPORTED_CONDITIONAL_FUNCTIONS = {
  '=': (value1, value2) => String(value1) === String(value2),
  '<': (value1, value2) => {
    try {
      return parseInt(value1) < parseInt(value2);
    } catch (err) {
      return false;
    }
  },
  '>': (value1, value2) => {
    try {
      return parseInt(value1) > parseInt(value2);
    } catch (err) {
      return false;
    }
  },
  '!=': (value1, value2) => value1 !== value2
};

export const SUPPORTED_BLOCKS = (function() {
  return Object.keys(SUPPORTED_BLOCKS_CONFIG);
})();

export function getValidator(inputType) {
  return SUPPORTED_BLOCKS_CONFIG[inputType].validator;
}

export function getDefaultParamsForBlock(inputType) {
  return SUPPORTED_BLOCKS_CONFIG[inputType].defaultData;
}

export function getBlockSettingsSchema(type) {
  return SUPPORTED_BLOCKS_CONFIG[type].settingsSchema;
}
