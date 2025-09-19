"use strict";

const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Order extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Order.hasMany(models.OrderItem, { foreignKey: "order_id", as: "items" });
      models.OrderItem.belongsTo(models.Order, {
        foreignKey: "order_id",
        as: "order",
      });
    }
  }
  Order.init(
    {
      customer_id: DataTypes.INTEGER,
      order_date: DataTypes.DATE,
      status: DataTypes.STRING,
      payment_method: DataTypes.STRING,
      total_amount: DataTypes.DECIMAL,
    },
    {
      sequelize,
      modelName: "Order",
      tableName: "Orders",
      timestamps: true,
      underscored: true,
    }
  );
  return Order;
};
