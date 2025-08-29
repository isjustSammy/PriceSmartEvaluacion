// Array de métodos (C R U D)
const productsController = {};
import productsModel from "../models/Products.js";

// SELECT - Obtener todos los productos
productsController.getProducts = async (req, res) => {
  try {
    const products = await productsModel.find();
    res.status(200).json({
      success: true,
      data: products,
      count: products.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al obtener los productos",
      error: error.message
    });
  }
};

// SELECT - Obtener un producto por ID
productsController.getSingleProduct = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Validación básica del ID
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "ID del producto es requerido"
      });
    }

    const product = await productsModel.findById(id);
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Producto no encontrado"
      });
    }
    
    res.status(200).json({
      success: true,
      data: product
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al obtener el producto",
      error: error.message
    });
  }
};

// INSERT - Crear nuevo producto
productsController.createProducts = async (req, res) => {
  try {
    const { name, description, price } = req.body;
    
    // Validación de campos requeridos
    if (!name || !description || price === undefined) {
      return res.status(400).json({
        success: false,
        message: "Todos los campos (name, description, price) son requeridos"
      });
    }

    // Validación del precio
    if (typeof price !== 'number' || price < 0) {
      return res.status(400).json({
        success: false,
        message: "El precio debe ser un número positivo"
      });
    }

    const newProduct = new productsModel({ name, description, price });
    const savedProduct = await newProduct.save();
    
    res.status(201).json({
      success: true,
      message: "Producto creado exitosamente",
      data: savedProduct
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al crear el producto",
      error: error.message
    });
  }
};

// UPDATE - Actualizar producto existente
productsController.updateProducts = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price } = req.body;
    
    // Validación básica del ID
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "ID del producto es requerido"
      });
    }

    // Crear objeto con solo los campos proporcionados
    const updateFields = {};
    if (name !== undefined) updateFields.name = name;
    if (description !== undefined) updateFields.description = description;
    if (price !== undefined) {
      // Validación del precio si se proporciona
      if (typeof price !== 'number' || price < 0) {
        return res.status(400).json({
          success: false,
          message: "El precio debe ser un número positivo"
        });
      }
      updateFields.price = price;
    }

    // Verificar que hay al menos un campo para actualizar
    if (Object.keys(updateFields).length === 0) {
      return res.status(400).json({
        success: false,
        message: "Debe proporcionar al menos un campo para actualizar"
      });
    }

    const updatedProduct = await productsModel.findByIdAndUpdate(
      id,
      updateFields,
      { 
        new: true,
        runValidators: true
      }
    );

    if (!updatedProduct) {
      return res.status(404).json({
        success: false,
        message: "Producto no encontrado"
      });
    }

    res.status(200).json({
      success: true,
      message: "Producto actualizado exitosamente",
      data: updatedProduct
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al actualizar el producto",
      error: error.message
    });
  }
};

// DELETE - Eliminar producto
productsController.deleteProducts = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Validación básica del ID
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "ID del producto es requerido"
      });
    }

    const deletedProduct = await productsModel.findByIdAndDelete(id);
    
    if (!deletedProduct) {
      return res.status(404).json({
        success: false,
        message: "Producto no encontrado"
      });
    }
    
    res.status(200).json({
      success: true,
      message: "Producto eliminado exitosamente",
      data: deletedProduct
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al eliminar el producto",
      error: error.message
    });
  }
};

export default productsController;