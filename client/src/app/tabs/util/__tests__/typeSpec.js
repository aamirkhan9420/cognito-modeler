import { Type } from '../type';

describe('tabs/bpmn/util - type', function() {

  it('should return correct values for types', function() {

    expect(Type.BPMN).to.be.eql('bpmn');
    expect(Type.DMN).to.be.eql('dmn');
    expect(Type.FORM).to.be.eql('form');

  });

});
