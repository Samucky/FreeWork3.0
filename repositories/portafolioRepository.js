import { query } from '../db.js';
import Portafolio from '../models/portafolioModels.js';

async function getPortafolios() {
    try {
        const result = await query('SELECT * FROM Portafolios');
        return result.map(portafolio => new Portafolio(
            portafolio.PortafolioID, portafolio.FreelancerID, portafolio.Url, portafolio.Descripcion
        ));
    } catch (error) {
        console.error('Error al obtener portafolios:', error);
        throw error;
    }
}

async function savePortafolio(portafolio) {
    try {
        const queryText = `
            INSERT INTO Portafolios (FreelancerID, Url, Descripcion)
            VALUES (${portafolio.freelancerId}, '${portafolio.url}', '${portafolio.descripcion}')
        `;
        await query(queryText);
    } catch (error) {
        console.error('Error al guardar el portafolio:', error);
        throw error;
    }
}

export default {
    getPortafolios,
    savePortafolio
};
