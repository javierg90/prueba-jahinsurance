"use strict";

const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Customer extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here

      Customer.hasMany(models.Order, {
        foreignKey: "customer_id",
        as: "orders",
      });
      models.Order.belongsTo(models.Customer, {
        foreignKey: "customer_id",
        as: "customer",
      });
    }
  }
  Customer.init(
    {
      name: DataTypes.STRING,
      email: DataTypes.STRING,
      created_at: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: "Customer",
    }
  );
  return Customer;
};
