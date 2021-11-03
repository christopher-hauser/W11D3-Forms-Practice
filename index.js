const express = require("express");
const csrf = require('csurf');
const cookieParser = require('cookie-parser')

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
  res.render("create", {csrfToken: req.csrfToken()})
})


app.listen(port, () => console.log(`Example app listening on port ${port}!`));

module.exports = app;
