import { execute as noNumberInDynamicList } from './no-number-in-dynamic-list';
import { execute as noPizzaInTextField } from './no-pizza-in-text-field';

export const rules = {
  'no-number-in-dynamic-list': { execute: noNumberInDynamicList, config: { severity: 'error', before: '1.20.0' } },
  'no-pizza-in-text-field': { execute: noPizzaInTextField, config: { severity: 'warn', before: '1.20.0' } },
};
