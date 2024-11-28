import express from "express";
import { check, validationResult } from 'express-validator';
import { query } from '../db.js';

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
router.post(
    "/login",
    [
        check("email").isEmail().withMessage("El email es inválido"),
        check("passwordE").not().isEmpty().withMessage("La contraseña es requerida"),
    ],
    async (req, res) => {
        // Validar los datos de entrada
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { email, passwordE } = req.body;

        try {
            // Consulta SQL para verificar las credenciales
            const loginQuery = `
                SELECT * 
                FROM Empresas 
                WHERE Email = ? AND passwordE = ?;
            `;

            // Ejecutar la consulta
            const [user] = await query(loginQuery, [email, passwordE]);

            if (!user) {
                return res.status(401).json({ error: "Credenciales incorrectas" });
            }

            // Respuesta exitosa con la información del usuario
            res.status(200).json({
                message: "Inicio de sesión exitoso",
                user: {
                    id: user.IdEmpresa,
                    nombre: user.Nombre,
                    email: user.Email,
                },
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
);


router.post("/empresas", 
    [
        check('nombre').not().isEmpty().withMessage('El nombre es requerido'),
        check('direccion').not().isEmpty().withMessage('La dirección es requerida'),
        check('telefono').not().isEmpty().withMessage('El teléfono es requerido'),
        check('email').isEmail().withMessage('El email es inválido'),
        check('passwordE').not().isEmpty().withMessage('El password es requerido'),
        check('AdrressIp').optional().isIP().withMessage('La IP no es válida') // IP es opcional, pero validada si se proporciona
    ], 
    async (req, res) => { 
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            const { nombre, direccion, telefono, email, passwordE, AdrressIp } = req.body;

            // Definir la consulta SQL para insertar
            const insertQuery = `
                INSERT INTO Empresas (Nombre, Direccion, Telefono, Email, passwordE, AdrressIp)
                VALUES (?, ?, ?, ?, ?, ?);
            `;

            // Ejecutar la consulta con los valores recibidos
            await query(insertQuery, [nombre, direccion, telefono, email, passwordE, AdrressIp]);

            // Respuesta exitosa
            res.status(201).json({ message: 'Empresa creada exitosamente' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
);


router.put("/empresas/:id", async (req, res) => {
    const { nombre, direccion, telefono, email, passwordE, AdrressIp } = req.body;
    const empresaID = req.params.id;
  
    // Consulta SQL para actualizar la empresa
    const queryText = `
      UPDATE Empresas 
      SET 
        Nombre = ?, 
        Direccion = ?, 
        Telefono = ?, 
        Email = ?, 
        passwordE = ?, 
        AdrressIp = ? 
      WHERE EmpresaID = ?;
    `;
  
    try {
      const result = await query(queryText, [nombre, direccion, telefono, email, passwordE, AdrressIp, empresaID]);
  
      if (result.affectedRows > 0) {
        res.json({ message: 'Empresa actualizada exitosamente' });
      } else {
        res.status(404).json({ error: 'Empresa no encontrada' });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  

  router.delete("/empresas/:id", async (req, res) => {
    const empresaID = req.params.id;

    // Consulta SQL para eliminar la empresa
    const sqlDeleteQuery = `
        DELETE FROM Empresas 
        WHERE EmpresaID = ?;
    `;

    try {
        // Ejecutar la consulta
        const result = await query(sqlDeleteQuery, [empresaID]);

        // Verificar si se eliminó alguna fila
        if (result.affectedRows > 0) {
            // Si la empresa fue eliminada, retornamos un estado 200 (OK)
            res.status(200).json({ message: 'Empresa eliminada exitosamente' });
        } else {
            // Si no se encontró la empresa, retornamos un estado 404 (No encontrado)
            res.status(404).json({ error: 'Empresa no encontrada' });
        }
    } catch (error) {
        // En caso de error en la consulta, retornamos un estado 500 (Error del servidor)
        res.status(500).json({ error: error.message });
    }
});

  
export default router;
