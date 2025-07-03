/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('goods_and_services', function(table) {
    table.increments('id').primary();                  // Unique ID
    table.integer('company_id').unsigned().notNullable()
         .references('id').inTable('companies').onDelete('CASCADE'); // Linked company
    table.string('name').notNullable();                // Name of product/service
    table.text('description');                         // Optional description
    table.timestamps(true, true);                      // created_at, updated_at
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTableIfExists('goods_and_services');
};
