import { formatFormFieldReport } from '../ProblemsReporter.js';

export const execute = (node, context) => {

  const {
    reporter,
    category
  } = context;

  if (node.disabled) {
    const errorMessage = 'The use of disabled fields is not recommended due to accessibility concerns. We advise using read-only instead.';
    reporter.report(formatFormFieldReport(node, errorMessage, category));
  }

  return true;
};
