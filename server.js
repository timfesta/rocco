// require frameworks and additional modules--//
var express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    mongoose = require("mongoose"),
    User = require('./models/user'),
    Stock = require('./models/stock'),
    session = require('express-session'),
    _ = require('underscore');

     
 //---- Connection to the DB------------------//
mongoose.connect(process.env.MONGOLAB_URI || 'mongodb://localhost/ryanshim'); // plug in the db name you've been using

      

//---tell app to use bodyParser middleware and cors---//
// app.use(cors())
app.use(bodyParser.urlencoded({extended: true}));
app.use(session({
  saveUninitialized: true,
  resave: true,
  secret: 'SuperSecretCookie',
  cookie: { maxAge: 60000 }
}));

app.use(express.static(__dirname + "/public"));

// middleware to manage sessions
app.use('/', function (req, res, next) {
  // saves userId in session for logged-in user
  req.login = function (user) {
    req.session.userId = user.id;
  };

  // finds user currently logged in based on `session.userId`
  req.currentUser = function (callback) {
    User.findOne({_id: req.session.userId}, function (err, user) {
      req.user = user;
      callback(null, user);
    });
  };

  // destroy `session.userId` to log out user
  req.logout = function () {
    req.session.userId = null;
    req.user = null;
  };

  next();
});



// ------ grabs SECURITY.JS FILE - DB SCHEMA ----///
var Stock = require('./models/stock')



//------------- Route to home page-----------//
app.get('/', function (req, res) {
   var index = __dirname + "/public/views/index.html";
  res.sendFile(index);
});


//---------ROUTE TO SIGNUPs----------------//
app.get('/signup', function (req, res) {
  res.send('coming soon');
});

// user submits the signup form
app.post('/users', function (req, res) {
  // grab user data from params (req.body)
  var newUser = req.body.user;
  // create new user with secure passtext
  User.createSecure(newUser.email, newUser.passtext, function (err, user) {
    res.send(user);
  });
});

// login route (renders login view)
app.get('/login', function (req, res) {
  res.sendFile(__dirname + "/public/views/login.html"); 
});


// user submits the login form
app.post('/login', function (req, res) {
  var userData = req.body.user;
  // call authenticate function to check if passtext user entered is correct
  User.authenticate(userData.email, userData.passtext, function (err, user) {
      req.login(user);  
  });
    // redirect to user profile
  res.redirect('/profile');
});

// user profile page
app.get('/profile', function (req, res) {
  // finds user currently logged in
  req.currentUser(function (err, user) {
    res.send('Welcome ' + user.email);
  });
});



//---------ROUTE TO STOCKS PAGE-----------//

app.get('/stocks', function (req, res) {
  var stocks = __dirname + "/public/views/stocks.html"; 
  res.sendFile(stocks);
});




//---------Route to stocks and grab stocks----//

app.get('/api/stocks', function (req, res) {
	Stock.find({}).exec(function(err, stocks){
     res.send(stocks);
	});
});

//---------- POST a new stock  -----------------//

// create new STOCK
app.post('/api/stocks', function(req, res) {
 // create new STOCK with form data (`req.body`)
	var stockText = req.body.symbol;
  var changeText = req.body.Change;

  var stock = new Stock({
    symbol: stockText,
    Change: changeText
  });

  stock.save(function(err, stock) {
    res.send(stock);
  });
});



// get one stock
app.get('/api/stocks/:id', function (req, res) {
  // set the value of the id
  var targetId = req.params.id;

  // find stock in db by id
  Stock.findOne({_id: targetId}, function (err, foundStock) {
    res.json(foundStock);
  });
});


// get all stocks
app.get('/api/stocks', function (req, res) {
  // find all stocks in db
  Stock.find(function (err, stocks) {
    res.json(stocks);
  });
});

// update stock
app.put('/api/stocks/:id', function (req, res) {
  // set the value of the id
  var targetId = req.params.id;

  // find stock in db by id
  Stock.findOne({_id: targetId}, function (err, foundStock) {
    // update the stock's text and definition
    foundStock.text = req.body.text;
    

    // save updated Stock in db
    foundStock.save(function (err, savedStock) {
      res.json(savedStock);
    });
  });
});

// delete stock
app.delete('/api/stocks/:id', function (req, res) {
  // set the value of the id
  var targetId = req.params.id;

  // find stock in db by id and remove
  Stock.findOneAndRemove({_id: targetId}, function (err, deletedStock) {
    res.json(deletedStock);
  });
});

//----------listen on port 3000---------------//
app.listen(process.env.PORT || 3000);