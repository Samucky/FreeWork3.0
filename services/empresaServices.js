import empresaRepository from '../repositories/empresaRepository.js';

async function getAllEmpresas() {
    return await empresaRepository.getEmpresas();
}


async function addEmpresa(empresa) {
    if (!empresa.nombre || !empresa.direccion || !empresa.telefono || !empresa.email) {
        throw new Error("Todos los campos de la empresa (nombre, direccion, telefono, email) son obligatorios.");
    }
    try {
        await empresaRepository.saveEmpresa(empresa);  // Aquí 'empresa' debe tener los campos correctos
        return empresa;
    } catch (error) {
        console.error('Error al guardar la empresa:', error);
        throw new Error('Error al guardar la empresa');
    }
}

async function updateEmpresa(id, updatedEmpresa) {
    const empresas = await empresaRepository.getEmpresas();
    const empresa = empresas.find(emp => emp.id === parseInt(id));

    if (!empresa) {
        throw new Error('Empresa no encontrada');
    }

    await empresaRepository.updateEmpresa(id, updatedEmpresa);
    return { ...empresa, ...updatedEmpresa };
}

async function deleteEmpresa(id) {
    console.log('ID recibido para eliminar:', id);
    const empresas = await empresaRepository.getEmpresas();
    
    if (!empresas || empresas.length === 0) {
        throw new Error('No hay empresas disponibles para eliminar.');
    }

    // Verifica si el ID recibido es correcto
    const empresa = empresas.find(emp => emp.EmpresaID === parseInt(id));

    if (!empresa) {
        console.log('No se encontró empresa con el ID:', id);
        throw new Error('Empresa no encontrada');
    }

    await empresaRepository.deleteEmpresa(id);
    return { message: 'Empresa eliminada' };
}

export default {
    getAllEmpresas,
    addEmpresa,
    updateEmpresa,
    deleteEmpresa
};
