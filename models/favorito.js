const { Schema, model } = require('mongoose');

const FavoritoSchema = Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es obligatorio'],
        unique: false
    },
    precio: {
        type: Number,
        default: 0,
        required: true
    },
    img: {
      type: String,      
      required: false
    },
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
    },
    producto: {
      type: Schema.Types.ObjectId,
      ref: 'Producto',
      required: true
  }
});


FavoritoSchema.methods.toJSON = function() {
    const { __v, ...data  } = this.toObject();
    return data;
}


module.exports = model( 'Favorito', FavoritoSchema );
