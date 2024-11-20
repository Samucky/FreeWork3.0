import contratoRepository from '../repositories/contratoRepository.js';

async function getAllContratos() {
    return await contratoRepository.getContratos();
}

async function addContrato(contrato) {
    if (!contrato.empresaId || !contrato.freelancerId || !contrato.fechaInicio || !contrato.fechaFin) {
        throw new Error("Todos los campos del contrato son obligatorios.");
    }
    await contratoRepository.saveContrato(contrato);
    return contrato;
}

async function updateContrato(id, updatedContrato) {
    const contratos = await contratoRepository.getContratos();
    const contrato = contratos.find(cont => cont.id === parseInt(id));

    if (!contrato) {
        throw new Error('Contrato no encontrado');
    }

    await contratoRepository.updateContrato(id, updatedContrato);
    return { ...contrato, ...updatedContrato };
}

async function deleteContrato(id) {
    const contratos = await contratoRepository.getContratos();
    const contrato = contratos.find(cont => cont.id === parseInt(id));

    if (!contrato) {
        throw new Error('Contrato no encontrado');
    }

    await contratoRepository.deleteContrato(id);
    return { message: 'Contrato eliminado' };
}

export default {
    getAllContratos,
    addContrato,
    updateContrato,
    deleteContrato
};
