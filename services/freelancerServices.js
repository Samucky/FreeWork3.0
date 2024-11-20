import freelancerRepository from '../repositories/freelancerRepository.js';

async function getAllFreelancers() {
    return await freelancerRepository.getFreelancers();
}

async function addFreelancer(freelancer) {
    if (!freelancer.nombre || !freelancer.email || !freelancer.telefono || !freelancer.especialidad) {
        throw new Error("Todos los campos del freelancer son obligatorios.");
    }
    await freelancerRepository.saveFreelancer(freelancer);
    return freelancer;
}

async function updateFreelancer(id, updatedFreelancer) {
    const freelancers = await freelancerRepository.getFreelancers();
    const freelancer = freelancers.find(free => free.id === parseInt(id));

    if (!freelancer) {
        throw new Error('Freelancer no encontrado');
    }

    await freelancerRepository.updateFreelancer(id, updatedFreelancer);
    return { ...freelancer, ...updatedFreelancer };
}

async function deleteFreelancer(id) {
    const freelancers = await freelancerRepository.getFreelancers();
    const freelancer = freelancers.find(free => free.id === parseInt(id));

    if (!freelancer) {
        throw new Error('Freelancer no encontrado');
    }

    await freelancerRepository.deleteFreelancer(id);
    return { message: 'Freelancer eliminado' };
}

export default {
    getAllFreelancers,
    addFreelancer,
    updateFreelancer,
    deleteFreelancer
};
