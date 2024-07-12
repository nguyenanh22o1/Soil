const CartItem = (sequelize, DataTypes) => {
  const CartItemModel = sequelize.define('CartItem', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    cartId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'carts', 
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
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    tableName: 'cart_items',
    timestamps: true
  });

  CartItemModel.associate = (models) => {
    CartItemModel.belongsTo(models.cart, { foreignKey: 'cartId' });
    CartItemModel.belongsTo(models.product, { foreignKey: 'productId' });
  };

  return CartItemModel;
};

module.exports = CartItem;

