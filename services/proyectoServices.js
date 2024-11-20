import proyectoRepository from '../repositories/proyectoRepository.js';

async function getAllProyectos() {
    return await proyectoRepository.getProyectos();
}

async function addProyecto(proyecto) {
    if (!proyecto.empresaId || !proyecto.nombre || !proyecto.descripcion || !proyecto.presupuesto) {
        throw new Error("Todos los campos del proyecto son obligatorios.");
    }
    await proyectoRepository.saveProyecto(proyecto);
    return proyecto;
}

async function updateProyecto(id, updatedProyecto) {
    const proyectos = await proyectoRepository.getProyectos();
    const proyecto = proyectos.find(proy => proy.id === parseInt(id));

    if (!proyecto) {
        throw new Error('Proyecto no encontrado');
    }

    await proyectoRepository.updateProyecto(id, updatedProyecto);
    return { ...proyecto, ...updatedProyecto };
}

async function deleteProyecto(id) {
    const proyectos = await proyectoRepository.getProyectos();
    const proyecto = proyectos.find(proy => proy.id === parseInt(id));

    if (!proyecto) {
        throw new Error('Proyecto no encontrado');
    }

    await proyectoRepository.deleteProyecto(id);
    return { message: 'Proyecto eliminado' };
}

export default {
    getAllProyectos,
    addProyecto,
    updateProyecto,
    deleteProyecto
};
