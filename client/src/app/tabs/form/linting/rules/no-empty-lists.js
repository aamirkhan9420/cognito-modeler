import { formatFormFieldReport } from '../ProblemsReporter.js';

export const execute = (node, context) => {

  const {
    reporter,
    category
  } = context;

  if (node.type === 'dynamiclist' && (!node.components || node.components.length === 0)) {
    const errorMessage = 'Dynamic lists require child components to render';
    reporter.report(formatFormFieldReport(node, errorMessage, category));
  }

  return true;
};
