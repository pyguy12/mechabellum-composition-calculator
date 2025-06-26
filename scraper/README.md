# Mechabellum Counter Data Scraper

This automated scraper fetches unit counter data from mechamonarch.com and updates the `units.json` file in the frontend application.

## Features

- 🤖 Automated web scraping using Puppeteer
- ✅ Data validation and integrity checks
- 📊 Change detection and reporting
- 🔄 GitHub Actions integration for daily updates
- 📝 Automatic pull request creation
- 🛡️ Error handling and retry logic

## Setup

### Local Development

1. Install dependencies:
   ```bash
   cd scraper
   npm install
   ```

2. Run the scraper:
   ```bash
   npm start
   ```

### Manual Commands

- **Run scraper**: `npm start` or `node src/scraper.js`
- **Test parser only**: `node src/parser.js`
- **Validate existing data**: `node src/validator.js`

## How It Works

1. **Scraping**: Uses Puppeteer to navigate to the counter list page
2. **Parsing**: Extracts counter relationships from HTML content
3. **Validation**: Ensures data integrity and bidirectional relationships
4. **Comparison**: Detects changes from existing data
5. **Update**: Modifies `units.json` with new counter data
6. **Backup**: Creates timestamped backups before updates

## GitHub Actions Workflow

The scraper runs automatically:
- **Daily**: At 2 AM UTC
- **On push**: When scraper code is modified
- **Manual**: Via workflow dispatch

When changes are detected, it creates a pull request for review.

## Data Structure

The scraper updates the `counters` property for each unit:

```json
{
  "id": 1,
  "name": "Farseer",
  "counters": {
    "effectiveAgainst": [20, 8, 13, 18],
    "counteredBy": [24, 21, 9]
  }
}
```

## Configuration

Edit `src/config.js` to modify:
- Target URL
- Unit name mappings
- Retry settings
- File paths

## Error Handling

- **Network failures**: Automatic retries with exponential backoff
- **Parse errors**: Detailed logging and validation reports
- **Data corruption**: Backup system prevents data loss
- **GitHub Actions**: Creates issues on failure

## Troubleshooting

1. **No data found**: Check if the website structure has changed
2. **Validation errors**: Review the parser logic for edge cases
3. **GitHub Actions failing**: Check workflow logs and artifacts

## Future Improvements

- [ ] Support for multiple data sources
- [ ] API endpoint monitoring
- [ ] Visual diff reports in PRs
- [ ] Slack/Discord notifications
- [ ] Historical data tracking