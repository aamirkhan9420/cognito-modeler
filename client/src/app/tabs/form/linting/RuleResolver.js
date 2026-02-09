export default class RuleResolver {

  constructor(ruleRegistry = {}) {
    this.ruleRegistry = ruleRegistry;
  }

  resolve(ruleConfig) {
    return Object.entries(ruleConfig).map(([ ruleName, ruleCategory ]) => ({ execute: this.ruleRegistry[ruleName], category: ruleCategory }));
  }
}
