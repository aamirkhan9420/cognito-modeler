export const execute = (node, context) => {

  const {
    reporter,
    category,
    formatReport
  } = context;

  if (node.type === 'dynamiclist' && node.components && node.components.length > 0) {
    const numberComponent = node.components.find(c => c.type === 'number');
    if (numberComponent) {
      reporter.report(formatReport(node, 'Number components are not allowed in dynamic lists', category));
    }
  }

  return true;

};
