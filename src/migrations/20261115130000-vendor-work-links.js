"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // In development, sequelize.sync() may already have created vendor_work_links
    // from the model, so skip creation when it exists.
    const tables = (await queryInterface.showAllTables()).map((t) =>
      typeof t === "string" ? t : t.tableName,
    );
    if (tables.includes("vendor_work_links")) return;

    await queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.createTable(
        "vendor_work_links",
        {
          id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
          },
          vendor_profile_id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: { model: "vendor_profiles", key: "id" },
          },
          url: { type: Sequelize.STRING(2048), allowNull: false },
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
      await queryInterface.addIndex("vendor_work_links", ["vendor_profile_id"], { transaction });
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable("vendor_work_links");
  },
};
