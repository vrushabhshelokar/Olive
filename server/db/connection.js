const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
const config = require('../config/env');
const { newDb } = require('pg-mem');

let pool;
let isInMemory = false;

async function initDbConnection() {
  const schemaSql = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');
  const seedSql = fs.readFileSync(path.join(__dirname, 'seed.sql'), 'utf8');

  // Attempt real PostgreSQL connection first
  const realPool = new Pool({
    host: config.db.host,
    port: config.db.port,
    database: config.db.name,
    user: config.db.user,
    password: config.db.password,
    connectionTimeoutMillis: 3000,
  });

  try {
    const client = await realPool.connect();
    console.log(`[Database] Connected to PostgreSQL server at ${config.db.host}:${config.db.port}/${config.db.name}`);
    client.release();

    // Run schema & seed on real database if needed
    try {
      await realPool.query(schemaSql);
      await realPool.query(seedSql);
      console.log('[Database] PostgreSQL schema and seed data loaded successfully.');
    } catch (seedErr) {
      console.log('[Database] PostgreSQL schema/seed notice:', seedErr.message);
    }

    pool = realPool;
  } catch (err) {
    console.log('[Database] Could not connect to external PostgreSQL server. Falling back to embedded in-memory PostgreSQL (pg-mem).');
    isInMemory = true;
    
    // Initialize pg-mem
    const db = newDb();
    
    // Register setval mock function if needed by seed script
    db.public.registerFunction({
      name: 'setval',
      args: ['text', 'bigint'],
      returns: 'bigint',
      implementation: (seqName, val) => val,
    });

    const pgMemAdapter = db.adapters.createPg();
    const memPool = new pgMemAdapter.Pool();

    // Execute schema and seed
    try {
      await memPool.query(schemaSql);
      await memPool.query(seedSql);
      console.log('[Database] Embedded pg-mem initialized with schema and seed data.');
    } catch (memInitErr) {
      console.error('[Database] Failed initializing pg-mem schema/seed:', memInitErr.message);
    }

    pool = memPool;
  }
}

module.exports = {
  initDbConnection,
  query: (text, params) => pool.query(text, params),
  getClient: () => pool.connect(),
  getPool: () => pool,
  isInMemory: () => isInMemory,
};
