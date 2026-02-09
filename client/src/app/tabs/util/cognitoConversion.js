import { getBpmnDefinitionsForConversion, getDmnDefinitionsForConversion } from '../../../util/xmlConversion';
import { is } from './namespace';
import Metadata from '../../../util/Metadata';
import { toBpmnXml, toDmnXml } from '../../../util/xmlConversion';
import { ENGINES, getLatestStable } from '../../../util/Engines';
import { Type } from './type';
import { XMLValidator } from 'fast-xml-parser';

const NAMESPACE_URI_BPMN_COGNITO = 'http://fluxnova.finos.org/schema/1.0/bpmn'; // URL not changed
const NAMESPACE_URI_DMN_COGNITO = 'http://fluxnova.finos.org/schema/1.0/dmn'; // URL not changed
const NAMESPACE_URI_MODELER = 'http://fluxnova.finos.org/schema/modeler/1.0'; // URL not changed
const EXECUTION_PLATFORM_COGNITO = 'Cognito Platform';
const NAMESPACE_URI_C8 = 'http://camunda.org/schema/zeebe/1.0';
const EXECUTION_PLATFORM_C8 = 'Camunda Cloud';

export async function convertBpmnToCognitoIfRequired(contents, onAction, onContentUpdated) {
  const entity = await convertToCognitoIfRequired(contents, Type.BPMN, onAction);
  const result = getConvertedResult(entity, onContentUpdated);
  return result || contents;
}

export async function convertDmnToCognitoIfRequired(contents, onAction, onContentUpdated) {
  const entity = await convertToCognitoIfRequired(contents, Type.DMN, onAction);
  const result = getConvertedResult(entity, onContentUpdated);
  return result || contents;
}

export async function convertFormToCognitoIfRequired(contents, onAction) {
  const entity = await convertToCognitoIfRequired(contents, Type.FORM, onAction);
  const result = getConvertedResult(entity);
  return result || contents;
}

async function convertToCognitoIfRequired(contents, type, onAction) {
  if (isConversionCandidate(contents, type)) {
    return await handleCognitoConversion(contents, type, onAction);
  }
  return contents;
}

async function handleCognitoConversion(contents, type, onAction) {
  const isC8Model = is(contents, NAMESPACE_URI_C8, EXECUTION_PLATFORM_C8);
  let dialog = isC8Model ? getCognitoUnsupportedDialog() : getCognitoConversionDialog(type);
  const { button } = await onAction('show-dialog', dialog);

  if (button === '0') {
    const result = await convertToCognito(contents, type);
    return {
      result,
      converted: true
    };
  } else {
    await onAction('close-tab');
    return {
      converted: false
    };
  }
}

function isConversionCandidate(contents, type) {
  const ns = type === Type.BPMN ? NAMESPACE_URI_BPMN_COGNITO : NAMESPACE_URI_DMN_COGNITO;
  return isEntityValid(contents, type) && !is(contents, ns, EXECUTION_PLATFORM_COGNITO);
}

function getCognitoConversionDialog(type) {
  return {
    type: 'error',
    title: `Unsupported ${type} file detected`,
    buttons: [
      { id: '0', label: 'Yes' },
      { id: '1', label: 'Close File' }
    ],
    message: `Would you like to migrate your ${type} file to be Cognito compatible? `,
    detail: [
      'This modeler only supports Cognito files.',
      'Please make sure to have a backup of this file before migrating.',
    ].join('\n')
  };
}

function getCognitoUnsupportedDialog() {
  return {
    type: 'error',
    title: 'Unsupported Camunda 8 file detected',
    buttons: [
      { id: '2', label: 'Close File' }
    ],
    message: 'Camunda 8 files are unsupported in Cognito',
    detail: [
      'This modeler only supports Cognito files.',
    ].join('\n')
  };
}

function getConvertedResult(entity, onContentUpdated) {
  if (entity.converted) {
    const result = entity.result;
    if (onContentUpdated) {
      onContentUpdated(result);
    }
    return result;
  }
  return null;
}

async function convertToCognito(contents, type) {
  const latestStable = getLatestStable(ENGINES.COGNITO);
  if ([ Type.BPMN, Type.DMN ].includes(type)) {
    return await handleConversionForXml(contents, type, latestStable);
  } else {
    return handleConversionForJson(contents, latestStable);
  }
}

async function handleConversionForXml(contents, type, latestStable) {
  let convertedXml;
  try {
    if (type === Type.BPMN) {
      const definitions = await getBpmnDefinitionsForConversion(contents);
      definitions.$attrs['xmlns:cognito'] = NAMESPACE_URI_BPMN_COGNITO; // URL not changed
      const updatedDefinitions = updateCommonAttributesForXml(definitions, latestStable);
      convertedXml = await toBpmnXml(updatedDefinitions);
    } else {
      const definitions = await getDmnDefinitionsForConversion(contents);
      definitions.namespace = NAMESPACE_URI_DMN_COGNITO; // URL not changed
      const updatedDefinitions = updateCommonAttributesForXml(definitions, latestStable);
      convertedXml = await toDmnXml(updatedDefinitions);
    }
    return convertedXml.xml;
  } catch (error) {
    throw new Error('Error converting model to Cognito');
  }
}

function handleConversionForJson(contents, latestStable) {
  if (!contents.exporter) {
    contents.exporter = {};
  }
  contents.exporter.name = Metadata.name;
  contents.exporter.version = Metadata.version;
  return updateCommonAttributes(contents, latestStable);
}

function updateCommonAttributesForXml(definitions, latestStable) {
  const updatedAttributes = updateCommonAttributes(definitions, latestStable);
  updatedAttributes.exporter = Metadata.name;
  updatedAttributes.exporterVersion = Metadata.version;
  updatedAttributes.$attrs['xmlns:modeler'] = NAMESPACE_URI_MODELER; // URL not changed
  updatedAttributes.$attrs['modeler:executionPlatform'] = ENGINES.COGNITO;
  updatedAttributes.$attrs['modeler:executionPlatformVersion'] = latestStable;
  return updatedAttributes;
}

function updateCommonAttributes(definitions, latestStable) {
  definitions.executionPlatform = ENGINES.COGNITO;
  definitions.executionPlatformVersion = latestStable;
  return definitions;
}

function isEntityValid(contents, type) {
  if ([ Type.BPMN, Type.DMN ].includes(type)) {
    return isXml(contents);
  } else {
    return isJson(contents);
  }
}

function isXml(contents) {
  return XMLValidator.validate(contents.trim()) === true;
}

function isJson(contents) {
  return typeof contents === 'object';
}
