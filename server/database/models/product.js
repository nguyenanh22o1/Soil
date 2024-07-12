const Product = (sequelize, DataTypes) => {
  const ProductModel = sequelize.define('Product', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    salePrice: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    originalPrice: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    imageSrc: {
      type: DataTypes.STRING,
      allowNull: false
    },
    category: {
      type: DataTypes.STRING,
      allowNull: false
    },
    rating: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 0,
        max: 5
      }
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false
    }
  }, {
    tableName: 'products'
  });

  ProductModel.associate = (models) => {
    ProductModel.hasMany(models.cartItem, { foreignKey: 'productId' });
    ProductModel.hasMany(models.review, { foreignKey: 'productId' });
    ProductModel.hasMany(models.orderDetails, { foreignKey: 'productId' });
  };

  return ProductModel;
};

module.exports = Product;



