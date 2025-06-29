import * as cheerio from 'cheerio';
import { UNIT_NAME_MAPPING } from './config.js';

export async function parseCounterData(htmlContent) {
  const $ = cheerio.load(htmlContent);
  const counterData = {};

  try {
    console.log('Starting to parse counter data...');
    
    // Primary approach: Parse image-based unit sections
    parseImageBasedSections($, counterData);
    
    // Fallback approaches if primary fails
    if (Object.keys(counterData).length === 0) {
      console.log('Primary parsing failed, trying table approach...');
      // Approach 2: Look for tables with counter information
      const tables = $('table').toArray();
      
      for (const table of tables) {
        const tableText = $(table).text().toLowerCase();
        
        // Check if this table contains counter information
        if (tableText.includes('counter') || tableText.includes('effective') || tableText.includes('weak')) {
          parseCounterTable($, table, counterData);
        }
      }
    }

    // Approach 3: Look for structured lists or sections
    if (Object.keys(counterData).length === 0) {
      console.log('Table parsing failed, trying sections approach...');
      parseCounterSections($, counterData);
    }

    // Approach 4: Look for unit-specific sections
    if (Object.keys(counterData).length === 0) {
      console.log('Sections parsing failed, trying unit-specific approach...');
      parseUnitSections($, counterData);
    }

    console.log(`Parsed data for ${Object.keys(counterData).length} units`);
    
    // Convert unit names to IDs
    const normalizedData = normalizeCounterData(counterData);
    
    return normalizedData;
    
  } catch (error) {
    console.error('Error parsing counter data:', error);
    throw new Error(`Failed to parse counter data: ${error.message}`);
  }
}

function parseImageBasedSections($, counterData) {
  // Look for sections with "How to play" headers
  const unitSections = [];
  
  // Find all h2 headers that contain "How to play"
  $('h2').each((i, elem) => {
    const headerText = $(elem).text();
    if (headerText.includes('How to play')) {
      const unitName = headerText.replace('How to play', '').trim().toLowerCase();
      
      // Find the content after this header until the next h2
      let currentElem = $(elem).next();
      const sectionContent = {
        unitName: unitName,
        usedAgainst: [],
        counteredBy: []
      };
      
      let currentSection = null;
      
      while (currentElem.length > 0 && !currentElem.is('h2')) {
        // Check for "Used against" or "Countered by" headers
        if (currentElem.is('h3, h4, strong')) {
          const sectionText = currentElem.text().toLowerCase();
          if (sectionText.includes('used against') || sectionText.includes('effective against')) {
            currentSection = 'usedAgainst';
          } else if (sectionText.includes('countered by') || sectionText.includes('weak against')) {
            currentSection = 'counteredBy';
          }
        }
        
        // Look for unit images with alt text
        if (currentSection) {
          currentElem.find('img').each((j, img) => {
            const altText = $(img).attr('alt');
            if (altText) {
              const counters = altText.toLowerCase().split(/[,;\/\s]+/)
                .map(name => name.trim())
                .filter(name => name && UNIT_NAME_MAPPING[name]);
              
              sectionContent[currentSection].push(...counters);
            }
          });
          
          // Also check for text content that might list units
          const text = currentElem.text();
          if (text) {
            Object.keys(UNIT_NAME_MAPPING).forEach(unit => {
              if (text.toLowerCase().includes(unit) && currentSection) {
                if (!sectionContent[currentSection].includes(unit)) {
                  sectionContent[currentSection].push(unit);
                }
              }
            });
          }
        }
        
        currentElem = currentElem.next();
      }
      
      // Add to counterData if we found any counters
      if (sectionContent.usedAgainst.length > 0 || sectionContent.counteredBy.length > 0) {
        counterData[sectionContent.unitName] = {
          effectiveAgainst: [...new Set(sectionContent.usedAgainst)],
          counteredBy: [...new Set(sectionContent.counteredBy)]
        };
      }
    }
  });
  
  // Alternative: Look for unit images and their surrounding context
  if (Object.keys(counterData).length === 0) {
    console.log('Trying alternative image-based parsing...');
    
    // Find all images with unit names in alt text
    $('img').each((i, img) => {
      const altText = $(img).attr('alt');
      if (altText) {
        const unitName = altText.toLowerCase().trim();
        if (UNIT_NAME_MAPPING[unitName]) {
          // Look for nearby text that indicates counter relationships
          const parent = $(img).parent();
          const grandParent = parent.parent();
          const contextText = grandParent.text().toLowerCase();
          
          // Check if this is in a "used against" or "countered by" section
          if (contextText.includes('used against') || contextText.includes('effective against')) {
            // Find the main unit this section is about
            const mainUnitMatch = contextText.match(/how to play\s+(\w+)/);
            if (mainUnitMatch) {
              const mainUnit = mainUnitMatch[1].toLowerCase();
              if (!counterData[mainUnit]) {
                counterData[mainUnit] = { effectiveAgainst: [], counteredBy: [] };
              }
              if (!counterData[mainUnit].effectiveAgainst.includes(unitName)) {
                counterData[mainUnit].effectiveAgainst.push(unitName);
              }
            }
          }
        }
      }
    });
  }
}

