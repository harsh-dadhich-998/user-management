// server/db.js
const { Pool } = require('pg');


const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'mydb',
  password: 'harshdad',
  port: 5432,
});

 console.log('✅ PostgreSQL Connected');



module.exports = pool;
