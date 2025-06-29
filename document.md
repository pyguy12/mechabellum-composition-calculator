# Mechabellum Unit Data Requirements and Scraper Guide

## Unit Data Structure

Each unit in the application requires the following data:

```json
{
    "id": 1,                    // Unique numeric identifier
    "name": "Farseer",         // Unit display name
    "image": "farseer.jpg",    // Image filename (stored in /public/images/)
    "cost": 300,               // Unit cost in game currency
    "counters": {
        "effectiveAgainst": [20, 8, 13, 18],  // Array of unit IDs this unit counters
        "counteredBy": [24, 21, 9]            // Array of unit IDs that counter this unit
    }
}
```

## How Counter Data is Used

### Counter Calculation Logic

1. **Data Flow**: 
   - User selects enemy units in the UI
   - System checks each available unit's `counters.effectiveAgainst` array
   - If a unit's `effectiveAgainst` includes any selected enemy unit IDs, it's recommended as a counter

2. **Recommendation Algorithm**:
   - Units are scored by how many enemy units they counter
   - Secondary sort by how few enemy units counter them back
   - Top 5 recommendations are displayed

3. **Important Notes**:
   - Counter relationships are **unidirectional** (A counters B doesn't mean B counters A)
   - The system uses the `counteredBy` array to determine vulnerabilities
   - Quantities matter - countering 3 of the same unit counts as 3 counter points

## Web Scraper Requirements

To properly scrape unit data, your scraper needs to extract:

### 1. **Unit Basic Information**
- **Unit Name**: The display name of the unit
- **Unit ID**: A unique identifier (can be derived from name or scraped if available)
- **Unit Cost**: The in-game cost/price of the unit
- **Unit Image**: Either the image URL or the image itself for download

### 2. **Counter Relationships**
This is the most critical data. The scraper needs to find:

- **Units This Unit Counters** (effectiveAgainst):
  - Look for phrases like "effective against", "strong against", "counters"
  - May be in a dedicated section or within unit descriptions
  - Could be represented as icons, text lists, or tables

- **Units That Counter This Unit** (counteredBy):
  - Look for phrases like "weak against", "countered by", "vulnerable to"
  - Often found in the same area as effectiveness data
  - May need to cross-reference from other units' "effective against" lists

### 3. **HTML Elements to Target**

When inspecting the source website, look for:

1. **Unit Cards/Containers**: 
   - Divs or sections that contain all info for one unit
   - Often have consistent class names like `.unit-card`, `.hero-info`, etc.

2. **Counter Information Patterns**:
   - Tables showing unit matchups
   - Lists within unit descriptions
   - Icon-based representations with tooltips
   - Dedicated "Counters" or "Matchups" sections

3. **Common HTML Structures**:
   ```html
   <!-- Example 1: List-based -->
   <div class="unit-counters">
     <h3>Strong Against:</h3>
     <ul>
       <li>Wasp</li>
       <li>Wraith</li>
     </ul>
   </div>

   <!-- Example 2: Icon-based -->
   <div class="matchups">
     <img src="farseer-icon.png" title="Counters: Wasp, Wraith">
   </div>

   <!-- Example 3: Table-based -->
   <table class="unit-matchups">
     <tr>
       <td>Farseer</td>
       <td>Strong vs:</td>
       <td>Wasp, Wraith, Sledgehammer</td>
     </tr>
   </table>
   ```

### 4. **Data Validation Requirements**

The scraper should validate:
- All unit IDs in counter arrays exist in the units list
- No unit counters itself
- Counter relationships make logical sense (no circular dependencies)
- All required fields are present for each unit

### 5. **Output Format**

The scraper should output data in the exact format used by `units.json`:
```json
{
    "units": [
        {
            "id": 1,
            "name": "Farseer",
            "image": "farseer.jpg",
            "cost": 300,
            "counters": {
                "effectiveAgainst": [20, 8, 13, 18],
                "counteredBy": [24, 21, 9]
            }
        }
        // ... more units
    ]
}
```

## Scraping Strategy Recommendations

1. **Start with Unit List**: First scrape all unit names and basic info
2. **Build ID Mapping**: Create a name-to-ID mapping for counter references
3. **Extract Relationships**: Parse counter information and convert unit names to IDs
4. **Cross-Validate**: Ensure bidirectional relationships are captured
5. **Handle Updates**: Design scraper to detect changes and update existing data

## Next Steps

1. Inspect the target website's HTML structure
2. Identify the specific selectors for unit data
3. Map out how counter relationships are displayed
4. Share findings so we can design the scraper logic together