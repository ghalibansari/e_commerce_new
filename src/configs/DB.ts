import { Sequelize } from 'sequelize';

const env = process.env.NODE_ENV || 'development';
// const config = require(__dirname + '/../../config.js')[env];
const config = { url: "postgres://lcfxmnrq:X6HSV_8HDi3YiIZfpfUIVHXI7L6gojFM@fanny.db.elephantsql.com/lcfxmnrq" };

// const  sequelize = config.url
//   ? new Sequelize(config.url, config)
//   : new Sequelize(config.database, config.username, config.password, config);


const DB = new Sequelize(config.url, { pool: { max: 2 } })


export { Sequelize, DB };

