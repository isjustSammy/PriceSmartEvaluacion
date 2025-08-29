/*
    Campos del modelo Products:
        - name: Nombre del producto (String, requerido)
        - description: Descripción del producto (String, requerido)  
        - price: Precio del producto (Number, requerido, mínimo 0)
        - stock: Stock disponible (Number, requerido, mínimo 0, default 0)
*/

import { Schema, model } from "mongoose";

const productsSchema = new Schema(
  {
    name: {
      type: String,  // Corregido: era Number, debe ser String
      required: true,  // Corregido: era "require", debe ser "required"
      trim: true,  // Mejora: elimina espacios en blanco
      minlength: [2, 'El nombre debe tener al menos 2 caracteres'],
      maxlength: [100, 'El nombre no puede exceder 100 caracteres']
    },
    description: {  // Corregido: era "desciption", debe ser "description"
      type: String,
      required: true,  // Mejora: campo requerido según documentación
      trim: true,
      minlength: [10, 'La descripción debe tener al menos 10 caracteres'],
      maxlength: [500, 'La descripción no puede exceder 500 caracteres']
    },
    price: {
      type: Number,
      required: true,  // Corregido: era "require", debe ser "required"
      min: [0, 'El precio debe ser mayor o igual a 0'],
      validate: {
        validator: function(value) {
          return Number.isFinite(value) && value >= 0;
        },
        message: 'El precio debe ser un número válido mayor o igual a 0'
      }
    },
    stock: {
      type: Number,
      required: true,  // Corregido: era "require", debe ser "required"
      min: [0, 'El stock debe ser mayor o igual a 0'],
      default: 0,  // Mejora: valor por defecto
      validate: {
        validator: Number.isInteger,
        message: 'El stock debe ser un número entero'
      }
    }
  },
  {
    timestamps: true,  // Mantiene createdAt y updatedAt
    strict: true,  // Corregido: era false, debe ser true para prevenir campos no definidos
    versionKey: false,  // Mejora: elimina el campo __v
    collection: 'products'  // Mejora: nombre explícito de la colección
  }
);

// Índices para optimizar consultas
productsSchema.index({ name: 1 });  // Índice para búsquedas por nombre
productsSchema.index({ price: 1 });  // Índice para búsquedas por precio
productsSchema.index({ createdAt: -1 });  // Índice para ordenar por fecha

// Método virtual para calcular el valor total del inventario
productsSchema.virtual('totalValue').get(function() {
  return this.price * this.stock;
});

// Método para verificar disponibilidad
productsSchema.methods.isAvailable = function() {
  return this.stock > 0;
};

// Método estático para buscar productos disponibles
productsSchema.statics.findAvailable = function() {
  return this.find({ stock: { $gt: 0 } });
};

// Middleware pre-save para validaciones adicionales
productsSchema.pre('save', function(next) {
  // Capitalizar la primera letra del nombre
  if (this.name) {
    this.name = this.name.charAt(0).toUpperCase() + this.name.slice(1).toLowerCase();
  }
  
  // Validar que el precio tenga máximo 2 decimales
  if (this.price) {
    this.price = Math.round(this.price * 100) / 100;
  }
  
  next();
});

// Configurar JSON transform para excluir campos sensibles si los hubiera
productsSchema.set('toJSON', {
  virtuals: true,
  transform: function(doc, ret) {
    delete ret._id;
    return ret;
  }
});

export default model("Products", productsSchema);