import { query } from '../db.js';
import Proyecto from '../models/proyectoModels.js';

async function getProyectos() {
    try {
        const result = await query('SELECT * FROM Proyectos');
        return result.map(proyecto => new Proyecto(
            proyecto.ProyectoID, proyecto.EmpresaID, proyecto.NombreProyecto, proyecto.Descripcion,
            proyecto.FechaInicio, proyecto.FechaFin, proyecto.Estado
        ));
    } catch (error) {
        console.error('Error al obtener proyectos:', error);
        throw error;
    }
}

async function saveProyecto(proyecto) {
    try {
        const queryText = `
            INSERT INTO Proyectos (EmpresaID, NombreProyecto, Descripcion, FechaInicio, FechaFin, Estado)
            VALUES (${proyecto.empresaId}, '${proyecto.nombreProyecto}', '${proyecto.descripcion}',
                    '${proyecto.fechaInicio}', '${proyecto.fechaFin}', '${proyecto.estado}')
        `;
        await query(queryText);
    } catch (error) {
        console.error('Error al guardar el proyecto:', error);
        throw error;
    }
}

export default {
    getProyectos,
    saveProyecto
};
