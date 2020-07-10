const path = require( 'path' )
const express = require( 'express' )
const hbs = require('hbs')
const flash = require('connect-flash')
const session = require('express-session')


const app = express()

// Express Session Middleware
app.use(session({
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true
  }));

// Express Messages Middleware
app.use(require('connect-flash')());
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});


//PORT FOR SERVER
const port = process.env.PORT || 4000

// PATH FOR DIFFERENT RESOURCES
const resourcePath = path.join(__dirname,'../resource')
const viewsPath = path.join(__dirname,'../template/views')
const partialsPath = path.join(__dirname,'../template/partials')

//setup handlebars engine and views location
app.set( 'view engine', 'hbs')
app.set( 'views', viewsPath)
hbs.registerPartials(partialsPath)

//Setup static directory to serve 
app.use( express.static(resourcePath))


// app.use(function(req, res, next){
//     console.log(req.user)
//     res.locals.user = req.user || null;
//     next();
// });


app.get('', (req,res) => {
    res.render('index',{
        appName : "AADARSH STOCK"
    })
})

app.get('/disclaimer', (req,res) => {
    res.render('disclaimer')
})
app.get('/contacts', (req,res) => {
    res.render('contacts')
})
///////// Exported server side javascript codes /////////

const register = require('../src/registerData')
app.use('/register', register)

const login = require('../src/loginData')
app.use('/login', login)

/////////////////////////////////////////////////////////

// app.get('*', (req,res) => {
//     res.render('404',{
//         error : " Error 404",
//         message : "Please try again with proper address",
//         seeOffMessage : "Thanks for visiting us!"
//     })
// })




app.listen(port,()=>{
    console.log('App Started at ' + port)
})