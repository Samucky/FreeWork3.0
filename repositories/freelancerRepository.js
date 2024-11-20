import { query } from '../db.js';
import Freelancer from '../models/freelancerModels.js';

async function getFreelancers() {
    try {
        const result = await query('SELECT * FROM Freelancers');
        return result.map(freelancer => new Freelancer(
            freelancer.FreelancerID, freelancer.Nombre, freelancer.Email, freelancer.Telefono, freelancer.Especialidad
        ));
    } catch (error) {
        console.error('Error al obtener freelancers:', error);
        throw error;
    }
}

async function saveFreelancer(freelancer) {
    try {
        const queryText = `
            INSERT INTO Freelancers (Nombre, Email, Telefono, Especialidad)
            VALUES ('${freelancer.nombre}', '${freelancer.email}', '${freelancer.telefono}', '${freelancer.especialidad}')
        `;
        await query(queryText);
    } catch (error) {
        console.error('Error al guardar el freelancer:', error);
        throw error;
    }
}

export default {
    getFreelancers,
    saveFreelancer
};
