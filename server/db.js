import Database from "better-sqlite3";

const db = new Database("database.sqlite");

//create table if not exists
db.exec(`
  CREATE TABLE IF NOT EXISTS orders(
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  items TEXT NOT NULL,
  total REAL NOT NULL,
  date TEXT NOT NULL
  );
  `);

export default db;
