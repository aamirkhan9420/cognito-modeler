import ProblemsReporter from '../ProblemsReporter';

describe('tabs/form/linting - ProblemsReporter', function() {

  describe('report', function() {

    it('should append new report to report list', function() {

      // given
      const report = {
        'id': 'test_dynamiclist',
        'label': 'Dynamic List',
        'message': 'Dynamic lists require child components to render',
        'category': 'warn'
      };
      const problemsReporter = new ProblemsReporter();
      expect(problemsReporter.getReports()).to.eql([]);

      // when
      problemsReporter.report(report);

      // then
      expect(problemsReporter.getReports()).to.eql([
        {
          'id': 'test_dynamiclist',
          'label': 'Dynamic List',
          'message': 'Dynamic lists require child components to render',
          'category': 'warn'
        }
      ]);

    });

  });

});

