const { response } = require('express');
const bcrypt = require('bcryptjs');

const Usuario = require('../models/usuario');
const { generarJWT } = require('../helpers/jwt');

const getUsuarios = async(req, res) => {

    const desde = Number(req.query.desde) || 0;
   
    // const usuarios = await Usuario.find({}, 'nombre correo role google')
    //                               .skip( desde )
    //                               .limit( 5 );
    // const total = await Usuario.count();    
    
    const [ usuarios, total ] = await Promise.all([
        Usuario
            .find({}, 'nombre email role google img')
            .skip( desde )
            .limit( 5 ), 
        Usuario.countDocuments()    

    ]);
    res.json({
        ok: true,
        usuarios,
        total        
        // usuarios: [
        //     {
        //         managerName: 'fernando',
        //         managerLastName: 'fernando',
        //         dniClient: '71002152',
        //         clientName: 'Jose',
        //         clientLastName: 'Lopez',
        //         startDate: '10/07/2022',
        //         endDate: '10/08/2022',
        //         itemType: 'unknow',
        //         DepartmentItem: 'Cusco',
        //         PronvinceItem: 'La convencion',
        //         districtItem: 'Maranura',
        //         reference: 'Maranura',
        //     }
        // ]
    });
}
const crearUsuarios = async(req, res = response) => {

    const { email , password} = req.body;

    

    try {

        const existeEmail = await Usuario.findOne({ email }); 

        if( existeEmail ) {
            return res.status(400).json({
                ok: false,
                msg: 'el correo ya esta registrado'
            })
        }

        const usuario = new Usuario(req.body);

        const salt = bcrypt.genSaltSync();
        usuario.password = bcrypt.hashSync( password, salt );

        await usuario.save();

        const token = await generarJWT( usuario.id );
        res.json({
            ok: true,
            msg: 'creando usuario',
            usuario,
            token
    });
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error Inesperado'
        })
    }
}



const actualizarUsuario = async ( req, res = response) => {

    const uid = req.params.id;
    try {

        const usuarioDb = await Usuario.findById( uid );

        if( !usuarioDb ) {
            return res.status(404).json({
                ok: false,
                msg: 'No existe un usuario por ese id'
            });
        }

const { password, google, email, ...campos } = req.body;

if( usuarioDb.email !== email ) {
    const existeEmail = await Usuario.findOne({ email })
    if (existeEmail) {
        return res.status(400).json({
            ok: false,
            msg: 'ya existe un usuario con este Email'
        });
    }
}
// porque desestructure
// delete campos.password;
// delete campos.google;

if(!usuarioDb.google) {

    campos.email = email;
}else if ( usuarioDb.email !== email){
    return res.status(400).json({
        ok: false,
        msg: 'Usuarios de google no pueden cambiar correo'
    });
}
const usuarioActualizado = await Usuario.findByIdAndUpdate( uid, campos, { new: true } );

        res.json({
            ok: true,
            usuario: usuarioActualizado
        })
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error Inesperado'
        })
    }

}

const borrarUsuario = async(req, res = response) => {
    const uid = req.params.id;

    try {

        const usuarioDb = await Usuario.findById( uid );

        if( !usuarioDb ) {
            return res.status(404).json({
                ok: false,
                msg: 'No existe un usuario por ese id'
            });
        }

        await Usuario.findByIdAndDelete( uid );

        res.json({
            ok: true,
            msg: 'Usuario Eliminado'
        })
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error Inesperado'
        });
    }
    
}

module.exports = {
    getUsuarios,
    crearUsuarios,
    actualizarUsuario,
    borrarUsuario,
}