import { Pool } from 'pg';

const pool = new Pool({
    user: 'postgres',
    password: '81023890',
    host: 'localhost',
    port: 5432,
    database: 'virtual'
})

export default pool;