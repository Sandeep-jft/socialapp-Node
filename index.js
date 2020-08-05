var express = require("express");
var app = express();
var mongoose = require("mongoose");
var { MONGOURI } = require("./keys");

mongoose.connect(MONGOURI, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.connection.on("connected", () => {
  console.log("we are connected yeah");
});

mongoose.connection.on("error", (err) => {
  console.log("Error : ", err);
});

require("./models/user");
require("./models/post");

app.use(express.json());

app.use(require("./routes/r-auth"));
app.use(require("./routes/r-post"));
app.use(require("./routes/r-user"));

app.listen(5000, () => {
  console.log("server is running at port 5000");
});
