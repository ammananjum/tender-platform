/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('applications', function(table) {
    table.increments('id').primary();                 // Unique ID
    table.integer('tender_id').unsigned().notNullable()
         .references('id').inTable('tenders').onDelete('CASCADE');  // Tender being applied to
    table.integer('company_id').unsigned().notNullable()
         .references('id').inTable('companies').onDelete('CASCADE'); // Applying company
    table.text('proposal').notNullable();             // Proposal content
    table.timestamps(true, true);                     // created_at, updated_at
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTableIfExists('applications');
};
