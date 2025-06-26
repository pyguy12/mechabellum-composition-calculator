import { validateScrapedData, compareWithExisting } from '../src/validator.js';

describe('Validator', () => {
  describe('validateScrapedData', () => {
    test('should validate correct data', () => {
      const validData = {
        1: { effectiveAgainst: [2, 3], counteredBy: [4, 5] },
        2: { effectiveAgainst: [4], counteredBy: [1] },
        3: { effectiveAgainst: [5], counteredBy: [1] },
        4: { effectiveAgainst: [1], counteredBy: [2] },
        5: { effectiveAgainst: [1], counteredBy: [3] }
      };
      
      const result = validateScrapedData(validData);
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });
    
    test('should detect missing properties', () => {
      const invalidData = {
        1: { effectiveAgainst: [2, 3] } // Missing counteredBy
      };
      
      const result = validateScrapedData(invalidData);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Unit 1 missing required properties');
    });
    
    test('should detect self-counters', () => {
      const dataWithSelfCounter = {
        1: { effectiveAgainst: [1, 2], counteredBy: [3] },
        2: { effectiveAgainst: [], counteredBy: [1] },
        3: { effectiveAgainst: [1], counteredBy: [] }
      };
      
      const result = validateScrapedData(dataWithSelfCounter);
      expect(result.warnings).toContain('Unit 1 is marked as countering itself');
    });
  });
  
  describe('compareWithExisting', () => {
    test('should detect no changes', () => {
      const scrapedData = {
        1: { effectiveAgainst: [2], counteredBy: [3] }
      };
      
      const existingData = {
        units: [{
          id: 1,
          name: 'Unit 1',
          counters: { effectiveAgainst: [2], counteredBy: [3] }
        }]
      };
      
      const result = compareWithExisting(scrapedData, existingData);
      expect(result.hasChanges).toBe(false);
    });
    
    test('should detect modified units', () => {
      const scrapedData = {
        1: { effectiveAgainst: [2, 4], counteredBy: [3] }
      };
      
      const existingData = {
        units: [{
          id: 1,
          name: 'Unit 1',
          counters: { effectiveAgainst: [2], counteredBy: [3] }
        }]
      };
      
      const result = compareWithExisting(scrapedData, existingData);
      expect(result.hasChanges).toBe(true);
      expect(result.changes.modified).toHaveLength(1);
    });
  });
});