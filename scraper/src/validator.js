import { UNIT_NAME_MAPPING } from './config.js';

export function validateScrapedData(scrapedData) {
  const errors = [];
  const warnings = [];
  
  // Check if we have data
  if (!scrapedData || typeof scrapedData !== 'object') {
    errors.push('Scraped data is empty or invalid');
    return { isValid: false, errors, warnings };
  }
  
  const unitIds = Object.keys(scrapedData).map(id => parseInt(id));
  const validUnitIds = Object.values(UNIT_NAME_MAPPING);
  
  // Check if we have a reasonable number of units
  if (unitIds.length < 10) {
    errors.push(`Only found ${unitIds.length} units, expected at least 10`);
  }
  
  // Validate each unit's data
  unitIds.forEach(unitId => {
    const unitData = scrapedData[unitId];
    
    // Check if unit ID is valid
    if (!validUnitIds.includes(unitId)) {
      errors.push(`Invalid unit ID: ${unitId}`);
      return;
    }
    
    // Validate structure
    if (!unitData.hasOwnProperty('effectiveAgainst') || !unitData.hasOwnProperty('counteredBy')) {
      errors.push(`Unit ${unitId} missing required properties`);
      return;
    }
    
    // Validate arrays
    if (!Array.isArray(unitData.effectiveAgainst) || !Array.isArray(unitData.counteredBy)) {
      errors.push(`Unit ${unitId} has invalid counter arrays`);
      return;
    }
    
    // Check for self-counters (a unit shouldn't counter itself)
    if (unitData.effectiveAgainst.includes(unitId)) {
      warnings.push(`Unit ${unitId} is marked as countering itself`);
    }
    
    // Check for circular direct counters (A counters B and B counters A)
    unitData.effectiveAgainst.forEach(counteredUnit => {
      if (scrapedData[counteredUnit]?.effectiveAgainst?.includes(unitId)) {
        warnings.push(`Circular counter detected: ${unitId} <-> ${counteredUnit}`);
      }
    });
    
    // Validate referenced units exist
    [...unitData.effectiveAgainst, ...unitData.counteredBy].forEach(referencedId => {
      if (!validUnitIds.includes(referencedId)) {
        errors.push(`Unit ${unitId} references invalid unit ID: ${referencedId}`);
      }
    });
    
    // Check for reasonable counter counts
    if (unitData.effectiveAgainst.length > 15) {
      warnings.push(`Unit ${unitId} counters ${unitData.effectiveAgainst.length} units (seems high)`);
    }
    
    if (unitData.counteredBy.length > 15) {
      warnings.push(`Unit ${unitId} is countered by ${unitData.counteredBy.length} units (seems high)`);
    }
  });
  
  // Cross-validation: ensure bidirectional relationships
  unitIds.forEach(unitId => {
    const unitData = scrapedData[unitId];
    
    // For each unit this unit is effective against
    unitData.effectiveAgainst.forEach(targetId => {
      if (scrapedData[targetId] && !scrapedData[targetId].counteredBy.includes(unitId)) {
        warnings.push(`Missing bidirectional: ${unitId} counters ${targetId}, but ${targetId} doesn't list ${unitId} as counter`);
      }
    });
    
    // For each unit that counters this unit
    unitData.counteredBy.forEach(counterId => {
      if (scrapedData[counterId] && !scrapedData[counterId].effectiveAgainst.includes(unitId)) {
        warnings.push(`Missing bidirectional: ${counterId} should counter ${unitId}, but doesn't list it`);
      }
    });
  });
  
  // Log summary
  console.log(`Validation complete: ${errors.length} errors, ${warnings.length} warnings`);
  
  if (warnings.length > 0) {
    console.log('Warnings:', warnings);
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
}

export function compareWithExisting(scrapedData, existingData) {
  const changes = {
    added: [],
    removed: [],
    modified: []
  };
  
  const scrapedIds = Object.keys(scrapedData).map(id => parseInt(id));
  const existingIds = existingData.units.map(unit => unit.id);
  
  // Find added units
  scrapedIds.forEach(id => {
    if (!existingIds.includes(id)) {
      changes.added.push(id);
    }
  });
  
  // Find removed units
  existingIds.forEach(id => {
    if (!scrapedIds.includes(id)) {
      changes.removed.push(id);
    }
  });
  
  // Find modified units
  existingData.units.forEach(existingUnit => {
    const scrapedUnit = scrapedData[existingUnit.id];
    
    if (scrapedUnit) {
      const existingCounters = existingUnit.counters || { effectiveAgainst: [], counteredBy: [] };
      
      // Compare arrays (order doesn't matter)
      const effectiveAgainstChanged = !arraysEqual(
        scrapedUnit.effectiveAgainst.sort(),
        existingCounters.effectiveAgainst.sort()
      );
      
      const counteredByChanged = !arraysEqual(
        scrapedUnit.counteredBy.sort(),
        existingCounters.counteredBy.sort()
      );
      
      if (effectiveAgainstChanged || counteredByChanged) {
        changes.modified.push({
          id: existingUnit.id,
          name: existingUnit.name,
          changes: {
            effectiveAgainst: effectiveAgainstChanged ? {
              old: existingCounters.effectiveAgainst,
              new: scrapedUnit.effectiveAgainst
            } : null,
            counteredBy: counteredByChanged ? {
              old: existingCounters.counteredBy,
              new: scrapedUnit.counteredBy
            } : null
          }
        });
      }
    }
  });
  
  const hasChanges = changes.added.length > 0 || 
                    changes.removed.length > 0 || 
                    changes.modified.length > 0;
  
  return {
    hasChanges,
    changes,
    summary: {
      added: changes.added.length,
      removed: changes.removed.length,
      modified: changes.modified.length
    }
  };
}

function arraysEqual(a, b) {
  if (a.length !== b.length) return false;
  
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) return false;
  }
  
  return true;
}