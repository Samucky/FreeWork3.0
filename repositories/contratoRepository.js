import { query } from '../db.js';
import Contrato from '../models/contratoModels.js';

async function getContratos() {
    try {
        const result = await query('SELECT * FROM Contratos');
        return result.map(contrato => new Contrato(
            contrato.ContratoID, contrato.FreelancerID, contrato.EmpresaID, contrato.ProyectoID,
            contrato.FechaInicio, contrato.FechaFin, contrato.Monto, contrato.Descripcion, contrato.Estado
        ));
    } catch (error) {
        console.error('Error al obtener contratos:', error);
        throw error;
    }
}

async function saveContrato(contrato) {
    try {
        const queryText = `
            INSERT INTO Contratos (FreelancerID, EmpresaID, ProyectoID, FechaInicio, FechaFin, Monto, Descripcion, Estado)
            VALUES (${contrato.freelancerId}, ${contrato.empresaId}, ${contrato.proyectoId},
                    '${contrato.fechaInicio}', '${contrato.fechaFin}', ${contrato.monto}, '${contrato.descripcion}', '${contrato.estado}')
        `;
        await query(queryText);
    } catch (error) {
        console.error('Error al guardar el contrato:', error);
        throw error;
    }
}

export default {
    getContratos,
    saveContrato
};
