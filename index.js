const express = require("express");
const csrf = require('csurf');
const cookieParser = require('cookie-parser');
const { urlencoded } = require("express");

const app = express();
const port = process.env.PORT || 3000;

app.set("view engine", "pug");
app.use(cookieParser())
app.use(express.urlencoded({extended: false}))

const csurfProtection = csrf({cookie: true})

const users = [
  {
    id: 1,
    firstName: "Jill",
    lastName: "Jack",
    email: "jill.jack@gmail.com"
  }
];

app.get("/", (req, res) => {
  res.render("index", { users })
});

app.get("/create", csurfProtection, (req, res) => {
  res.render("create", {title: "Create", csrfToken: req.csrfToken(), errors: [], firstName: {}, lastName: {}, email: {}, password: {}})
})

const validation = (req, res, next) => {
  const { firstName, lastName, email, password } = req.body;
  req.errors = [];

  if (!firstName) {
    req.errors.push("Please provide a first name.");
  }
  if (!lastName) {
    req.errors.push("Please provide a last name.");
  }
  if (!email) {
    req.errors.push("Please provide an email.");
  }
  if (!password) {
    req.errors.push("Please provide a password.");
  }

  next();
}

app.post("/create", csurfProtection, validation, (req, res) => {
  if (req.errors.length > 0) {
    res.render("create", {title: "Create", csrfToken: req.csrfToken(), errors: req.errors, firstName: req.body.firstName, lastName: req.body.lastName, email: req.body.email, password: req.body.password})
  } else {
    users.push(
        {
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          email: req.body.email,
          password: req.body.password
      }
    )
  }
})


app.listen(port, () => console.log(`Example app listening on port ${port}!`));

module.exports = app;
