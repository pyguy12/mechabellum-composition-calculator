import puppeteer from 'puppeteer';
import { SCRAPER_CONFIG, UNIT_NAME_MAPPING, PATHS } from './config.js';
import { parseCounterData } from './parser.js';
import { validateScrapedData } from './validator.js';
import { updateUnitsJson } from './updater.js';
import fs from 'fs/promises';
import path from 'path';

class MechabellumScraper {
  constructor() {
    this.browser = null;
    this.page = null;
  }

  async initialize() {
    try {
      this.browser = await puppeteer.launch({
        headless: 'new',
        args: ['--no-sandbox', '--disable-setuid-sandbox']
      });
      
      this.page = await this.browser.newPage();
      await this.page.setUserAgent(SCRAPER_CONFIG.userAgent);
      await this.page.setViewport(SCRAPER_CONFIG.viewport);
      
      console.log('Browser initialized successfully');
    } catch (error) {
      console.error('Failed to initialize browser:', error);
      throw error;
    }
  }

  async scrapeCounterData() {
    let attempts = 0;
    const debugMode = process.env.DEBUG === 'true';
    
    while (attempts < SCRAPER_CONFIG.retryAttempts) {
      try {
        console.log(`Attempting to scrape counter data (attempt ${attempts + 1}/${SCRAPER_CONFIG.retryAttempts})`);
        
        // Navigate to the counter page
        await this.page.goto(SCRAPER_CONFIG.targetUrl, {
          waitUntil: 'networkidle2',
          timeout: SCRAPER_CONFIG.timeout
        });

        // Save screenshot for debugging
        if (debugMode || attempts > 0) {
          const screenshotPath = path.join(process.cwd(), 'debug', `screenshot-attempt-${attempts + 1}.png`);
          await fs.mkdir(path.dirname(screenshotPath), { recursive: true });
          await this.page.screenshot({ path: screenshotPath, fullPage: true });
          console.log(`Screenshot saved: ${screenshotPath}`);
        }

        // Wait for page to be ready - use a more flexible selector
        try {
          await this.page.waitForSelector('h2, h3, img', { timeout: 10000 });
        } catch (waitError) {
          console.log('Basic selectors not found, continuing anyway...');
        }

        // Add a small delay to ensure all content is loaded
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Extract the entire page content since there's no specific container
        const pageContent = await this.page.evaluate(() => {
          // Try multiple possible containers
          const body = document.body;
          const main = document.querySelector('main');
          const article = document.querySelector('article');
          const content = document.querySelector('.content, .post-content, .page-content, #content, .site-content, .main-content');
          
          // Return the most specific container found, or body as fallback
          const container = content || article || main || body;
          return container ? container.innerHTML : null;
        });

        if (!pageContent) {
          throw new Error('No content found on the page');
        }

        // Save HTML content for debugging
        if (debugMode || attempts > 0) {
          const htmlPath = path.join(process.cwd(), 'debug', `page-content-attempt-${attempts + 1}.html`);
          await fs.writeFile(htmlPath, pageContent);
          console.log(`HTML content saved: ${htmlPath}`);
        }

        // Parse the counter data
        const counterData = await parseCounterData(pageContent);
        
        // Validate the scraped data
        const validationResult = validateScrapedData(counterData);
        
        if (!validationResult.isValid) {
          throw new Error(`Data validation failed: ${validationResult.errors.join(', ')}`);
        }

        console.log('Successfully scraped and validated counter data');
        return counterData;
        
      } catch (error) {
        console.error(`Scraping attempt ${attempts + 1} failed:`, error.message);
        attempts++;
        
        if (attempts < SCRAPER_CONFIG.retryAttempts) {
          console.log(`Waiting ${SCRAPER_CONFIG.retryDelay}ms before retry...`);
          await new Promise(resolve => setTimeout(resolve, SCRAPER_CONFIG.retryDelay));
        }
      }
    }
    
    throw new Error('Failed to scrape data after maximum retry attempts');
  }

  async cleanup() {
    if (this.browser) {
      await this.browser.close();
      console.log('Browser closed');
    }
  }

  async run() {
    try {
      console.log('Starting Mechabellum counter data scraper...');
      
      await this.initialize();
      const scrapedData = await this.scrapeCounterData();
      
      // Create backup before updating
      await this.createBackup();
      
      // Update the units.json file
      const updateResult = await updateUnitsJson(scrapedData);
      
      if (updateResult.hasChanges) {
        console.log('Units data updated successfully');
        console.log(`Updated ${updateResult.updatedUnits} units`);
        
        // Log changes
        await this.logChanges(updateResult);
      } else {
        console.log('No changes detected in counter data');
      }
      
      return updateResult;
      
    } catch (error) {
      console.error('Scraper error:', error);
      throw error;
    } finally {
      await this.cleanup();
    }
  }

  async createBackup() {
    try {
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const backupDir = path.join(process.cwd(), 'backups');
      
      await fs.mkdir(backupDir, { recursive: true });
      
      const originalPath = path.join(process.cwd(), PATHS.unitsJson);
      const backupPath = path.join(backupDir, `units-${timestamp}.json`);
      
      await fs.copyFile(originalPath, backupPath);
      console.log(`Backup created: ${backupPath}`);
      
    } catch (error) {
      console.error('Failed to create backup:', error);
    }
  }

  async logChanges(updateResult) {
    try {
      const logsDir = path.join(process.cwd(), 'logs');
      await fs.mkdir(logsDir, { recursive: true });
      
      const logPath = path.join(logsDir, 'scraper.log');
      const timestamp = new Date().toISOString();
      
      const logEntry = `
[${timestamp}] Scraper Run
- Updated units: ${updateResult.updatedUnits}
- Changes: ${JSON.stringify(updateResult.changes, null, 2)}
---
`;
      
      await fs.appendFile(logPath, logEntry);
      
    } catch (error) {
      console.error('Failed to log changes:', error);
    }
  }
}

// Main execution
if (import.meta.url === `file://${process.argv[1]}`) {
  const scraper = new MechabellumScraper();
  scraper.run()
    .then(() => {
      console.log('Scraping completed successfully');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Scraping failed:', error);
      process.exit(1);
    });
}

export default MechabellumScraper;