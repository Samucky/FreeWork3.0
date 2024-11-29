import express from "express";
import { check, validationResult } from "express-validator"; // Asegúrate de incluir esto

import { query } from '../db.js';

const router = express.Router();

// Ruta para obtener los contratos de una empresa y la información del freelancer
router.get("/contratos/:empresaId", async (req, res) => {
    try {
        // Obtener el parametro empresaId desde la URL
        const { empresaId } = req.params;

        // Consulta SQL para obtener los contratos de la empresa por EmpresaID
        const sqlQuery = `
            SELECT 
                c.ContratoID,
                c.FechaInicio,
                c.FechaFin,
                c.Monto,
                c.Descripcion,
                c.Estado,
                c.FreelancerID
            FROM Contratos c
            WHERE c.EmpresaID = ?
        `;

        // Ejecutar la consulta para obtener los contratos de la empresa
        const contratos = await query(sqlQuery, [empresaId]);

        // Verificar si se encontraron contratos
        if (contratos.length === 0) {
            return res.status(404).json({ message: "No se encontraron contratos para esta empresa." });
        }

        // Array para almacenar los contratos con la información del freelancer
        const contratosConFreelancer = [];

        // Iterar sobre los contratos para obtener la información del freelancer
        for (const contrato of contratos) {
            // Consulta SQL para obtener la información del freelancer
            const freelancerQuery = `
                SELECT 
                    f.FreelancerID,
                    f.Nombre,
                    f.Apellido,
                    f.Email,
                    f.Telefono
                FROM Freelancers f
                WHERE f.FreelancerID = ?
            `;

            // Ejecutar la consulta para obtener el freelancer por FreelancerID
            const freelancer = await query(freelancerQuery, [contrato.FreelancerID]);

            // Verificar si se encontró el freelancer
            if (freelancer.length > 0) {
                // Añadir el freelancer al contrato
                contrato.Freelancer = freelancer[0]; // Asumimos que solo habrá un freelancer con ese ID
            }

            // Añadir el contrato con la información del freelancer al array
            contratosConFreelancer.push(contrato);
        }

        // Responder con los contratos y la información del freelancer
        res.json(contratosConFreelancer);
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