function parseCounterTable($, table, counterData) {
  const rows = $(table).find('tr').toArray();
  
  // Skip header row if present
  const dataRows = rows.filter(row => {
    const firstCell = $(row).find('td, th').first().text().toLowerCase();
    return !firstCell.includes('unit') && !firstCell.includes('name');
  });

  dataRows.forEach(row => {
    const cells = $(row).find('td').toArray();
    if (cells.length >= 3) {
      const unitName = $(cells[0]).text().trim().toLowerCase();
      const effectiveAgainst = parseUnitList($(cells[1]).text());
      const counteredBy = parseUnitList($(cells[2]).text());
      
      if (unitName && (effectiveAgainst.length > 0 || counteredBy.length > 0)) {
        counterData[unitName] = {
          effectiveAgainst,
          counteredBy
        };
      }
    }
  });
}

function parseCounterSections($, counterData) {
  // Look for sections with headers like "Unit Counters", "Counter List", etc.
  const sections = $('h2, h3, h4').toArray();
  
  sections.forEach(header => {
    const headerText = $(header).text().toLowerCase();
    
    if (headerText.includes('counter') || headerText.includes('matchup')) {
      // Find the content following this header
      let content = $(header).next();
      
      while (content.length > 0 && !content.is('h2, h3, h4')) {
        // Parse lists
        if (content.is('ul, ol')) {
          parseCounterList($, content, counterData);
        }
        
        // Parse paragraphs that might contain counter info
        if (content.is('p')) {
          parseCounterParagraph($, content, counterData);
        }
        
        content = content.next();
      }
    }
  });
}

function parseUnitSections($, counterData) {
  // Look for individual unit sections
  const unitNames = Object.keys(UNIT_NAME_MAPPING);
  
  unitNames.forEach(unitName => {
    // Search for headers or sections containing unit names
    const unitElements = $(`*:contains("${unitName}")`).filter((i, el) => {
      const text = $(el).text().toLowerCase();
      return text.includes(unitName) && (
        text.includes('counter') || 
        text.includes('effective') || 
        text.includes('weak') ||
        text.includes('strong')
      );
    });

    unitElements.each((i, el) => {
      const text = $(el).text();
      const effectiveAgainst = extractUnitsFromText(text, ['effective against', 'strong against', 'counters']);
      const counteredBy = extractUnitsFromText(text, ['countered by', 'weak against', 'weak to']);
      
      if (effectiveAgainst.length > 0 || counteredBy.length > 0) {
        counterData[unitName] = {
          effectiveAgainst: [...(counterData[unitName]?.effectiveAgainst || []), ...effectiveAgainst],
          counteredBy: [...(counterData[unitName]?.counteredBy || []), ...counteredBy]
        };
      }
    });
  });
}

