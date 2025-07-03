/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('tenders', function(table) {
    table.increments('id').primary();               // Tender ID
    table.string('title').notNullable();            // Tender title
    table.text('description').notNullable();        // Tender description
    table.date('deadline').notNullable();           // Deadline for submission
    table.decimal('budget').notNullable();          // Budget amount
    table.integer('company_id').unsigned().references('id').inTable('companies').onDelete('CASCADE'); // Posted by company
    table.timestamps(true, true);                   // created_at, updated_at
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTableIfExists('tenders');
};
