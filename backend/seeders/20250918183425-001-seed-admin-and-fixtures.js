"use strict";
const bcrypt = require("bcryptjs");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    const passwordHash = bcrypt.hashSync("jahinsurance*", 10);

    // Usuario admin
    await queryInterface.bulkInsert("Users", [
      {
        email: "admin@local.test",
        password_hash: passwordHash,
        role: "admin",
        created_at: new Date(),
      },
    ]);

    await queryInterface.bulkInsert("Customers", [
      { name: "Marcela", email: "marcela@test.com", created_at: new Date() },
      { name: "Jose", email: "jose@test.com", created_at: new Date() },
    ]);

    await queryInterface.bulkInsert("Products", [
      { name: "Plan Oro", sku: "P-ORO", price: 120.0, category: "Seguros" },
      { name: "Plan Plata", sku: "P-PLAT", price: 80.0, category: "Seguros" },
      { name: "Plan Bronce", sku: "P-BRON", price: 50.0, category: "Seguros" },
    ]);

    // --- ÓRDENES ---
    const customers = await queryInterface.sequelize.query(
      "SELECT id FROM Customers",
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );
    const products = await queryInterface.sequelize.query(
      "SELECT id, price FROM Products",
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );

    // Ordenes de ejemplo
    const [marcela] = customers;
    const orderIds = [];

    // Orden 1
    const [order1] = await queryInterface.bulkInsert(
      "Orders",
      [
        {
          customer_id: marcela.id,
          order_date: now,
          status: "paid",
          payment_method: "Tarjeta",
          total_amount: 120.0,
          created_at: now,
        },
      ],
      { returning: ["id"] }
    );

    orderIds.push(order1.id);

    // Orden 2
    const [order2] = await queryInterface.bulkInsert(
      "Orders",
      [
        {
          customer_id: customers[1].id,
          order_date: now,
          status: "paid",
          payment_method: "Efectivo",
          total_amount: 130.0,
          created_at: now,
        },
      ],
      { returning: ["id"] }
    );

    orderIds.push(order2.id);

    // --- ITEMS DE ÓRDENES ---
    const orderItems = [
      {
        order_id: orderIds[0],
        product_id: products[0].id,
        quantity: 1,
        unit_price: products[0].price,
      },
      {
        order_id: orderIds[1],
        product_id: products[1].id,
        quantity: 1,
        unit_price: products[1].price,
      },
      {
        order_id: orderIds[1],
        product_id: products[2].id,
        quantity: 1,
        unit_price: products[2].price,
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
