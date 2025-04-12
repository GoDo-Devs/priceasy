const express = require("express");

const app = express();
app.use(express.static("public"));

const conn = require("./db/conn");

conn
  .sync()
  .then(() => {
    app.listen(3006);
  })
  .catch((err) => console.log(err));
