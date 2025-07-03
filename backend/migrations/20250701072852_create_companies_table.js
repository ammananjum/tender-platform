/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('companies', function(table) {
    table.increments('id').primary();             // Company ID
    table.string('name').notNullable();           // Company name
    table.string('industry').notNullable();       // Industry type
    table.text('description');                    // Company description
    table.string('logo_url');                     // URL of logo stored in Supabase
    table.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE'); // Reference to user
    table.timestamps(true, true);                 // created_at and updated_at
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTableIfExists('companies');
};
