const argon2 = require('argon2')
const db = require('../database')

const userController = {
  // get single user data
  getUserData: async (req, res) => {
    try {
      const userId = req.params.id

      // find by ID
      const user = await db.user.findOne({ where: { id: userId } })

      // if not found, return error
      if (!user) {
        return res.status(404).json({ error: 'User not found' })
      }

      // respond with the user data
      res.status(200).json({ user })
    } catch (error) {
      console.error(error)
      res.status(500).json({ error: 'Internal server error' })
    }
  },

  // edit user profile
  editUserProfile: async (req, res) => {
    try {
      const userId = req.params.id

      // find the user by ID
      const user = await db.user.findOne({ where: { id: userId } })

      // if user not found, return error
      if (!user) {
        return res.status(404).json({ error: 'User not found' })
      }

      // update the user profile
      const updatedData = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        phoneNumber: req.body.phoneNumber
      }

      // check if dob pass with empty ''
      if (req.body.dateOfBirth && req.body.dateOfBirth !== '') {
        updatedData.dateOfBirth = req.body.dateOfBirth
      }
      const updatedUser = await user.update(updatedData)

      // Respond with the updated user data
      res.status(200).json({ message: 'User profile updated successfully', user: updatedUser })
    } catch (error) {
      console.error(error)
      res.status(500).json({ error: 'Internal server error' })
    }
  },

  // edit health data
  editHealthData: async (req, res) => {
    try {
      const userId = req.params.id

      // find by ID
      const user = await db.user.findOne({ where: { id: userId } })

      // if not found, return error
      if (!user) {
        return res.status(404).json({ error: 'User not found' })
      }

      // update the health data
      const updatedUser = await user.update({
        age: req.body.age,
        sex: req.body.sex,
        weight: req.body.weight,
        height: req.body.height,
        activityLevel: req.body.activityLevel,
        dietaryPreferences: req.body.dietaryPreferences,
        healthGoals: req.body.healthGoals,
        isSetupPersonalHealth: req.body.isSetupPersonalHealth
      })

      // respond with the updated user data
      res.status(200).json({ message: 'Health data updated successfully', user: updatedUser })
    } catch (error) {
      console.error(error)
      res.status(500).json({ error: 'Internal server error' })
    }
  },

  // delete user
  // delete user
  deleteUser: async (req, res) => {
    try {
      const userId = req.params.id

      // find the user by ID
      const user = await db.user.findOne({ where: { id: userId } })

      // if user not found, return error
      if (!user) {
        return res.status(404).json({ error: 'User not found' })
      }

      // find all reviews associated with the user
      const reviews = await db.review.findAll({ where: { userId } })

      // delete each review
      for (const review of reviews) {
        await review.destroy()
      }

      // delete the user
      await user.destroy()

      // respond with a success message
      res.status(200).json({ message: 'User and associated reviews deleted successfully' })
    } catch (error) {
      console.error(error)
      res.status(500).json({ error: 'Internal server error' })
    }
  },

  // Manage following list
  manageFollowing: async (req, res) => {
    try {
      const userId = req.params.id
      const { followUserId, action } = req.body

      // Find the user by ID
      const user = await db.user.findOne({ where: { id: userId } })

      // If user not found, return error
      if (!user) {
        return res.status(404).json({ error: 'User not found' })
      }

      // Ensure the following field is an array
      let updatedFollowing = Array.isArray(user.following) ? user.following : []

      if (action === 'follow') {
        if (!updatedFollowing.includes(followUserId)) {
          updatedFollowing.push(followUserId)
        }
      } else if (action === 'unfollow') {
        updatedFollowing = updatedFollowing.filter(id => id !== followUserId)
      } else {
        return res.status(400).json({ error: 'Invalid action' })
      }

      const updatedUser = await user.update({ following: updatedFollowing })

      res.status(200).json({ message: 'Following list updated successfully', user: updatedUser })
    } catch (error) {
      console.error(error)
      res.status(500).json({ error: 'Internal server error' })
    }
  }

}

module.exports = userController
