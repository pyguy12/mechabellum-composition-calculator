import puppeteer from 'puppeteer';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { SCRAPER_CONFIG } from './config.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function debugScraper() {
  let browser;
  
  try {
    console.log('Starting debug scraper...');
    
    // Launch browser in non-headless mode for debugging
    browser = await puppeteer.launch({
      headless: false,
      devtools: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    const page = await browser.newPage();
    await page.setUserAgent(SCRAPER_CONFIG.userAgent);
    await page.setViewport(SCRAPER_CONFIG.viewport);
    
    console.log(`Navigating to ${SCRAPER_CONFIG.targetUrl}...`);
    
    // Navigate with detailed logging
    page.on('console', msg => console.log('PAGE LOG:', msg.text()));
    page.on('pageerror', error => console.log('PAGE ERROR:', error.message));
    
    await page.goto(SCRAPER_CONFIG.targetUrl, {
      waitUntil: 'networkidle2',
      timeout: 60000
    });
    
    console.log('Page loaded, waiting for content...');
    
    // Get page info
    const pageInfo = await page.evaluate(() => {
      return {
        title: document.title,
        url: window.location.href,
        bodyClasses: document.body.className,
        h2Count: document.querySelectorAll('h2').length,
        h3Count: document.querySelectorAll('h3').length,
        imgCount: document.querySelectorAll('img').length,
        tableCount: document.querySelectorAll('table').length,
        mainSelectors: {
          hasEntryContent: !!document.querySelector('.entry-content'),
          hasArticle: !!document.querySelector('article'),
          hasMain: !!document.querySelector('main'),
          hasContent: !!document.querySelector('.content, #content'),
        },
        sampleH2s: Array.from(document.querySelectorAll('h2')).slice(0, 5).map(h => h.textContent),
        sampleImages: Array.from(document.querySelectorAll('img')).slice(0, 10).map(img => ({
          alt: img.alt,
          src: img.src.split('/').pop()
        }))
      };
    });
    
    console.log('\n=== Page Information ===');
    console.log(JSON.stringify(pageInfo, null, 2));
    
    // Save full page HTML
    const debugDir = path.join(process.cwd(), 'debug');
    await fs.mkdir(debugDir, { recursive: true });
    
    const pageContent = await page.content();
    const htmlPath = path.join(debugDir, 'full-page.html');
    await fs.writeFile(htmlPath, pageContent);
    console.log(`\nFull page HTML saved to: ${htmlPath}`);
    
    // Save screenshot
    const screenshotPath = path.join(debugDir, 'debug-screenshot.png');
    await page.screenshot({ path: screenshotPath, fullPage: true });
    console.log(`Screenshot saved to: ${screenshotPath}`);
    
    // Try to find counter sections
    const counterSections = await page.evaluate(() => {
      const sections = [];
      
      // Look for "How to play" sections
      document.querySelectorAll('h2').forEach(h2 => {
        if (h2.textContent.includes('How to play')) {
          const unitName = h2.textContent.replace('How to play', '').trim();
          let elem = h2.nextElementSibling;
          const section = {
            unitName,
            usedAgainstFound: false,
            counteredByFound: false,
            content: []
          };
          
          while (elem && elem.tagName !== 'H2') {
            const text = elem.textContent;
            if (text.includes('Used against') || text.includes('Effective against')) {
              section.usedAgainstFound = true;
            }
            if (text.includes('Countered by') || text.includes('Weak against')) {
              section.counteredByFound = true;
            }
            section.content.push({
              tag: elem.tagName,
              text: text.substring(0, 100)
            });
            elem = elem.nextElementSibling;
          }
          
          sections.push(section);
        }
      });
      
      return sections;
    });
    
    console.log('\n=== Counter Sections Found ===');
    console.log(JSON.stringify(counterSections.slice(0, 3), null, 2));
    
    console.log('\n✅ Debug information collected. Check the debug/ directory for files.');
    console.log('\nPress Ctrl+C to close the browser...');
    
    // Keep browser open for manual inspection
    await new Promise(() => {});
    
  } catch (error) {
    console.error('Debug error:', error);
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

debugScraper();