const { response } = require("express");
const bcrypt = require('bcryptjs');
const Usuario = require('../models/usuario');
const { generarJWT } = require("../helpers/jwt");
const { googleVerify } = require("../helpers/google-verify");
const { getMenu } = require("../helpers/menu-frontend");


const login = async(req, res = response ) => {

    const { email, password } = req.body;
    try {

        const usuarioDb = await Usuario.findOne({ email });

        if(!usuarioDb) {
            return res.status(404). json({
                ok: false,
                msg: 'email no encontrado'
            })
        }

        const validPaswword = bcrypt.compareSync(password, usuarioDb.password);

        if(!validPaswword) {
            return res.status(400).json({
                ok: false,
                msg: 'contraseña no valida'
            })
        }


        const token = await generarJWT( usuarioDb.id );
        res.json({
            ok: true,
            token,
            menu: getMenu( usuarioDb.role)
        })
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error Inesperado'
        })
    }
}

const googleSignIn = async(req, res = response ) => {

    try {

        // const googleUser = await googleVerify( req.body.token );
        const { email, name, picture } = await googleVerify( req.body.token );

        const usuarioDB = await Usuario.findOne({ email });
        let usuario;

        if ( !usuarioDB) {
            usuario = new Usuario( {
                nombre: name,
                email,
                password: '@@@',
                img: picture,
                google: true

            })
        }else {
            usuario = usuarioDB,
            usuario.google = true
            // usuario.password = '@@'
        }

        await usuario.save();

        const token = await generarJWT( usuario.id );


        res.json({
            ok: true,
            email, name, picture,
            token,
            menu: getMenu( usuario.role)
        });
        
    } catch (error) {
        console.log( error );
        res.status(500).json({
            ok: false,
            msg: 'Token de Google no es correcto'
        })
    }

    
    

}

const renewToken = async(req, res = response) => {
    const uid = req.uid;

    const token = await generarJWT( uid );
    const usuario = await Usuario.findById( uid );
    res.json({
        ok: true,
        token,
        usuario,
        menu: getMenu( usuario.role)
    })
}

module.exports = {
    login,
    googleSignIn,
    renewToken
}