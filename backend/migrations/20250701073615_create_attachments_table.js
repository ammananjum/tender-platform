/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable("attachments", (table) => {
    table.increments("id").primary();
    table.string("file_url").notNullable();
    table.string("type");
    table
      .integer("uploaded_by")
      .unsigned()
      .references("id")
      .inTable("users")
      .onDelete("CASCADE");
    table
      .integer("tender_id")
      .unsigned()
      .references("id")
      .inTable("tenders")
      .onDelete("SET NULL");
    table
      .integer("application_id")
      .unsigned()
      .references("id")
      .inTable("applications")
      .onDelete("SET NULL");
    table.timestamp("created_at").defaultTo(knex.fn.now());
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTable("attachments");
};
