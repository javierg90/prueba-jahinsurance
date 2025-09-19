"use strict";
const bcrypt = require("bcryptjs");
const { query, QueryTypes } = require("sequelize");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    const now = new Date();
    const passwordHash = bcrypt.hashSync("jahinsurance*", 10);

    // Usuario admin
    await queryInterface.bulkInsert("Users", [
      {
        email: "admin@local.test",
        password_hash: passwordHash,
        role: "admin",
        createdAt: now,
        updatedAt: now,
      },
    ]);

    await queryInterface.bulkInsert("Customers", [
      {
        name: "Marcela",
        email: "marcela@test.com",
        createdAt: now,
        updatedAt: now,
      },
      {
        name: "Jose",
        email: "jose@test.com",
        createdAt: now,
        updatedAt: now,
      },
    ]);

    const products = [
      {
        name: "Plan Oro",
        sku: "P-ORO",
        price: 120.0,
        category: "Seguros",
        createdAt: now,
        updatedAt: now,
      },
      {
        name: "Plan Plata",
        sku: "P-PLAT",
        price: 80.0,
        category: "Seguros",
        createdAt: now,
        updatedAt: now,
      },
      {
        name: "Plan Bronce",
        sku: "P-BRON",
        price: 50.0,
        category: "Seguros",
        createdAt: now,
        updatedAt: now,
      },
    ];

    await queryInterface.bulkInsert("Products", products);

    const orders = [
      {
        customer_id: 1, // Marcela
        order_date: new Date(
          now - (Math.random() * 10).toFixed(0) * 24 * 60 * 60 * 1000
        ),
        status: "paid",
        payment_method: "Tarjeta",
        total_amount: 210.0,
        createdAt: now,
        updatedAt: now,
      },
      {
        customer_id: 1, // Marcela
        order_date: new Date(
          now - (Math.random() * 10).toFixed(0) * 24 * 60 * 60 * 1000
        ),
        status: "paid",
        payment_method: "Tarjeta",
        total_amount: 460.0,
        createdAt: now,
        updatedAt: now,
      },
      {
        customer_id: 2, // Jose
        order_date: new Date(
          now - (Math.random() * 10).toFixed(0) * 24 * 60 * 60 * 1000
        ),
        status: "paid",
        payment_method: "Tarjeta",
        total_amount: 25.0,
        createdAt: now,
        updatedAt: now,
      },
    ];

    await queryInterface.bulkInsert("Orders", orders);

    const orderItems = [
      {
        order_id: 1, // Primer pedido de Marcela
        product_id: 1, // Plan Oro
        quantity: 1,
        unit_price: products[0].price * 1,
        createdAt: now,
        updatedAt: now,
      },
      {
        order_id: 1, // Primer pedido de Marcela
        product_id: 2, // Plan Plata
        quantity: 3,
        unit_price: products[1].price * 3,
        createdAt: now,
        updatedAt: now,
      },
      {
        order_id: 2, // Segundo pedido de Marcela
        product_id: 3, // Plan Bronce
        quantity: 2,
        unit_price: products[2].price * 2,
        createdAt: now,
        updatedAt: now,
      },
      {
        order_id: 3, // Primer pedido de Jose
        product_id: 3, // Plan Bronce
        quantity: 1,
        unit_price: products[0].price * 1,
        createdAt: now,
        updatedAt: now,
      },
    ];

    await queryInterface.bulkInsert("OrderItems", orderItems);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete("OrderItems", null, {});
    await queryInterface.bulkDelete("Orders", null, {});
    await queryInterface.bulkDelete("Products", null, {});
    await queryInterface.bulkDelete("Customers", null, {});
    await queryInterface.bulkDelete("Users", { email: "admin@local.test" }, {});
  },
};
