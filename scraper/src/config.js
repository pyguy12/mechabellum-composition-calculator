export const SCRAPER_CONFIG = {
  targetUrl: 'https://mechamonarch.com/guide/mechabellum-counters/',
  timeout: 30000,
  retryAttempts: 3,
  retryDelay: 5000,
  userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
  viewport: {
    width: 1920,
    height: 1080
  }
};

export const UNIT_NAME_MAPPING = {
  // Map website names to our unit IDs
  'farseer': 1,
  'tarantula': 2,
  'sandworm': 3,
  'fire badger': 4,
  'firebadger': 4,
  'typhoon': 5,
  'sabertooth': 6,
  'scorpion': 7,
  'wraith': 8,
  'war factory': 9,
  'warfactory': 9,
  'phoenix': 10,
  'arclight': 11,
  'hacker': 12,
  'sledgehammer': 13,
  'stormcaller': 14,
  'overlord': 15,
  'crawler': 16,
  'fang': 17,
  'steel ball': 18,
  'steelball': 18,
  'mustang': 19,
  'wasp': 20,
  'rhino': 21,
  'melting point': 22,
  'meltingpoint': 22,
  'marksman': 23,
  'fortress': 24,
  'vulcan': 25
};

export const PATHS = {
  unitsJson: '../frontend/src/data/units.json',
  backupDir: './backups',
  logsDir: './logs'
};