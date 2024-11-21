import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config(); // Cargar variables de entorno

// Configuración del pool de conexiones
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    waitForConnections: true,
    namedPlaceholders: true, 
    connectionLimit: 10,
    queueLimit: 0
});

// Consulta genérica
const query = async (queryText, params = []) => {
    try {
        const [rows] = await pool.execute(queryText, params);
        return rows;
    } catch (error) {
        console.error('Error al realizar la consulta:', error);
        throw error;
    }
};

// Cerrar el pool de conexiones
const closeConnection = async () => {
    try {
        await pool.end();
        console.log('Pool de conexiones cerrado.');
    } catch (error) {
        console.error('Error al cerrar el pool de conexiones:', error);
    }
};

export { query, closeConnection };
