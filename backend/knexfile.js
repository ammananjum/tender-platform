/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
module.exports = {

  development: {
    client: 'pg',
    connection: {
      host: '127.0.0.1',
      user: 'postgres',              
      password: 'Zohaemaan',     
      database: 'career_tender_db'   
    },
    migrations: {
      directory: './migrations'
    },
    seeds: {
      directory: './seeds'
    }
  },

  // optional: you can leave staging/production as-is or remove them if not needed
};
