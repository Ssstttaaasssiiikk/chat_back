import { Pool } from 'pg';

const pool = new Pool({
    user: process.env.PG_USER,
    password: process.env.PG_PASS,
    host: process.env.PG_HOST,
    port: +(process.env.PG_PORT || 5432),
    database: process.env.PG_DB
})

export default pool;