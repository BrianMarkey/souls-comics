import utilsService from 'src/services/utils-service.js';

describe('utils-service.isInt()', () => {
  it('returns false for an empty string', () => {
    const result = utilsService.isInt('');
    expect(result).toBe(false);
  });
  
  it('returns false for an empty undefined', () => {
    const result = utilsService.isInt();
    expect(result).toBe(false);
  });
  
  it('returns false for a non-numeric string', () => {
    const result = utilsService.isInt('yolo');
    expect(result).toBe(false);
  });
  
  it('returns false for a boolean', () => {
    const result = utilsService.isInt(true);
    expect(result).toBe(false);
  });
  
  it('returns false for an object literal', () => {
    const result = utilsService.isInt({ saul: 'goodman'});
    expect(result).toBe(false);
  });
  
  it('returns false for a function', () => {
    const result = utilsService.isInt(function () { return 1; });
    expect(result).toBe(false);
  });
  
  it('returns false for a decimal', () => {
    const result = utilsService.isInt(1.1);
    expect(result).toBe(false);
  });
  
  it('returns false for a string representation of a decimal', () => {
    const result = utilsService.isInt('1.1');
    expect(result).toBe(false);
  });
  
  it('returns true for a string representation of an int', () => {
    const result = utilsService.isInt('5');
    expect(result).toBe(true);
  });
  
  it('returns true for an int', () => {
    const result = utilsService.isInt(6);
    expect(result).toBe(true);
  });
});
