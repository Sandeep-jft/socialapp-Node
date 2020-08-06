var express = require("express");
var app = express();
var mongoose = require("mongoose");
var { MONGOURI } = require("./config/keys");
var PORT = process.env.PORT || 5000;

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

if ((process.env.NODE_ENV = "production")) {
  app.use(express.static("mysocialappfront/build"));
  const path = require("path");
  app.get("*", (req, res) => {
    res.sendFile(
      path.resolve(__dirname, "mysocialappfront", "build", "index.html")
    );
  });
}

app.listen(PORT, () => {
  console.log("server is running at port 5000");
});
