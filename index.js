const express = require('express');
const mustacheExpress = require('mustache-express');
const session = require('express-session');
const expressValidator = require('express-validator');
const bodyParser = require("body-parser");

const app = express();

/*******************************************************************************
** I'm going to hard-code a list of usernames and passwords
*******************************************************************************/
const allUsers = {
  admin: "password",
  bob: "vanhalenou812",
  jason: "12345678"
}
app.engine('mustache', mustacheExpress());
app.set('views', './views');
app.set('view engine', 'mustache');

app.use(session({
  secret: 'forty two',
  resave: false,
  saveUninitialized: true
}));

app.use(bodyParser.urlencoded({extended: true}));

// use validator to check form submissions
app.use(expressValidator());

app.use(function(req, res, next) {

  if (!req.session.users) {
    req.session.users = allUsers;
    req.session.loggedIn = false;
    req.session.user = "";
    console.log(req.session);
  }
  next();
});

app.get('/', function(req, res) {
  //check if logged in
  if (req.session.loggedIn) {
    res.render('index', { username: req.session.user, loggedIn: true });
  } else {
    res.redirect('login');
  }
  //if yes render page
  //if no send to '/login'
});

app.get('/login', function(req, res) {
  //show login page
  res.render('login', {});
})

app.post('/login', function(req, res) {
  //check form submission for username:password match
  req.checkBody('username', 'please enter a username').notEmpty();
  req.checkBody('password', 'username and password don\'t match')
    .notEmpty()
    .equals(req.session.users[req.body.username]);
  //if good send to '/'
  //if not display error and reload form
  const errors = req.validationErrors();
  if (errors) {
    res.render('login', { errors: errors[0].msg });
  } else {
    req.session.loggedIn = true;
    req.session.user = req.body.username;
    res.redirect('/');
  }
});

app.listen(3000, () => console.log('Servin\' on :3000...'));
