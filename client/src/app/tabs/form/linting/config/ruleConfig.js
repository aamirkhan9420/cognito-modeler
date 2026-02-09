import cmp from 'semver-compare';

const versionedRuleConfig = {
  'form-element-type': { severity: 'error' },
  'validate-feel': { from: '0.10.0', severity: 'error' },
  'discourage-disabled-fields' : { from: '1.0.0', severity: 'warn' },
  'no-empty-lists': { from: '1.5.0', severity: 'warn' },
  'no-submit-button': { severity: 'info' }
};

export function getRuleConfig(formJSVersion, pluginConfig = {}) {
  if (!formJSVersion) { return {}; }

  const mergedConfig = { ...versionedRuleConfig, ...getVersionedPluginConfig(pluginConfig) };

  const rules = Object.entries(mergedConfig);
  const filteredRules = rules.filter(([ _, config ]) =>
    (!config.from || cmp(config.from, formJSVersion) <= 0) &&
    (!config.before || cmp(config.before, formJSVersion) > 0)
  );

  return filteredRules.reduce((acc, [ rule, config ]) => {
    acc[rule] = config.severity;
    return acc;
  }, {});
}

function getVersionedPluginConfig(config) {
  return Object.entries(config).reduce((acc, [ rule, severity ]) => {
    acc[rule] = severity;
    return acc;
  }, {});
}



