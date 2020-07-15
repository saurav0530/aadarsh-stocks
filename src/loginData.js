const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const path = require('path')
const mongodbData = require('./mongo')
const bodyParser = require('body-parser')
const passport = require('passport')

const initializePassport = require('./passport.config')
const { ObjectId } = require('mongodb')
initializePassport(passport)


// parse application/x-www-form-urlencoded
router.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
router.use(bodyParser.json())


router.get('/',checkNotAuthenticated,(req,res) =>{
    res.render('login',{
        message : " "
    })
})
// router.post('/',(req,res)=>{
//     const {choice,username,password} = req.body
//     var userType = ( choice == 1 )?'users':'admin'
//     mongodbData.mongoConnect().then(client =>{
//         var db = client.db('aadarshDatabase')
//         db.collection(userType).findOne({email : username,password:password}).then( user =>{
//             if(user){
//                 res.app.locals.user = user
//                 //console.log(res.locals)
//                 res.redirect('/login/home')
//             }else{
//                 res.render('login',{
//                     message : "Invalid Credentials"
//                 })
//             }
//         })
//     })
// })
router.post('/',passport.authenticate('local',{
    successRedirect : '/login/home',
    failureRedirect : '/register',
    failureFlash : true
}))
router.get('/home',checkAuthenticated,(req,res)=>{
    if( req.user ){
        user = req.user
        res.render('loginLayout',{user})
    }
})

router.post('/home',checkAuthenticated,(req,res)=>{
    if(req.body.loginChoice == 2)
    {
        res.redirect('/login/stockData')
    }
    else if(req.body.loginChoice == 3)
    {
        res.redirect('/login/dataInput')    
    }
    else if(req.body.loginChoice == 4)
    {
        res.redirect('/login/accountDetails')
    }
    else if(req.body.loginChoice == 5)
    {
        req.logOut()
        res.redirect('/')
    } 
})

/////////////////////////////////////    Stock-Display    /////////////////////////////////////////

router.get('/stockData',checkAuthenticated,(req,res) =>{
    var user = req.user
    res.render('stockData',{user})
})

router.post('/stockData',checkAuthenticated,(req,res)=>{
    var user = req.user
    mongodbData.mongoConnect().then(client =>{
        var db = client.db('aadarshDatabase')
        db.collection('stock').findOne({date : req.body.stockViewDate},(err,stock)=>{
            if(err)
                return console.log(err)
            
            if(stock){
                var stockData = stock
                res.render('stockData',{stockData,user})
            }else{
                res.render('stockData',{
                    message : "No stocks available for this date."
                })
            }
        })
    }).catch(err => console.log(err))
})

///////////////////////////////////////    Data Input    //////////////////////////////////////////

router.get('/dataInput',checkAuthenticated,(req,res) =>{
    if(req.user.admin){
        var user = req.user
        res.render('dataInput',{user})
    }else{
        res.redirect('/login/home')
    }
    
})
router.post('/dataInput/date',checkAuthenticated,(req,res)=>{
    var user = req.user
    res.app.locals.stock = undefined
    res.app.locals.update = undefined

    mongodbData.mongoConnect().then(client =>{
        var db = client.db('aadarshDatabase')
        db.collection('stock').findOne({date : req.body.stockEntryDate},(err,stock)=>{
            if(err)
                return console.log(err)
            
            if(stock){
                res.app.locals.stock = stock
                res.app.locals.update = true
                res.render('dataInput',{user})
            }else{
                res.app.locals.stock = {
                    date : "",
                    data : [],
                    para1 : "",
                    para2 : ""
                }
                res.app.locals.update = false
                res.app.locals.stock.date = req.body.stockEntryDate
                res.render('dataInput',{user})
            }
        })
    }).catch(err => console.log(err))
})

router.post('/dataInput/data',(req,res)=>{
    var user = req.user
    var data = {
        stockName : req.body.stockName,
        buyAbove : req.body.buyAbove,
        target : req.body.target,
        stopLoss : req.body.stopLoss,
        recentHigh : req.body.recentHigh,
        recentLow : req.body.recentLow,
        remarks : req.body.remarks,
    }
    res.app.locals.stock.data.push(data)
    //console.log(res.app.locals.stock)
    res.render('dataInput',{user})
})
router.post('/dataInput/stockData',(req,res)=>{
    res.app.locals.stock.para1 = req.body.para1Stock
    res.app.locals.stock.para2 = req.body.para2Stock

    var data = res.app.locals.stock
    res.app.locals.stock = null
    if(res.app.locals.update){
        mongodbData.mongoConnect().then(client =>{
            var db = client.db('aadarshDatabase')
            db.collection('stock').updateOne({date : data.date},{$set : data})
        }).catch(err => console.log(err))
    }
    else{
        mongodbData.mongoConnect().then(client =>{
            var db = client.db('aadarshDatabase')
            db.collection('stock').insertOne(data)
        }).catch(err => console.log(err))
    }  
    res.redirect('/login/dataInput')
})

///////////////////////////////////////    Account-Details    //////////////////////////////////////////

router.get('/accountDetails',checkAuthenticated,(req,res) =>{
    var user = req.user
    res.render('accountDetails',{user,message : "",color:"red"})
})

////////////////////////////////////////////// Change Password /////////////////////////////////////////
router.get('/changePassword',checkAuthenticated,(req,res)=>{
    var user = req.user
    res.render('changePassword',{user})
})
router.post('/changePassword',checkAuthenticated,async (req,res) =>{
    var user = req.user
    if( req.user.password == req.body.password1 ){
        if( req.body.password2==req.body.password3 ){
            await mongodbData.mongoConnect().then(async client =>{
                var db = client.db('aadarshDatabase')
                await db.collection('users').updateOne({_id :ObjectId(req.user._id)},{$set : {password : req.body.password2}})
                res.render('changePassword',{user,message : "Changed successfully",color:"green"})
            }).catch(err => console.log(err))
        }
        else{
            res.render('changePassword',{user,message : "Confirm didn't match",color:"red"})
        }
    }
    else{
        res.render('changePassword',{user,message : "Invalid Old Password",color:"red"})
    }
})

////////////////////////////////////////////////////////////////////////////////////////////////////////

function checkAuthenticated( req,res,next ){
    if( req.isAuthenticated() ){
        return next()
    }
    res.redirect('/login')
}
function checkNotAuthenticated( req,res,next ){
    if( req.isAuthenticated() ){
        return res.redirect('/login/home')
    }
    next()
}

////////////////////////////////////////////////////////////////////////////////////////////////////////

module.exports = router