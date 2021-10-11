import express from 'express';
import {Sequelize} from "sequelize"

const app = express();
const port = 3000;

app.listen(port, async () => {
  console.log(`Timezones by location application is running on port ${port}.`);
  const sequelize = new Sequelize('postgres://lcfxmnrq:X6HSV_8HDi3YiIZfpfUIVHXI7L6gojFM@fanny.db.elephantsql.com/lcfxmnrq');
  await sequelize.authenticate()
  .then(() => console.log("Success"))
  .catch(() => console.log("Failed"))

});