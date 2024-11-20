import express from 'express';
import cors from 'cors';
import { query, closeConnection } from './db.js'; // Importación del módulo de conexión a MySQL
import empresaController from './controllers/empresaControllers.js';
import freelancer from './controllers/freelancerControllers.js'

const app = express();
const PORT = process.env.PORT || 3000;

// Configuración de middlewares
app.use(cors());
app.use(express.json());

// Servir archivos estáticos desde la carpeta "public"
app.use(express.static('public'));

// Ruta de bienvenida
app.get('/', (req, res) => {
    res.send('Bienvenido a la API');
});

// Rutas de controladores
app.use('/api', empresaController);
app.use('/api', freelancer);


// Manejo de errores para rutas no encontradas
app.use((req, res) => {
    res.status(404).json({ error: 'Ruta no encontrada' });
});

// Iniciar el servidor
app.listen(PORT, async () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
    try {
        // Verificar la conexión a la base de datos
        const testQuery = 'SELECT 1 AS result';
        const result = await query(testQuery);
        console.log('Conexión a la base de datos verificada:', result);
    } catch (error) {
        console.error('Error al conectar con la base de datos:', error);
        process.exit(1); // Terminar el proceso si hay un error con la base de datos
    }
});

// Cerrar la conexión cuando el proceso termina
process.on('SIGINT', async () => {
    try {
        await closeConnection();
        console.log('Conexión a la base de datos cerrada.');
    } catch (error) {
        console.error('Error al cerrar la conexión:', error);
    }
    process.exit(0);
});
