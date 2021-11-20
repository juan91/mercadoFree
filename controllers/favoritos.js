const { response } = require('express');
const { Favorito } = require('../models');


const obtenerFavoritos = async(req, res = response ) => {
  console.log(req.usuario);
  const { id } = req.usuario;

  const favoritos = await Favorito.find({usuario: id}).sort({ "_id": -1 });
    res.json({
      favoritos
    });
 }

 const borrarFavorito = async(req, res = response ) => {
  console.log(req.usuario);
  const { id } = req.params;
  
  const favoritos = await Favorito.findByIdAndDelete(id);
    res.json({
      favoritos
    });
 }



const crearFavorito= async(req, res = response ) => {
    const {id} = req.usuario;
    const {  usuario, ...body } = req.body;
    const data = {
      ...body,    
      usuario: req.usuario._id
    }
    const categoriaDB = await Favorito.findOne({ producto: data.producto, usuario: id});

    if ( categoriaDB ) {
      const ress = await categoriaDB.delete();// findByIdAndDelete(data.producto );
        return res.status(200).json({
            msg: `Favorito ${ categoriaDB.nombre }, ya existe`
        });
    }

    const favorito = new Favorito( data );

    // Guardar DB
    await favorito.save();

    res.status(201).json(favorito);

}



module.exports = {
  crearFavorito,
  obtenerFavoritos,
  borrarFavorito
}