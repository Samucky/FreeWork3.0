import express from "express";
import { check, validationResult } from 'express-validator';
import empresaService from "../services/empresaServices.js";
import { query } from '../db.js';
import Empresa from '../models/empresaModels.js';

const router = express.Router();



router.get("/empresas", async (req, res) => {
    try {
        // Consulta SQL directa para obtener todas las empresas
        const sqlQuery = "SELECT * FROM Empresas"; // Ajusta el nombre de la tabla según tu esquema
        const empresas = await query(sqlQuery);
        
        res.json(empresas);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


router.post("/empresas", 
    [
        check('nombre').not().isEmpty().withMessage('El nombre es requerido'),
        check('direccion').not().isEmpty().withMessage('La dirección es requerida'),
        check('telefono').not().isEmpty().withMessage('El teléfono es requerido'),
        check('email').isEmail().withMessage('El email es inválido')
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            const { nombre, direccion, telefono, email } = req.body;
            const newEmpresa = new Empresa(null, nombre, direccion, telefono, email);
            await empresaService.saveEmpresa(newEmpresa);

            res.status(201).json({ message: 'Empresa creada exitosamente' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
);


router.put("/empresas/:id", async (req, res) => {
    try {
        const updatedEmpresa = await empresaService.updateEmpresa(req.params.id, req.body);
        res.json(updatedEmpresa);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});

router.delete("/empresas/:id", async (req, res) => {
    try {
        const result = await empresaService.deleteEmpresa(req.params.id);
        res.json(result);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});

export default router;
