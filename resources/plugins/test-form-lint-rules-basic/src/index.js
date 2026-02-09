import { registerClientPlugin } from 'camunda-modeler-plugin-helpers';

import { rules } from './rules';

registerClientPlugin({ rules }, 'lintRules.form');
