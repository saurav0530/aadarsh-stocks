const path = require( 'path' )
const express = require( 'express' )
const hbs = require( 'hbs' )

const app = express()

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


app.get('', (req,res) => {
    res.render('index',{
        appName : "AADARSH STOCK"
    })
})
app.get('/login', (req,res) => {
    res.render('login')
})
app.get('/register', (req,res) => {
    res.render('register')
})
app.get('/disclaimer', (req,res) => {
    res.render('disclaimer')
})
app.get('/contacts', (req,res) => {
    res.render('contacts')
})
app.get('*', (req,res) => {
    res.render('404',{
        error : " Error 404",
        message : "Please try again with proper address",
        seeOffMessage : "Thanks for visiting us!"
    })
})




app.listen(port,()=>{
    console.log('App Started at ' + port)
})