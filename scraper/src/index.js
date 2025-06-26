import MechabellumScraper from './scraper.js';

// Entry point for the scraper
async function main() {
  console.log('Mechabellum Counter Data Scraper v1.0.0');
  console.log('=====================================\n');
  
  const scraper = new MechabellumScraper();
  
  try {
    const result = await scraper.run();
    
    if (result.hasChanges) {
      console.log('\n✅ Scraping completed with changes:');
      console.log(`   - Updated ${result.updatedUnits} units`);
      console.log('\nChange Report:');
      console.log(result.report);
    } else {
      console.log('\n✅ Scraping completed - no changes detected');
    }
    
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Scraping failed:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

main();