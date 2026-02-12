import cmp from 'semver-compare';
import { capitalize, getIndefiniteArticle } from '../util/helpers.js';
import { formatFormFieldReport } from '../ProblemsReporter.js';

const TYPE_ALLOWLIST = {
  '0.0.1': [ 'button', 'default', 'textfield' ],
  '0.1.0': [ 'checkbox', 'number', 'radio', 'select', 'text' ],
  '0.8.0': [ 'taglist', 'checklist' ],
  '0.10.0': [ 'image', 'textarea', 'datetime' ],
  '1.1.0': [ 'spacer' ],
  '1.3.0': [ 'group' ],
  '1.4.0': [ 'separator' ],
  '1.5.0': [ 'iframe' ],
  '1.6.0': [ 'dynamiclist', 'table' ],
  '1.7.0': [ 'html' ],
  '1.8.0': [ 'expression' ],
  '1.11.0': [ 'filepicker' ],
  '1.13.0': [ 'documentPreview' ],
};

export const execute = (node, context) => {

  const {
    executionPlatformLabel,
    formJSVersion,
    reporter,
    category
  } = context;

  const allowedFieldTypes = Object.entries(TYPE_ALLOWLIST).reduce((allowedFields, [ key, val ]) => {
    if (cmp(formJSVersion, key) >= 0) {
      allowedFields = [ ...allowedFields, ...val ];
    }
    return allowedFields;
  }, []);

  if (!allowedFieldTypes.includes(node.type)) {
    const errorMessage = `${ getIndefiniteArticle(node.type) } <${capitalize(node.type)}> is not supported by ${executionPlatformLabel}`;
    reporter.report(formatFormFieldReport(node, errorMessage, category));
  }

  return true;
};
