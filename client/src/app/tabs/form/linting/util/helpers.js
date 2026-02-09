export function capitalize(string) {
  return `${string.slice(0, 1).toUpperCase()}${string.slice(1)}`;
}

export function executeRecursively(execute, node, context) {
  if (execute(node, context)) {
    if (Array.isArray(node.components)) {
      node.components.forEach(childNode => executeRecursively(execute, childNode, context));
    }
  }
}

export function getExecutionPlatformLabel(schema) {
  const { executionPlatform, executionPlatformVersion } = schema;
  const executionPlatformVersionMinor = toSemverMinor(executionPlatformVersion);

  return `${executionPlatform} ${executionPlatformVersionMinor}`;
}

export function getIndefiniteArticle(type, uppercase = true) {
  const capitalizedFirstWord = capitalize(type.split(' ')[ 0 ]);

  if ([ 'Image' ].includes(capitalizedFirstWord)) {
    return uppercase ? 'An' : 'an';
  }

  return uppercase ? 'A' : 'a';
}

export function textToLabel(text = '...') {
  if (text.length > 30) {
    return `${text.substring(0, 27)}...`;
  }

  return text;
}

export function toSemverMinor(version) {
  return version.split('.').slice(0, 2).join('.');
}

