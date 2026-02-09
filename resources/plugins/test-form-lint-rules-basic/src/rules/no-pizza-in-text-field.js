export const execute = (node, context) => {

  const {
    reporter,
    category,
    formatReport
  } = context;

  if (node.type === 'textfield') {
    if (node.defaultValue === 'pizza') {
      reporter.report(formatReport(node, 'Pizza shouldn\'t be in text field', category));
    }
  }

  return true;

};
