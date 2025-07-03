/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('users', function(table) {
    table.increments('id').primary();          // Auto-increment primary key
    table.string('username').notNullable();    
    table.string('email').notNullable().unique(); // User email (must be unique)
    table.string('password').notNullable();    // Hashed password
    table.timestamps(true, true);              // created_at and updated_at
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTableIfExists('users');
};
