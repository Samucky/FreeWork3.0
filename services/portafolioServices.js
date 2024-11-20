import portafolioRepository from '../repositories/portafolioRepository.js';

async function getAllPortafolios() {
    return await portafolioRepository.getPortafolios();
}

async function addPortafolio(portafolio) {
    if (!portafolio.freelancerId || !portafolio.titulo || !portafolio.descripcion) {
        throw new Error("Todos los campos del portafolio son obligatorios.");
    }
    await portafolioRepository.savePortafolio(portafolio);
    return portafolio;
}

async function updatePortafolio(id, updatedPortafolio) {
    const portafolios = await portafolioRepository.getPortafolios();
    const portafolio = portafolios.find(port => port.id === parseInt(id));

    if (!portafolio) {
        throw new Error('Portafolio no encontrado');
    }

    await portafolioRepository.updatePortafolio(id, updatedPortafolio);
    return { ...portafolio, ...updatedPortafolio };
}

async function deletePortafolio(id) {
    const portafolios = await portafolioRepository.getPortafolios();
    const portafolio = portafolios.find(port => port.id === parseInt(id));

    if (!portafolio) {
        throw new Error('Portafolio no encontrado');
    }

    await portafolioRepository.deletePortafolio(id);
    return { message: 'Portafolio eliminado' };
}

export default {
    getAllPortafolios,
    addPortafolio,
    updatePortafolio,
    deletePortafolio
};
