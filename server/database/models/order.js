const Order = (sequelize, DataTypes) => {
  const OrderModel = sequelize.define('Order', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    orderDate: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    totalPrice: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    }
  }, {
    tableName: 'orders',
    timestamps: true
  })

  OrderModel.associate = (models) => {
    OrderModel.belongsTo(models.user, { foreignKey: 'userId' })
    OrderModel.hasMany(models.orderDetails, { foreignKey: 'orderId', as: 'orderDetails' })
  }

  return OrderModel
}

module.exports = Order
