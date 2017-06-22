const express = require('express');
const mustacheExpress = require('mustache-express');
const session = require('express-session');

const app = express();

app.engine('mustache', mustacheExpress());
app.set('views', './views');
app.set('view engine', 'mustache');

app.use(session({
  secret: 'forty two',
  resave: false,
  saveUninitialized: true
}));

app.use(function(req, res, next) {
  //const users = req.session.users = req.session.users || { "admin": "password" };
  if (!req.session) {
    req.session.users = { "admin": "password" };
    req.session.status = { "loggedIn": false };
    res.redirect('login');
  }
  next();
});

app.get('/', function(req, res) {
  //check if logged in
  //if yes render page
  //if no send to '/login'
});

app.get('/login', function(req, res) {
  //show login page
  res.render('login', {});
})

app.post('/login', function(req, res) {
  //check form submission for username:password match
  //if good send to '/'
  //if not display error and reload form
})
