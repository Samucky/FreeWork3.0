import { query } from '../db.js';
import Empresa from '../models/empresaModels.js';

async function getEmpresas() {
    try {
        const result = await query('SELECT * FROM Empresas');
        
        // Inspeccionamos el resultado completo
        console.log('Resultado completo de la consulta:', result);

        if (!result || !result.recordset) {
            throw new Error('No se obtuvo un conjunto de resultados válido');
        }

        const empresas = result.recordset;

        // Verificamos el tipo de 'empresas'
        console.log('Empresas obtenidas:', empresas);

        return empresas.map(empresa => new Empresa(
            empresa.EmpresaID, empresa.Nombre, empresa.Direccion, empresa.Telefono, empresa.Email
        ));
    } catch (error) {
        console.error('Error al obtener empresas:', error);
        throw error;
    }
}



// Obtener una empresa por ID
async function getEmpresaById(id) {
    try {
        const result = await query('SELECT * FROM Empresas WHERE EmpresaID = @id', [id]);
        if (result.recordset.length > 0) {
            return new Empresa(
                result.recordset[0].EmpresaID, result.recordset[0].Nombre, result.recordset[0].Direccion, 
                result.recordset[0].Telefono, result.recordset[0].Email
            );
        }
        return null;
    } catch (error) {
        console.error('Error al obtener la empresa:', error);
        throw error;
    }
}

// Guardar una nueva empresa
async function saveEmpresa(empresa) {
    try {
        const queryText = `
            INSERT INTO Empresas (Nombre, Direccion, Telefono, Email)
            VALUES (@nombre, @direccion, @telefono, @email)
        `;
        await query(queryText, [empresa.nombre, empresa.direccion, empresa.telefono, empresa.email]);
    } catch (error) {
        console.error('Error al guardar la empresa:', error);
        throw error;
    }
}

// Actualizar una empresa existente
async function updateEmpresa(id, empresa) {
    try {
        const queryText = `
            UPDATE Empresas 
            SET Nombre = @nombre, Direccion = @direccion, 
                Telefono = @telefono, Email = @email
            WHERE EmpresaID = @id
        `;
        await query(queryText, [empresa.nombre, empresa.direccion, empresa.telefono, empresa.email, id]);
    } catch (error) {
        console.error('Error al actualizar la empresa:', error);
        throw error;
    }
}

// Eliminar una empresa
async function deleteEmpresa(id) {
    try {
        const queryText = `DELETE FROM Empresas WHERE EmpresaID = @id`;
        await query(queryText, [id]);
    } catch (error) {
        console.error('Error al eliminar la empresa:', error);
        throw error;
    }
}

export default {
    getEmpresas,
    getEmpresaById,
    saveEmpresa,
    updateEmpresa,
    deleteEmpresa
};
