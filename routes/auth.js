const { Router } = require('express');
const { check } = require('express-validator');

const { login, googleSignIn, renewToken } = require('../controllers/auth');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');

const router = Router();

router.post( 
    '/',
     [
        check('email', 'el Email es obligatorio').isEmail(),
        check('password', 'el password es obligatorio').not().isEmpty(),
        validarCampos
     ],
     login
    )
router.post( 
    '/google',
     [
        
        check('token', 'el token de google es obligatorio').not().isEmpty(),
        validarCampos
     ],
     googleSignIn
    )
router.get( 
    '/renew',
    validarJWT,
    renewToken
    )


module.exports = router; 
