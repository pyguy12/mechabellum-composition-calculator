# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Mechabellum Composition Calculator is a React-based web application that helps players optimize their unit selection strategy in the game Mechabellum. The app provides real-time counter-unit suggestions based on enemy composition.

## Development Commands

All commands should be run from the `frontend` directory:

```bash
cd frontend

# Install dependencies
npm install

# Start development server (runs on http://localhost:3000)
npm start

# Build for production
npm build

# Run tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run a specific test file
npm test -- App.test.tsx
```

## Architecture Overview

### State Management
The application uses Redux Toolkit with a single slice (`unitsSlice`) that manages:
- `allUnits`: Complete unit data loaded from `units.json`
- `selectedUnits`: Enemy units selected by the user with quantities
- `searchQuery`: Current search filter

Key actions:
- `addUnit`: Adds or increments a unit
- `removeUnit`: Removes a unit entirely
- `setUnitQuantity`: Sets specific quantity for a unit
- `setSearchQuery`: Updates search filter
- `resetSelectedUnits`: Clears all selections
- `clearSearchQuery`: Clears search without affecting selections

### Data Flow
1. Unit data is loaded from `frontend/src/data/units.json` into Redux store
2. User interactions trigger Redux actions through components
3. Components use Redux selectors to access state
4. Counter suggestions are calculated based on the `counters` property of each unit

### Routing Structure
- `/` - Landing page with product overview
- `/app` - Main calculator application
- `/privacy-policy` - Privacy policy page

### Component Architecture
Key components and their responsibilities:
- `UnitGrid`: Displays all available units, handles unit selection
- `CounterList`: Shows recommended counter units based on enemy composition
- `EnemyCompositionBar`: Displays selected enemy units with quantities
- `SearchBar`: Filters units in the grid
- `UnitCard`: Individual unit display with selection state
- `ResetButton`: Clears all selections

### Type System
All unit data is strongly typed using TypeScript:
- `Unit` interface defines unit structure
- `UnitType` enum provides type-safe unit IDs
- Component props are fully typed for better development experience

## Code Conventions

1. Use functional components with hooks
2. TypeScript strict mode is enabled - ensure all code is properly typed
3. Use Redux Toolkit patterns for state management
4. Tailwind CSS for styling - use utility classes, avoid custom CSS
5. Component files should export a single component as default
6. Keep components focused and single-purpose
7. Use Framer Motion for animations when needed

## Testing Approach

The project uses Jest with React Testing Library. Currently minimal test coverage exists (only App.test.tsx). When adding tests:
- Place test files next to the component being tested
- Use `.test.tsx` extension
- Focus on user interactions and behavior, not implementation details
- Mock Redux store when testing connected components

## Important Notes

- The project name in package.json is generic ("my-project") - consider updating if deploying
- Vercel Analytics is integrated for production metrics
- All unit images are stored in `frontend/public/images/`
- The app is fully responsive using Tailwind's responsive utilities
- No backend API - all data is static from units.json