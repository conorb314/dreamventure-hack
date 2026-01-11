// db/index.js
const sqlite3 = require('sqlite3');
const { open } = require('sqlite');

const dbPromise = open({
  filename: './database.sqlite',
  driver: sqlite3.Database
});

module.exports = {
  async get(sql, params = []) {
    const db = await dbPromise;
    return db.get(sql, params);
  },
  async all(sql, params = []) {
    const db = await dbPromise;
    return db.all(sql, params);
  },
  async run(sql, params = []) {
    const db = await dbPromise;
    return db.run(sql, params);
  }
};
