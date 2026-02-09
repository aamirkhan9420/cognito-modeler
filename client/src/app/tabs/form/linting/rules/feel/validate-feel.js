import { formatFormFieldReport } from '../../ProblemsReporter.js';
import { lintExpression } from '@bpmn-io/feel-lint';

export const execute = (node, context) => {

  const {
    reporter,
    category
  } = context;

  Object.entries(node).forEach(([ propertyName, value ]) => {
    if (isFeelValue([ propertyName, value ])) {
      const lintErrors = lintExpression(value.substring(1));

      // syntax error
      if (lintErrors.find(({ type }) => type === 'Syntax Error')) {
        const errorMessage = `Invalid FEEL expression in <${ propertyName }>`;
        reporter.report(formatFormFieldReport(node, errorMessage, category));
      }
    }
  });

  return true;
};

const isFeelValue = ([ key, value ]) => typeof value === 'string' && value.startsWith('=');
