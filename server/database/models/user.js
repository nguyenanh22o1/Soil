const User = (sequelize, DataTypes) => {
  const UserModel = sequelize.define('User', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    phoneNumber: {
      type: DataTypes.STRING
    },
    isSetupPersonalHealth: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    age: {
      type: DataTypes.INTEGER
    },
    sex: {
      type: DataTypes.ENUM('male', 'female')
    },
    weight: {
      type: DataTypes.FLOAT
    },
    height: {
      type: DataTypes.FLOAT
    },
    activityLevel: {
      type: DataTypes.STRING
    },
    dateOfBirth: {
      type: DataTypes.DATE
    },
    dietaryPreferences: {
      type: DataTypes.JSON
    },
    healthGoals: {
      type: DataTypes.JSON
    },
    dateJoined: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    isBlocked: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,  // Assumes users are not blocked by default
    },
    following: {
      type: DataTypes.JSON,
      defaultValue: []
    }
  }, {
    tableName: 'users'
  });

  UserModel.associate = (models) => {
    UserModel.hasOne(models.cart, { foreignKey: 'userId' });
    UserModel.hasMany(models.order, { foreignKey: 'userId' });
    UserModel.hasMany(models.review, { foreignKey: 'userId' });
  };

  return UserModel;
};

module.exports = User;

