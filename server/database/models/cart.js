const Cart = (sequelize, DataTypes) => {
  const CartModel = sequelize.define('Cart', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
      references: {
        model: 'users',
        key: 'id'
      }
    }
  }, {
    tableName: 'carts',
    timestamps: true
  });

  CartModel.associate = (models) => {
    CartModel.belongsTo(models.user, { foreignKey: 'userId' });
    CartModel.hasMany(models.cartItem, { foreignKey: 'cartId' });
  };

  return CartModel;
};

module.exports = Cart;



