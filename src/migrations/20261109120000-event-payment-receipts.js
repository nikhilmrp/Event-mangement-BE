"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // In development, sequelize.sync() may already have created event_payment_receipts
    // from the model, so skip table/index creation when they exist.
    const tables = (await queryInterface.showAllTables()).map((t) =>
      typeof t === "string" ? t : t.tableName,
    );
    const receiptsTableExists = tables.includes("event_payment_receipts");

    await queryInterface.sequelize.transaction(async (transaction) => {
      if (!receiptsTableExists) {
        await queryInterface.createTable(
          "event_payment_receipts",
          {
            id: {
              type: Sequelize.INTEGER,
              primaryKey: true,
              autoIncrement: true,
            },
            event_id: {
              type: Sequelize.INTEGER,
              allowNull: false,
              references: { model: "events", key: "id" },
            },
            payment_receipt_url: {
              type: Sequelize.STRING(500),
              allowNull: false,
            },
            created_at: {
              type: Sequelize.DATE,
              allowNull: false,
              defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
            },
            updated_at: {
              type: Sequelize.DATE,
              allowNull: false,
              defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
            },
          },
          { transaction },
        );
        await queryInterface.addIndex("event_payment_receipts", ["event_id"], { transaction });
      }

      await queryInterface.changeColumn(
        "events",
        "status",
        {
          type: Sequelize.ENUM("draft", "vendor_selected", "confirmed", "completed"),
          allowNull: false,
          defaultValue: "draft",
        },
        { transaction },
      );
      await queryInterface.addColumn(
        "events",
        "completed_at",
        { type: Sequelize.DATE, allowNull: true },
        { transaction },
      );

      // Move each event's single existing receipt into the new table.
      await queryInterface.sequelize.query(
        `INSERT INTO event_payment_receipts (event_id, payment_receipt_url, created_at, updated_at)
         SELECT id, payment_receipt_url, COALESCE(confirmed_at, NOW()), COALESCE(confirmed_at, NOW())
         FROM events
         WHERE payment_receipt_url IS NOT NULL`,
        { transaction },
      );
      await queryInterface.removeColumn("events", "payment_receipt_url", { transaction });
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.addColumn(
        "events",
        "payment_receipt_url",
        { type: Sequelize.STRING(500), allowNull: true },
        { transaction },
      );

      // Keep the most recent receipt per event.
      await queryInterface.sequelize.query(
        `UPDATE events e
         JOIN (
           SELECT r.event_id, r.payment_receipt_url
           FROM event_payment_receipts r
           JOIN (
             SELECT event_id, MAX(id) AS max_id FROM event_payment_receipts GROUP BY event_id
           ) latest ON latest.max_id = r.id
         ) lr ON lr.event_id = e.id
         SET e.payment_receipt_url = lr.payment_receipt_url`,
        { transaction },
      );

      await queryInterface.sequelize.query(
        `UPDATE events SET status = 'confirmed' WHERE status = 'completed'`,
        { transaction },
      );
      await queryInterface.removeColumn("events", "completed_at", { transaction });
      await queryInterface.changeColumn(
        "events",
        "status",
        {
          type: Sequelize.ENUM("draft", "vendor_selected", "confirmed"),
          allowNull: false,
          defaultValue: "draft",
        },
        { transaction },
      );

      await queryInterface.dropTable("event_payment_receipts", { transaction });
    });
  },
};
