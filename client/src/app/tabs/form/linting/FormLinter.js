import { isString } from 'min-dash';

import RuleResolver from './RuleResolver';
import ProblemsReporter, { formatFormFieldReport } from './ProblemsReporter';
import { getFormJSVersion } from './util/formVersion';
import { getRuleConfig } from './config/ruleConfig';
import { getExecutionPlatformLabel } from './util/helpers';
import { defaultRuleRegistry } from './rules/ruleRegistry';
import { executeRecursively } from './util/helpers';

export class FormLinter {
  constructor(plugins = []) {
    this.pluginRegistry = this.#loadPluginRuleRegistry(plugins);
  }

  #loadPluginRuleRegistry(plugins) {
    const registry = { rules: {}, config: {} };
    if (!plugins) return registry;

    plugins.forEach(p => {
      Object.entries(p.rules).forEach(r => {
        registry.rules[r[0]] = r[1].execute;
        registry.config[r[0]] = r[1].config;
      });
    });

    return registry;
  }

  lint(contents) {
    const schema = isString(contents) ? JSON.parse(contents) : contents;
    const formJSVersion = getFormJSVersion(schema);

    if (!formJSVersion) {
      return [];
    }

    const executionPlatformLabel = getExecutionPlatformLabel(schema);
    const ruleRegistry = { ...defaultRuleRegistry, ...this.pluginRegistry.rules };

    const ruleResolver = new RuleResolver(ruleRegistry);
    const rules = ruleResolver.resolve(getRuleConfig(formJSVersion, this.pluginRegistry.config));

    const reporter = new ProblemsReporter();

    const baseContext = {
      executionPlatformLabel,
      formJSVersion,
      reporter
    };

    rules.forEach(rule => {
      const context = {
        ...baseContext,
        category: rule.category,
        formatReport: formatFormFieldReport
      };

      executeRecursively(rule.execute, schema, context);

    });

    return reporter.getReports();
  }
}

