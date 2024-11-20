import express from "express";
import { check, validationResult } from "express-validator";
import freelancerService from "../services/freelancerServices.js";

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


// Ruta para crear un nuevo freelancer
router.post(
    "/freelancers",
    [
        check("nombre").not().isEmpty().withMessage("El nombre es requerido"),
        check("email").isEmail().withMessage("El email es inválido"),
        check("habilidades").isArray().withMessage("Las habilidades deben ser un array"),
        check("telefono").not().isEmpty().withMessage("El teléfono es requerido"),
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            const { nombre, email, habilidades, telefono } = req.body;
            const newFreelancer = { nombre, email, habilidades, telefono };
            await freelancerService.saveFreelancer(newFreelancer);

            res.status(201).json({ message: "Freelancer creado exitosamente" });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
);

// Ruta para actualizar un freelancer
router.put("/freelancers/:id", async (req, res) => {
    try {
        const updatedFreelancer = await freelancerService.updateFreelancer(req.params.id, req.body);
        res.json(updatedFreelancer);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});

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
