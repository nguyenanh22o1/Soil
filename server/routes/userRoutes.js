const userController = require('../controllers/userController')

const router = require('express').Router()

router.get('/:id', userController.getUserData)

router.put('/:id/profile', userController.editUserProfile)

router.put('/:id/health', userController.editHealthData)

router.post('/:id/follow', userController.manageFollowing)

router.delete('/:id', userController.deleteUser)

module.exports = router
