import { toBpmnXml, toDmnXml } from '../xmlConversion';
import BpmnModdle from 'bpmn-moddle';
import DmnModdle from 'dmn-moddle';

describe('util - xmlConversionSpec', function() {

  describe('toBpmnXml', function() {

    const moddle = new BpmnModdle();

    it('should convert from definitions to xml', async function() {

      const expected = '<bpmn:definitions xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL"';

      const definitions = moddle.create('bpmn:Definitions');

      const { xml } = await toBpmnXml(definitions);

      expect(xml).to.contains(expected);

    });

  });

  describe('toDmnXml', function() {

    const moddle = new DmnModdle();

    it('should convert from definitions to xml', async function() {

      const expected = '<dmn:definitions xmlns:dmn="https://www.omg.org/spec/DMN/20191111/MODEL/" />';

      const definitions = moddle.create('dmn:Definitions');

      const { xml } = await toDmnXml(definitions);

      expect(xml).to.contain(expected);

    });

  });



});
