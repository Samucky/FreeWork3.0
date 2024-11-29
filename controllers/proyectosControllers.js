import express from "express";
import { check, validationResult } from "express-validator";
import { query } from "../db.js";

const router = express.Router();

// Obtener todos los proyectos
router.get("/proyectos", async (req, res) => {
  try {
    const sqlQuery = "SELECT * FROM Proyectos";
    const proyectos = await query(sqlQuery);
    res.json(proyectos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Crear un proyecto
router.post(
  "/proyectos",
  [
    check("EmpresaID").isInt().withMessage("El ID de la empresa es requerido"),
    check("NombreProyecto")
      .not()
      .isEmpty()
      .withMessage("El nombre del proyecto es requerido"),
    check("Descripcion").optional().isString().withMessage("Descripción inválida"),
    check("FechaInicio").optional().isDate().withMessage("Fecha de inicio inválida"),
    check("FechaFin").optional().isDate().withMessage("Fecha de fin inválida"),
    check("Estado")
      .optional()
      .isIn(["activo", "inactivo", "completado"])
      .withMessage("Estado inválido"),
  ],
  async (req, res) => {
    // Validar los datos de entrada
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      EmpresaID,
      NombreProyecto,
      Descripcion,
      FechaInicio,
      FechaFin,
      Estado,
    } = req.body;

    try {
      const insertQuery = `
        INSERT INTO Proyectos (EmpresaID, NombreProyecto, Descripcion, FechaInicio, FechaFin, Estado)
        VALUES (?, ?, ?, ?, ?, ?);
      `;
      await query(insertQuery, [
        EmpresaID,
        NombreProyecto,
        Descripcion,
        FechaInicio,
        FechaFin,
        Estado,
      ]);
      res.status(201).json({ message: "Proyecto creado exitosamente" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

// Endpoint para buscar proyectos por EmpresaID
router.get("/proyectos/:empresaId", async (req, res) => {
    const empresaId = req.params.empresaId;

    // Validación del parametro EmpresaID
    if (!empresaId || isNaN(empresaId)) {
        return res.status(400).json({ error: "El parametro EmpresaID es inválido" });
    }

    try {
        // Consulta SQL para obtener proyectos de una empresa
        const sqlQuery = `
            SELECT * 
            FROM Proyectos 
            WHERE EmpresaID = ?;
        `;

        const proyectos = await query(sqlQuery, [empresaId]);

        if (proyectos.length > 0) {
            res.json(proyectos);
        } else {
            res.status(404).json({ message: "No se encontraron proyectos para esta empresa" });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});



// Actualizar un proyecto
router.put("/proyectos/:id", async (req, res) => {
  const { NombreProyecto, Descripcion, FechaInicio, FechaFin, Estado } = req.body;
  const proyectoID = req.params.id;

  const updateQuery = `
    UPDATE Proyectos 
    SET 
      NombreProyecto = ?, 
      Descripcion = ?, 
      FechaInicio = ?, 
      FechaFin = ?, 
      Estado = ? 
    WHERE ProyectoID = ?;
  `;

  try {
    const result = await query(updateQuery, [
      NombreProyecto,
      Descripcion,
      FechaInicio,
      FechaFin,
      Estado,
      proyectoID,
    ]);

    if (result.affectedRows > 0) {
      res.json({ message: "Proyecto actualizado exitosamente" });
    } else {
      res.status(404).json({ error: "Proyecto no encontrado" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Eliminar un proyecto
router.delete("/proyectos/:id", async (req, res) => {
  const proyectoID = req.params.id;

  const deleteQuery = `
    DELETE FROM Proyectos 
    WHERE ProyectoID = ?;
  `;

  try {
    const result = await query(deleteQuery, [proyectoID]);

    if (result.affectedRows > 0) {
      res.status(200).json({ message: "Proyecto eliminado exitosamente" });
    } else {
      res.status(404).json({ error: "Proyecto no encontrado" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
