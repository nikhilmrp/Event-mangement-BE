"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // In development, sequelize.sync() may already have created event_earnings
    // from the model, so skip creation when it exists.
    const tables = (await queryInterface.showAllTables()).map((t) =>
      typeof t === "string" ? t : t.tableName,
    );
    if (tables.includes("event_earnings")) return;

    await queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.createTable(
        "event_earnings",
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
          event_vendor_id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: { model: "event_vendors", key: "id" },
          },
          agent_profile_id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: { model: "agent_profiles", key: "id" },
          },
          vendor_profile_id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: { model: "vendor_profiles", key: "id" },
          },
          vendor_type_id: {
            type: Sequelize.INTEGER.UNSIGNED,
            allowNull: false,
            references: { model: "vendor_types", key: "id" },
          },
          gross_amount: { type: Sequelize.DECIMAL(12, 2), allowNull: false },
          commission_percentage: { type: Sequelize.DECIMAL(5, 2), allowNull: false },
          agent_amount: { type: Sequelize.DECIMAL(12, 2), allowNull: false },
          admin_amount: { type: Sequelize.DECIMAL(12, 2), allowNull: false },
          vendor_amount: { type: Sequelize.DECIMAL(12, 2), allowNull: false },
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
      await queryInterface.addIndex("event_earnings", ["event_vendor_id"], {
        unique: true,
        transaction,
      });
      await queryInterface.addIndex("event_earnings", ["agent_profile_id"], { transaction });
      await queryInterface.addIndex("event_earnings", ["vendor_profile_id"], { transaction });
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable("event_earnings");
  },
};
