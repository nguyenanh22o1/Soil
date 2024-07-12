const db = require('../database')

const reviewController = {
  // create review
  createReview: async (req, res) => {
    try {
      const { userRating, text, userId, productId } = req.body
      const review = await db.review.create({ userRating, text, userId, productId })
      res.status(201).json(review)
    } catch (error) {
      console.error(error)
      res.status(500).json({ error: 'Internal server error' })
    }
  },

  // udpate review
  updateReview: async (req, res) => {
    try {
      const { id } = req.params
      const { userRating, text } = req.body
      const review = await db.review.findOne({ where: { id } })
      if (!review) {
        return res.status(404).json({ error: 'Review not found' })
      }
      const updatedReview = await review.update({ userRating, text })
      res.json(updatedReview)
    } catch (error) {
      console.error(error)
      res.status(500).json({ error: 'Internal server error' })
    }
  },

  // delete reivwe
  deleteReview: async (req, res) => {
    try {
      const { id } = req.params
      const review = await db.review.findOne({ where: { id } })
      if (!review) {
        return res.status(404).json({ error: 'Review not found' })
      }
      await review.destroy()
      res.json({ message: 'Review deleted successfully' })
    } catch (error) {
      console.error(error)
      res.status(500).json({ error: 'Internal server error' })
    }
  },

  // get all reivews in 1 product
  getProductReviews: async (req, res) => {
    try {
      const { productId } = req.params
      const reviews = await db.review.findAll({
        where: { productId },
        include: [
          {
            model: db.user,
            attributes: ['firstName']
          }
        ]
      })
      res.json(reviews)
    } catch (error) {
      console.error(error)
      res.status(500).json({ error: 'Internal server error' })
    }
  },

  // calculate average rating
  getAverageRating: async (req, res) => {
    try {
      const { productId } = req.params
      const result = await db.review.findOne({
        where: { productId },
        attributes: [
          [db.sequelize.fn('AVG', db.sequelize.col('userRating')), 'averageRating']
        ]
      })
      const averageRating = Math.round(result.dataValues.averageRating || 0)
      res.json({ averageRating })
    } catch (error) {
      console.error(error)
      res.status(500).json({ error: 'Internal server error' })
    }
  }
}

module.exports = reviewController
