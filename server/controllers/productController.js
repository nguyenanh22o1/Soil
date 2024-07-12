const db = require('../database')

const productController = {

  // Fetch all products
  getAllProducts: async (req, res) => {
    try {
      const products = await db.product.findAll()
      res.status(200).json(products)
    } catch (error) {
      console.error(error)
      res.status(500).json({ error: 'Internal server error' })
    } 
  },

  // Fetch specials
  getSpecials: async (req, res) => {
    try {
      const products = await db.product.findAll({
        where: {
          salePrice: {
            [db.Op.lt]: db.sequelize.col('originalPrice'),
            [db.Op.gt]: db.sequelize.cast(0, 'FLOAT')
          }
        }
      })
      res.status(200).json(products)
    } catch (error) {
      console.error(error)
      res.status(500).json({ error: 'Internal server error' })
    }
  },

  // Fetch product by ID
  getProductById: async (req, res) => {
    try {
      const product = await db.product.findOne({ where: { id: req.params.id } })
      if (!product) {
        return res.status(404).json({ error: 'Product not found' })
      }
      res.status(200).json(product)
    } catch (error) {
      console.error(error)
      res.status(500).json({ error: 'Internal server error' })
    }
  },

  // Update product rating
  updateProductRating: async (req, res) => {
    try {
      const product = await db.product.findOne({ where: { id: req.params.id } })
      if (!product) {
        return res.status(404).json({ error: 'Product not found' })
      }
      product.rating = req.body.rating
      await product.save()
      res.status(200).json({ message: 'Product rating updated successfully', product })
    } catch (error) {
      if (error.name === 'SequelizeValidationError') {
        return res.status(400).json({ error: 'Invalid rating value. Rating must be between 0 and 5.' })
      }
      console.error(error)
      res.status(500).json({ error: 'Internal server error' })
    }
  },

  // Fetch featured products (not on sale)
  getFeaturedProducts: async (req, res) => {
    try {
      const products = await db.product.findAll({
        where: db.sequelize.where(db.sequelize.cast(db.sequelize.col('salePrice'), 'FLOAT'), 0)
      })
      const selected = products.sort(() => 0.5 - Math.random()).slice(0, 4)
      console.log('Featured Products:', selected)
      res.status(200).json(selected)
    } catch (error) {
      console.error(error)
      res.status(500).json({ error: 'Internal server error' })
    }
  },

  // Fetch featured specials
  getFeaturedSpecials: async (req, res) => {
    try {
      const products = await db.product.findAll({
        where: {
          salePrice: {
            [db.Op.lt]: db.sequelize.col('originalPrice'),
            [db.Op.gt]: db.sequelize.cast(0, 'FLOAT')
          }
        }
      })
      const selected = products.sort(() => 0.5 - Math.random()).slice(0, 4)
      res.status(200).json(selected)
    } catch (error) {
      console.error(error)
      res.status(500).json({ error: 'Internal server error' })
    }
  }
}

module.exports = productController