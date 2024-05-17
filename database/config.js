// For more sequelize commands see https://github.com/sequelize/cli#usage
// & https://sequelize.org/v5/manual/migrations.html

require('dotenv/config');

module.exports = {
  dialect: process.env.DB_DIALECT,
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,

  seederStorage: 'sequelize',
  migrationStorageTableName: 'sequelize_migrations_maguna_nestjs_be',
  seederStorageTableName: 'sequelize_seeders_maguna_nestjs_be',
};
