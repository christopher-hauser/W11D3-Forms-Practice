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

app.get("/create-interesting", csurfProtection, (req, res) => {
  res.render("create-interesting", {title: "Create Interesting", csrfToken: req.csrfToken(), errors: [], firstName: {}, lastName: {}, email: {}, password: {}, age: {}, favoriteBeatle: {}, iceCream: "Checked" })
})

const validation = (req, res, next) => {
  const { firstName, lastName, email, password, confirmedPassword, age, favoriteBeatle, iceCream } = req.body;
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
  if (password !== confirmedPassword) {
    req.errors.push("The provided values for the password and password confirmation fields did not match.")
  }
  //let beatles = ['John', 'George', 'Ringo', 'Paul', "Scooby-Doo"]
  // if (req.path === '/create-interesting') {
  //   if (!age) {
  //     req.errors.push('age is required')
  //   }
  //   if (age < 0 || age > 120 || !(typeof age === Number )) {
  //     req.errors.push('age must be a valid age')
  //   }

  //   if (!beatles.includes(favoriteBeatle) ) {
  //     req.errors.shift("favoriteBeatle is required")
  //   }
  //   if (favoriteBeatle === "Scooby-Doo") {
  //     req.errors.shift("favoriteBeatle must be a real Beatle member")
  //   }
  // }

  next();
}

const ageValidation = (req, res, next) => {
  const { firstName, lastName, email, password, confirmedPassword, age, favoriteBeatle, iceCream } = req.body;
  if (!age) {
    req.errors.push('age is required')
  }
  if (age < 0 || age > 120) {
    req.errors.push('age must be a valid age')
  }
  age = Number.parseInt(age, 10)
  if (!typeof age === Number){
    req.errors.push('age must be a valid age')
  }
  next()
}

const beatlesValidation = (req, res, next) => {
  const { firstName, lastName, email, password, confirmedPassword, age, favoriteBeatle, iceCream } = req.body;
  let beatles = ['John', 'George', 'Ringo', 'Paul', "Scooby-Doo"]
  if (!beatles.includes(favoriteBeatle) ) {
    req.errors.push("favoriteBeatle is required")
  }
  if (favoriteBeatle === "Scooby-Doo") {
    req.errors.push("favoriteBeatle must be a real Beatle member")
  }
  next()
}

let nextId = 2;

app.post("/create", csurfProtection, validation, (req, res) => {
  if (req.errors.length > 0) {
    res.render("create", {title: "Create", csrfToken: req.csrfToken(), errors: req.errors, firstName: req.body.firstName, lastName: req.body.lastName, email: req.body.email, password: req.body.password})
  } else {
    users.push(
        {
          id: nextId,
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          email: req.body.email,
          password: req.body.password
      }
    )
    nextId++
    res.redirect('/')
  }
})

app.post("/create-interesting", csurfProtection, validation, ageValidation, beatlesValidation, (req, res) => {
  if (req.errors.length > 0) {
    console.log(req.body.firstName)
    res.render('create-interesting', {title: "Create Interesting", csrfToken: req.csrfToken(), errors: req.errors, firstName: req.body.firstName, lastName: req.body.lastName, email: req.body.email, password: req.body.password, age: req.body.age, favoriteBeatle: req.body.favoriteBeatle, iceCream: req.body.iceCream})
  } else {
    users.push(
      {
        id: nextId,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: req.body.password,
        age: req.body.age,
        favoriteBeatle: req.body.favoriteBeatle,
        iceCream: req.body.iceCream
    }

    )
    nextId++
    res.redirect('/')
  }
})




app.listen(port, () => console.log(`Example app listening on port ${port}!`));

module.exports = app;
