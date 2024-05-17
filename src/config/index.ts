require('dotenv').config();

export const config = {
  jwtSecret: process.env.JWT_SECRET,
  sendGridApiKey: process.env.SENDGRID_API_KEY,

  database: {
    dialect: process.env.DB_DIALECT,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  },
};
