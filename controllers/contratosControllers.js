import express from "express";
import { check, validationResult } from "express-validator"; // Asegúrate de incluir esto

import { query } from '../db.js';

const router = express.Router();

// Ruta para obtener los contratos de una empresa y la información del freelancer
router.get("/contratos/:empresaId", async (req, res) => {
    try {
        // Obtener el parametro empresaId desde la URL
        const { empresaId } = req.params;

        // Consulta SQL para obtener los contratos filtrados por EmpresaID
        const sqlQuery = `
            SELECT *
            FROM Contratos
            WHERE EmpresaID = ?
        `;

        // Ejecutar la consulta para obtener los contratos
        const contratos = await query(sqlQuery, [empresaId]);

        // Verificar si se encontraron contratos
        if (contratos.length === 0) {
            return res.status(404).json({ message: "No se encontraron contratos para esta empresa." });
        }

        // Responder con los contratos filtrados por EmpresaID
        res.json(contratos);
    } catch (error) {
        // Manejo de errores
        console.error(error);
        res.status(500).json({ error: error.message });
    }
});

router.post(
    "/contratos",
    [
      check("FreelancerID").isInt().withMessage("FreelancerID debe ser un número entero"),
      check("EmpresaID").isInt().withMessage("EmpresaID debe ser un número entero"),
      check("ProyectoID").isInt().withMessage("ProyectoID debe ser un número entero"),
      check("FechaInicio").isISO8601().withMessage("FechaInicio debe tener un formato de fecha válido (YYYY-MM-DD)"),
      check("FechaFin").isISO8601().withMessage("FechaFin debe tener un formato de fecha válido (YYYY-MM-DD)"),
      check("Monto").isDecimal().withMessage("Monto debe ser un número decimal"),
      check("Descripcion").not().isEmpty().withMessage("Descripcion es requerida"),
      check("Estado").not().isEmpty().withMessage("Estado es requerido"),
    ],
    async (req, res) => {
      const errors = validationResult(req);
  
      // Validar datos de entrada
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
  
      const { FreelancerID, EmpresaID, ProyectoID, FechaInicio, FechaFin, Monto, Descripcion, Estado } = req.body;
  
      try {
        // Consulta SQL para insertar un nuevo contrato
        const insertQuery = `
          INSERT INTO Contratos 
            (FreelancerID, EmpresaID, ProyectoID, FechaInicio, FechaFin, Monto, Descripcion, Estado) 
          VALUES 
            (?, ?, ?, ?, ?, ?, ?, ?);
        `;
  
        const result = await query(insertQuery, [FreelancerID, EmpresaID, ProyectoID, FechaInicio, FechaFin, Monto, Descripcion, Estado]);
  
        // Verificar si la inserción fue exitosa
        if (result.affectedRows > 0) {
          res.status(201).json({
            message: "Contrato creado exitosamente",
            contratoID: result.insertId, // Retorna el ID del contrato generado
          });
        } else {
          res.status(400).json({ error: "No se pudo crear el contrato" });
        }
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    }
  );
  

export default router;
