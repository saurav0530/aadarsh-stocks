const path = require( 'path' )
const express = require( 'express' )
const hbs = require('hbs')
const flash = require('express-flash')
const session = require('express-session')
const passport = require('passport')
const mongo = require('./mongo')
const { ObjectId } = require('mongodb')


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


app.get('',checkNotAuthenticated,async (req,res) => {
    var carousel,notice
    await mongo.mongoConnect().then(async client=>{
        var db = client.db('aadarshDatabase')
        await db.collection('carousel').findOne({_id : ObjectId('5f5211f675f631ef29f09728')}).then(async data =>{
            carousel = data.image
            //console.log(carousel)
            await db.collection('carousel').findOne({_id : ObjectId('5f5ecb13ed34ea1283305534')}).then(async data1 =>{
                notice = data1
            })
            res.render('index',{
                appName : "AADARSH STOCK",
                carousel : carousel,
                first : carousel.length,
                firstImg : carousel[0].name,
                notice : notice
            })
            client.close()
        })
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
app.get('/faqs', async (req,res) => {
    var faqs
    await mongo.mongoConnect().then(async client =>{
        var db = client.db('aadarshDatabase')
        await db.collection('faqs').findOne({_id : ObjectId('5f4b7bd1c136e92dd8b793ca')}).then(data=>{
            faqs = data.data
            client.close()
        })
    })
    res.render('faqs',{faqs})
})
///////// Exported server side javascript codes /////////

const register = require('../src/registerData')
app.use('/register', register)

const login = require('../src/loginData')
app.use('/login', login)

const home = require('../src/home')
app.use('/home', home)

const customize = require('../src/customize')
const { ObjectID } = require('mongodb')
app.use('/customize',customize)

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