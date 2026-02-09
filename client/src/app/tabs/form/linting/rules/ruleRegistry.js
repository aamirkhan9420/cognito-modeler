import { execute as executeDiscourageDisabledFields } from './discourage-disabled-fields';
import { execute as executeFormElementType } from './form-element-type';
import { execute as executeNoEmptyLists } from './no-empty-lists';
import { execute as executeNoSubmitButton } from './no-submit-button';
import { execute as executeValidateFeel } from './feel/validate-feel';

export const defaultRuleRegistry = {
  'discourage-disabled-fields': executeDiscourageDisabledFields,
  'form-element-type': executeFormElementType,
  'no-empty-lists': executeNoEmptyLists,
  'validate-feel': executeValidateFeel,
  'no-submit-button': executeNoSubmitButton
};
