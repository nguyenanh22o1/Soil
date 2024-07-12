const Review = (sequelize, DataTypes) => {
  const ReviewModel = sequelize.define('Review', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    userRating: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
        max: 5
      }
    },
    text: {
      type: DataTypes.STRING(100)
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    productId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'products',
        key: 'id'
      }
    },
    deletedByAdmin: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  }, {
    tableName: 'reviews',
    timestamps: false
  })

  ReviewModel.associate = (models) => {
    ReviewModel.belongsTo(models.user, { foreignKey: 'userId' })
    ReviewModel.belongsTo(models.product, { foreignKey: 'productId' });
  }

  return ReviewModel
}

module.exports = Review
