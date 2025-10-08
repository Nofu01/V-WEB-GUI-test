const hexToRgb = require('../../src/utils/hexToRgb');

describe('hexToRgb Unit Tests', () => {
  
  describe('Valid HEX conversions', () => {
    test('should convert full hex code without #', () => {
      const result = hexToRgb('FFFFFF');
      expect(result).toEqual({ r: 255, g: 255, b: 255 });
    });
    
    test('should convert full hex code with #', () => {
      const result = hexToRgb('#000000');
      expect(result).toEqual({ r: 0, g: 0, b: 0 });
    });
    
    test('should convert red color', () => {
      const result = hexToRgb('FF0000');
      expect(result).toEqual({ r: 255, g: 0, b: 0 });
    });
    
    test('should convert green color', () => {
      const result = hexToRgb('00FF00');
      expect(result).toEqual({ r: 0, g: 255, b: 0 });
    });
    
    test('should convert blue color', () => {
      const result = hexToRgb('0000FF');
      expect(result).toEqual({ r: 0, g: 0, b: 255 });
    });
    
    test('should convert shorthand hex code', () => {
      const result = hexToRgb('F0F');
      expect(result).toEqual({ r: 255, g: 0, b: 255 });
    });
    
    test('should convert lowercase hex code', () => {
      const result = hexToRgb('ff5733');
      expect(result).toEqual({ r: 255, g: 87, b: 51 });
    });
    
    test('should convert mixed case hex code', () => {
      const result = hexToRgb('FfA500');
      expect(result).toEqual({ r: 255, g: 165, b: 0 });
    });
  });
  
  describe('Invalid HEX codes', () => {
    test('should return null for invalid characters', () => {
      const result = hexToRgb('GGGGGG');
      expect(result).toBeNull();
    });
    
    test('should return null for wrong length', () => {
      const result = hexToRgb('FF');
      expect(result).toBeNull();
    });
    
    test('should return null for empty string', () => {
      const result = hexToRgb('');
      expect(result).toBeNull();
    });
    
    test('should return null for special characters', () => {
      const result = hexToRgb('FF-FF-FF');
      expect(result).toBeNull();
    });
  });
  
  describe('Edge cases', () => {
    test('should handle shorthand with #', () => {
      const result = hexToRgb('#FFF');
      expect(result).toEqual({ r: 255, g: 255, b: 255 });
    });
    
    test('should handle gray colors', () => {
      const result = hexToRgb('808080');
      expect(result).toEqual({ r: 128, g: 128, b: 128 });
    });
  });
});