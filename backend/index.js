import express from 'express'
import sequelize from './db/index.js'

const app = express();
app.use(express.static("public"));

sequelize
  .sync()
  .then(() => {
    app.listen(3006);
  })
  .catch((err) => console.log(err));
