import getEditableBlock from './EditableBlock';
import React from 'react';
import Input from '../Input';
import Select from '../Select';
import Checkbox from '../Checkbox';
import GroupContainer from '../GroupContainer';
import SectionContainer from '../SectionContainer';

export const EditModeInput = getEditableBlock(Input);
export const EditModeSelect = getEditableBlock(Select);
export const EditModeCheckbox = getEditableBlock(Checkbox);
export const EditModeGroupContainer = getEditableBlock(GroupContainer);
export const EditModeSectionContainer = getEditableBlock(SectionContainer);
