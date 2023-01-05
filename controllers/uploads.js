const path = require('path');
const fs = require('fs');
const { response, json } = require("express");
const { v4: uuidv4 } = require('uuid');
const { actualizarImagen } = require("../helpers/actualizar-imagen");


const fileUpload = (req, res = response) => {

    const tipo = req.params.tipo;
    const id = req.params.id;

    const tiposValidos = [ 'hospitales', 'medicos', 'usuarios'];

    if( !tiposValidos.includes(tipo) ){
        return res.status(400).json({
            ok: false,
            msg: 'no es un tipo valido'
        });
    }

    // validar que exista un archivo
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).json({
            ok: false,
            msg: 'no hay ningun archivo'
        });
      }


      const file = req.files.imagen;
      
      const nombreCortado = file.name.split('.');
      const extensionArchivo = nombreCortado[ nombreCortado.length - 1 ];

      const extensionesValidas = ['png', 'jpg', 'jpeg', 'gif'];
      if( !extensionesValidas.includes(extensionArchivo)) {
        return res.status(400).json({
            ok: false,
            msg: 'No es una extension valida'
        });
      }

      //generar nombre del archivo

      const nombreArchivo = `${ uuidv4() }.${ extensionArchivo }`;
      const path = `./uploads/${ tipo }/${ nombreArchivo }`;

      file.mv(path, (err) => {
        if (err) {
            console.log(err);
            return res.status(500).json({
                ok: false,
                msg: 'Error al mover la imagen'
            })
        }
    
        actualizarImagen(tipo, id, nombreArchivo);

        res.json({
            ok: true,
            msg: 'archivo subido',
            nombreArchivo
        })
      });


    
}

const retornaImagen = (req, res = response) => {

    const tipo = req.params.tipo;
    const foto = req.params.foto;

    const pathImage = path.join( __dirname, `../uploads/${ tipo }/${ foto }`); 
    
    if( fs.existsSync( pathImage )) {
        
        res.sendFile( pathImage );
    } else {
        const pathImage = path.join( __dirname, `../uploads/firmalovaton.jpg`); 
        res.sendFile( pathImage );

    }


}


module.exports = {
    fileUpload,
    retornaImagen
}