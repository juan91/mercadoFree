const { response } = require('express');
const { Producto } = require('../models');


const obtenerProductos = async(req, res = response ) => {

    const { limite = 6, desde = 0, search = '' } = req.query;
    const query = { estado: true, nombre: {$regex: '.*' + search.toUpperCase()  }};    
    const [ total, productos ] = await Promise.all([
        Producto.countDocuments(query),
        Producto.find(query)           
            .populate('usuario', ['telefono', 'nombre'])
            .populate('categoria', 'nombre')
            .skip( Number( desde ) )
            .limit(Number( limite ))
            .sort({ "_id": -1 })
    ]);
    console.log("inicio ",desde, "limite ",limite);
    console.log(productos.length);
    console.log("*************************************");
    res.json({
        total,
        productos
    });
}

const obtenerProducto = async(req, res = response ) => {

    const { id } = req.params;
    const producto = await Producto.findById( id )
                            .populate('usuario', 'nombre')
                            .populate('categoria', 'nombre');

    res.json( producto );

}


const obtenerProductoUsuario = async(req, res = response ) => {

  const { id } = req.usuario;
  const producto = await Producto.find( {usuario: id})                                  
                                  .populate('categoria', 'nombre')
                                  .sort({_id:-1});                        

  res.json( producto );

}

const crearProducto = async(req, res = response ) => {

    const { estado, usuario, ...body } = req.body;
    // Generar la data a guardar
    const data = {
        ...body,
        nombre: body.nombre.toUpperCase(),
        usuario: req.usuario._id
    }
console.log(data);
    const producto = new Producto( data );

    // Guardar DB
    const nuevoProducto = await producto.save();
    await nuevoProducto
        .populate('usuario', 'nombre')
        .populate('categoria', 'nombre')
        .execPopulate();

    res.status(201).json( nuevoProducto );

}

const actualizarProducto = async( req, res = response ) => {

    const { id } = req.params;
    const { estado, usuario, ...data } = req.body;

    if( data.nombre ) {
        data.nombre  = data.nombre.toUpperCase();
    }

    data.usuario = req.usuario._id;

    const producto = await Producto.findByIdAndUpdate(id, data, { new: true });

    await producto
        .populate('usuario', 'nombre')
        .populate('categoria', 'nombre')
        .execPopulate();
        
    res.json( producto );

}

const borrarProducto = async(req, res = response ) => {

    const { id } = req.params;
    const productoBorrado = await Producto.findByIdAndUpdate( id, { estado: false }, {new: true });

    res.json( productoBorrado );
}




module.exports = {
    crearProducto,
    obtenerProductos,
    obtenerProducto,
    actualizarProducto,
    borrarProducto,
    obtenerProductoUsuario
}