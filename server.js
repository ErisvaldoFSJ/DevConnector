const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const passport = require("passport");

//routes
const users = require("./routes/api/users");
const profile = require("./routes/api/profile");
const posts = require("./routes/api/posts");

const app = express();

//body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//DB configS
const db = require("./config/keys").mongoURI;

//Connect mongo DB
mongoose
  .connect(db)
  .then(() => console.log("MongoDB Conected"))
  .catch(err => console.log(err));

// PAssport Middleware
app.use(passport.initialize());

//Passport Config
require("./config/passport")(passport);

//Use Route
app.use("/api/users", users);
app.use("/api/profile", profile);
app.use("/api/posts", posts);

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server runing on port ${port}`));
