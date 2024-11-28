import express from "express";
import { check, validationResult } from "express-validator";
import freelancerService from "../services/freelancerServices.js";
import { query } from '../db.js';


const router = express.Router();

// Ruta para obtener freelancers con paginación
router.get("/freelancers", async (req, res) => {
    try {
        const freelancers = await freelancerService.getAllFreelancers(); // Asumiendo que esta función obtiene todos los freelancers
        res.json(freelancers);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
router.get('/freelancers/:page', async (req, res) => {
    const { page } = req.params;

    const pageNumber = parseInt(page, 10);
    if (isNaN(pageNumber) || pageNumber < 1) {
        return res.status(400).send('Número de página inválido');
    }

    const limit = 50;  
    const offset = (pageNumber - 1) * limit; 

    console.log('Limit:', limit);
    console.log('Offset:', offset);

    try {
        const freelancers = await query(
            `SELECT * FROM Freelancers ORDER BY FreelancerID LIMIT ${limit} OFFSET ${offset}`
        );

        res.json(freelancers);
    } catch (error) {
        console.error('Error al obtener freelancers:', error);
        res.status(500).send('Error al obtener freelancers');
    }
});

// Ruta para crear un nuevo freelancer
router.post(
    "/freelancers",
    [
        check("nombre").not().isEmpty().withMessage("El nombre es requerido"),
        check("email").isEmail().withMessage("El email es inválido"),
        check("telefono").not().isEmpty().withMessage("El teléfono es requerido"),
        check("especialidad").not().isEmpty().withMessage("La especialidad es requerida"),
    ],
    async (req, res) => {
        // Validar los campos recibidos
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            const { id } = req.params;  // Obtener el ID del freelancer desde los parámetros de la URL
            const { nombre, email, telefono, especialidad } = req.body;  // Obtener los datos de la solicitud

            // Consulta SQL para actualizar al freelancer
            const sqlQuery = `
                Insert into Freelancers
                SET Nombre = ?, Email = ?, Telefono = ?, Especialidad = ?
                WHERE FreelancerID = ?;
            `;

            // Ejecutar la consulta
            const result = await query(sqlQuery, [nombre, email, telefono, especialidad, id]);

            // Verificar si la actualización fue exitosa
            if (result.affectedRows === 0) {
                return res.status(404).json({ error: "Freelancer no encontrado o no actualizado" });
            }

            res.status(200).json({ message: "Freelancer actualizado exitosamente" });
        } catch (error) {
            console.error("Error al actualizar freelancer:", error);
            res.status(500).json({ error: error.message });
        }
    }
);




router.put(
    "/freelancers/:id",
    [
        check("nombre").not().isEmpty().withMessage("El nombre es requerido"),
        check("email").isEmail().withMessage("El email es inválido"),
        check("telefono").not().isEmpty().withMessage("El teléfono es requerido"),
        check("especialidad").not().isEmpty().withMessage("La especialidad es requerida"),
    ],
    async (req, res) => {
        // Validar los campos recibidos
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            const { id } = req.params;  // Obtener el ID del freelancer desde los parámetros de la URL
            const { nombre, email, telefono, especialidad } = req.body;  // Obtener los datos de la solicitud

            // Consulta SQL para actualizar al freelancer
            const sqlQuery = `
                UPDATE Freelancers
                SET Nombre = ?, Email = ?, Telefono = ?, Especialidad = ?
                WHERE FreelancerID = ?;
            `;

            // Ejecutar la consulta
            const result = await query(sqlQuery, [nombre, email, telefono, especialidad, id]);

            // Verificar si la actualización fue exitosa
            if (result.affectedRows === 0) {
                return res.status(404).json({ error: "Freelancer no encontrado o no actualizado" });
            }

            res.status(200).json({ message: "Freelancer actualizado exitosamente" });
        } catch (error) {
            console.error("Error al actualizar freelancer:", error);
            res.status(500).json({ error: error.message });
        }
    }
);


// Ruta para eliminar un freelancer
router.delete("/freelancers/:id", async (req, res) => {
    try {
        const result = await freelancerService.deleteFreelancer(req.params.id);
        res.json(result);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});

export default router;
