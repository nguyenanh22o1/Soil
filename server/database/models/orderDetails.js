const OrderDetails = (sequelize, DataTypes) => {
  const OrderDetailsModel = sequelize.define('OrderDetails', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    orderId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'orders',
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
    productName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    productPrice: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    tableName: 'order_details',
    timestamps: true
  })

  OrderDetailsModel.associate = (models) => {
    OrderDetailsModel.belongsTo(models.order, { foreignKey: 'orderId', as: 'order' })
    OrderDetailsModel.belongsTo(models.product, { foreignKey: 'productId', as: 'product' })
  }

  return OrderDetailsModel
}

module.exports = OrderDetails
