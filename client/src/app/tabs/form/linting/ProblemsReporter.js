import { textToLabel } from './util/helpers';

export default class ProblemsReporter {
  constructor() {
    this.reports = [];
  }

  report(report) {
    this.reports = [ ...this.reports, report ];
  }

  getReports() { return this.reports; }

}

export function formatFormFieldReport(formField, message, category) {
  const { id, label, text } = formField;
  return { id, label: label || (text && textToLabel(text)) || id, message, category };
}

