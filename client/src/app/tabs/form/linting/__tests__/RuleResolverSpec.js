import RuleResolver from '../RuleResolver';

describe('tabs/form/linting - RuleResolver', function() {

  describe('resolve', function() {

    it('should return active rules specified in config', function() {

      // given
      const ruleRegistry = {
        'rule-example-1': () => 'I am rule 1',
        'rule-example-2': () => 'I am rule 2',
        'rule-example-3': () => 'I am rule 3'
      };
      const config = {
        'rule-example-1': 'error',
        'rule-example-3': 'info'
      };
      const ruleResolver = new RuleResolver(ruleRegistry);

      // when
      const rules = ruleResolver.resolve(config);

      // then
      expect(rules).to.eql([
        { category: 'error', execute: ruleRegistry['rule-example-1'] },
        { category: 'info', execute: ruleRegistry['rule-example-3'] }
      ]);

    });

    it('should have empty ruleRegistry if no registry is passed into constructor', function() {

      // when
      const ruleResolver = new RuleResolver();

      // then
      expect(ruleResolver.ruleRegistry).to.eql({});

    });

  });

});