function parseCounterList($, list, counterData) {
  const items = $(list).find('li').toArray();
  
  items.forEach(item => {
    const text = $(item).text();
    const unitMatch = text.match(/^([^:]+):/);
    
    if (unitMatch) {
      const unitName = unitMatch[1].trim().toLowerCase();
      const restOfText = text.substring(unitMatch[0].length);
      
      const effectiveAgainst = extractUnitsFromText(restOfText, ['effective against', 'counters']);
      const counteredBy = extractUnitsFromText(restOfText, ['countered by', 'weak to']);
      
      if (effectiveAgainst.length > 0 || counteredBy.length > 0) {
        counterData[unitName] = {
          effectiveAgainst,
          counteredBy
        };
      }
    }
  });
}

function parseCounterParagraph($, paragraph, counterData) {
  const text = $(paragraph).text();
  const sentences = text.split(/[.!?]+/);
  
  sentences.forEach(sentence => {
    const unitNames = Object.keys(UNIT_NAME_MAPPING);
    
    unitNames.forEach(unitName => {
      if (sentence.toLowerCase().includes(unitName)) {
        const effectiveAgainst = extractUnitsFromText(sentence, ['effective against', 'counters', 'strong against']);
        const counteredBy = extractUnitsFromText(sentence, ['countered by', 'weak to', 'weak against']);
        
        if (effectiveAgainst.length > 0 || counteredBy.length > 0) {
          counterData[unitName] = counterData[unitName] || { effectiveAgainst: [], counteredBy: [] };
          counterData[unitName].effectiveAgainst.push(...effectiveAgainst);
          counterData[unitName].counteredBy.push(...counteredBy);
        }
      }
    });
  });
}

function parseUnitList(text) {
  if (!text || text.toLowerCase() === 'none' || text === '-') {
    return [];
  }
  
  // Split by common delimiters
  const units = text.split(/[,;/\n]+/)
    .map(unit => unit.trim().toLowerCase())
    .filter(unit => unit.length > 0);
    
  return units;
}

function extractUnitsFromText(text, keywords) {
  const lowerText = text.toLowerCase();
  const foundUnits = [];
  
  // Check if text contains any of the keywords
  const hasKeyword = keywords.some(keyword => lowerText.includes(keyword));
  if (!hasKeyword) return [];
  
  // Extract unit names from the text
  Object.keys(UNIT_NAME_MAPPING).forEach(unitName => {
    if (lowerText.includes(unitName)) {
      foundUnits.push(unitName);
    }
  });
  
  return foundUnits;
}

function normalizeCounterData(counterData) {
  const normalized = {};
  
  Object.entries(counterData).forEach(([unitName, counters]) => {
    const unitId = UNIT_NAME_MAPPING[unitName.toLowerCase()];
    
    if (unitId) {
      // Convert unit names to IDs and remove duplicates
      const effectiveAgainstIds = [...new Set(
        counters.effectiveAgainst
          .map(name => UNIT_NAME_MAPPING[name.toLowerCase()])
          .filter(id => id !== undefined)
      )];
      
      const counteredByIds = [...new Set(
        counters.counteredBy
          .map(name => UNIT_NAME_MAPPING[name.toLowerCase()])
          .filter(id => id !== undefined)
      )];
      
      normalized[unitId] = {
        effectiveAgainst: effectiveAgainstIds,
        counteredBy: counteredByIds
      };
    }
  });
  
  return normalized;
}

export function debugParse(htmlContent) {
  const $ = cheerio.load(htmlContent);
  
  console.log('Debug Parse Results:');
  console.log('Tables found:', $('table').length);
  console.log('Lists found:', $('ul, ol').length);
  console.log('Headers found:', $('h2, h3, h4').length);
  
  // Log sample content for debugging
  $('table').each((i, table) => {
    console.log(`\nTable ${i + 1} sample:`, $(table).text().substring(0, 200));
  });
}