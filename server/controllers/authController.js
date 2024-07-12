const argon2 = require('argon2');
const db = require('../database');

const authController = {
  // Sign up
  signup: async (req, res) => {
    try {
      const email = req.body.email;

      // Check if email already exists
      const existingUser = await db.user.findOne({ where: { email } });

      if (existingUser) {
        return res.status(400).json({ error: 'Email already exists. Please use a different email.' });
      }

      // Hash the password using argon2
      const hashedPassword = await argon2.hash(req.body.password);

      // Create new user in DB
      const newUser = await db.user.create({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: hashedPassword,
        phoneNumber: req.body.phoneNumber
      });

      // Respond status 200 - mean successful
      res.status(200).json({ message: 'Registration successful!', user: newUser });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  // Login
  login: async (req, res) => {
    try {
      const email = req.body.email;

      // Find the user by email
      const user = await db.user.findOne({ where: { email } });

      // If user not found, return error
      if (!user) {
        return res.status(401).json({ error: 'User not found' });
      }

      // Check if user is blocked
      if (user.isBlocked) {
        return res.status(403).json({ error: 'Your account has been blocked. Please contact support.' });
      }

      // Verify the password
      const isPasswordValid = await argon2.verify(user.password, req.body.password);

      // If password is invalid
      if (!isPasswordValid) {
        return res.status(401).json({ error: 'Invalid email or password' });
      }

      // Respond with the user data
      res.status(200).json({
        message: `Login successful! Welcome ${user.firstName}`,
        user: {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          phoneNumber: user.phoneNumber,
          dateOfBirth: user.dateOfBirth,
          isSetupPersonalHealth: user.isSetupPersonalHealth,
          age: user.age,
          weight: user.weight,
          height: user.height,
          activityLevel: user.activityLevel,
          dietaryPreferences: user.dietaryPreferences,
          healthGoals: user.healthGoals,
          dateJoined: user.dateJoined,
          following: user.following
        }
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
};

module.exports = authController;

