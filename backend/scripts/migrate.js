// scripts/migrate.js
const { migrate } = require('../db/migrations/add_forum_tables');

migrate()
  .then(() => {
    console.log('Migration complete');
    process.exit(0);
  })
  .catch(console.error);
