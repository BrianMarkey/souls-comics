import utilsService from 'src/services/utils-service.js'

describe("utils-service.isInt()", function() {
  it("returns false for an empty string", function() {
    const result = utilsService.isInt('');
    expect(result).toBe(false);
  });
  
  it("returns false for an empty undefined", function() {
    const result = utilsService.isInt();
    expect(result).toBe(false);
  });
  
  it("returns false for a non-numeric string", function() {
    const result = utilsService.isInt('yolo');
    expect(result).toBe(false);
  });
  
  it("returns false for a boolean", function() {
    const result = utilsService.isInt(true);
    expect(result).toBe(false);
  });
  
  it("returns false for an object literal", function() {
    const result = utilsService.isInt({ saul: 'goodman'});
    expect(result).toBe(false);
  });
  
  it("returns false for a function", function() {
    const result = utilsService.isInt(function () { return 1; });
    expect(result).toBe(false);
  });
  
  it("returns false for a decimal", function() {
    const result = utilsService.isInt(1.1);
    expect(result).toBe(false);
  });
  
  it("returns false for a string representation of a decimal", function() {
    const result = utilsService.isInt('1.1');
    expect(result).toBe(false);
  });
  
  it("returns true for a string representation of an int", function() {
    const result = utilsService.isInt('5');
    expect(result).toBe(true);
  });
  
  it("returns true for an int", function() {
    const result = utilsService.isInt(6);
    expect(result).toBe(true);
  });
});
