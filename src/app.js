const path = require( 'path' )
const express = require( 'express' )
const hbs = require('hbs')
const flash = require('express-flash')
const session = require('express-session')
const passport = require('passport')


const app = express()

// Express Session Middleware
/////////////////////////////////////////////
//Experimental middleware

app.use(flash()) 
app.use(session({
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true,
    rolling: true,
    cookie: { 
        maxAge: 600000 
    }
}));
app.use(passport.initialize())
app.use(passport.session())



////////////////////////////////////////////

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


app.get('',checkNotAuthenticated, (req,res) => {
    res.render('index',{
        appName : "AADARSH STOCK"
    })
})

app.get('/disclaimer', (req,res) => {
    var user = req.user
    res.render('disclaimer',{user})
})
app.get('/contacts', (req,res) => {
    var user = req.user
    res.render('contacts',{user})
})
///////// Exported server side javascript codes /////////

const register = require('../src/registerData')
app.use('/register', register)

const login = require('../src/loginData')
app.use('/login', login)

const home = require('../src/home')
app.use('/home', home)

/////////////////////////////////////////////////////////

app.get('*', (req,res) => {
    res.render('404',{
        error : " Error 404",
        message : "Please try again with proper address",
        seeOffMessage : "Thanks for visiting us!"
    })
})
/////////////////////////////////////////////////////////
function checkAuthenticated( req,res,next ){
    if( req.isAuthenticated() ){
        return next()
    }
    res.redirect('/login')
}
function checkNotAuthenticated( req,res,next ){
    if( req.isAuthenticated() ){
        return res.redirect('/home')
    }
    next()
}
//////////////////////////////////////////////////////////


app.listen(port,()=>{
    console.log('App Started at ' + port)
})