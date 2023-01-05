/*
Ruta: /api/medicos
*/
const { Router } = require('express');
const { check } = require('express-validator');


const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');
const {
    getMedicos,
    actualizarMedico,
    crearMedico,
    borrarMedico
} = require('../controllers/medicos');

const router = Router();

router.get( '/', getMedicos);
router.post( 
    '/',
    [
        validarJWT,
        check('nombre', 'el nombre del medico es necesario').not().isEmpty(),
        check('hospital', 'el hospital id no es valido').isMongoId,
        validarCampos
    ],
    crearMedico
    );
router.put( 
    '/:id', 
    [
        validarJWT,
        check('nombre', 'el nombre del medico es necesario').not().isEmpty(),
        check('hospital', 'el hospital id no es valido').isMongoId,
        validarCampos
    ],
    actualizarMedico
    );
router.delete( 
    '/:id', 
    borrarMedico
    );


module.exports = router;