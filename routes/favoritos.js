const { Router } = require('express');
const { check } = require('express-validator');

const { validarJWT, validarCampos, esAdminRole } = require('../middlewares');

const { crearFavorito, obtenerFavoritos, borrarFavorito } = require('../controllers/favoritos');

const router = Router();

/**
 * {{url}}/api/categorias
 */

//  Obtener todas las categorias - publico
router.get('/', validarJWT, obtenerFavoritos );

// Crear categoria - privado - cualquier persona con un token válido
router.post('/', [ 
    validarJWT,
    check('nombre','El nombre es obligatorio').not().isEmpty(),
    validarCampos
], crearFavorito );


// Borrar una categoria - Admin
router.delete('/:id',[
    validarJWT,  
    check('id', 'No es un id de Mongo válido').isMongoId(),
],borrarFavorito);



module.exports = router;