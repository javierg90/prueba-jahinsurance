"use strict";

const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Product.hasMany(models.OrderItem, {
        foreignKey: "product_id",
        as: "items",
      });
      models.OrderItem.belongsTo(models.Product, {
        foreignKey: "product_id",
        as: "product",
      });
    }
  }
  Product.init(
    {
      name: DataTypes.STRING,
      sku: DataTypes.STRING,
      price: DataTypes.DECIMAL,
      category: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Product",
      tableName: "Products",
      timestamps: true,
      underscored: true,
    }
  );
  return Product;
};
