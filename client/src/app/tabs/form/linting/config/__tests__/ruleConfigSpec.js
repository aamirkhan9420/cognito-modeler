import { getRuleConfig } from '../ruleConfig';


describe('tabs/form/linting/config - ruleConfig', function() {

  describe('getRuleConfig', function() {

    it('should return base rule config relevant to provided formJS version', function() {

      // given
      const oldVersion = '0.9.0';
      const newVersion = '1.14.0';

      // when
      const config1 = getRuleConfig(oldVersion);
      const config2 = getRuleConfig(newVersion);

      // then
      expect(config1).to.eql({
        'form-element-type': 'error',
        'no-submit-button': 'info'
      });
      expect(config2).to.eql({
        'form-element-type': 'error',
        'validate-feel': 'error',
        'discourage-disabled-fields': 'warn',
        'no-empty-lists': 'warn',
        'no-submit-button': 'info'
      });

    });

    it('should return combined rule config with plugins relevant to provided formJS version', function() {

      // given
      const newVersion = '1.14.0';
      const pluginConfig = {
        'no-number-in-dynamic-list': {
          'severity': 'error',
          'before': '1.14.0'
        },
        'no-default-value-in-text-field': {
          'severity': 'warn',
          'after': '1.0.0'
        }
      };

      // when
      const config = getRuleConfig(newVersion, pluginConfig);

      // then
      expect(config).to.eql({
        'form-element-type': 'error',
        'validate-feel': 'error',
        'discourage-disabled-fields': 'warn',
        'no-empty-lists': 'warn',
        'no-submit-button': 'info',
        'no-default-value-in-text-field': 'warn'
      });

    });

    it('should return empty config if no formJS version is provided', function() {

      // when
      const config = getRuleConfig();

      // then
      expect(config).to.eql({});

    });

  });

});

