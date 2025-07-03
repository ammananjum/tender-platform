// src/models/userModel.js

const db = require('../db'); // Import knex instance

module.exports = {
  // Find user by email
  findByEmail: async (email) => {
    return db('users').where({ email }).first();
  },

  // Find user by id
  findById: async (id) => {
    return db('users').where({ id }).first();
  },

  // Create new user
  createUser: async (userData) => {
    // userData should contain: { username, email, password }
    const [newUser] = await db('users')
      .insert({
        username: userData.username,
        email: userData.email,
        password: userData.password,
        created_at: new Date(),
        updated_at: new Date(),
      })
      .returning('*'); // Return inserted row (Postgres syntax)

    return newUser;
  }
};
