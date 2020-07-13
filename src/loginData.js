const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const path = require('path')
const mongodbData = require('./mongo')
const bodyParser = require('body-parser')


// parse application/x-www-form-urlencoded
router.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
router.use(bodyParser.json())


router.get('/',(req,res) =>{
    res.render('login',{
        message : " "
    })
})
router.post('/',(req,res)=>{
    const {choice,username,password} = req.body
    var userType = ( choice == 1 )?'users':'admin'
    mongodbData.mongoConnect().then(client =>{
        var db = client.db('aadarshDatabase')
        db.collection(userType).findOne({email : username,password:password}).then( user =>{
            if(user){
                res.app.locals.user = user
                //console.log(res.locals)
                res.redirect('/login/home')
            }else{
                res.render('login',{
                    message : "Invalid Credentials"
                })
            }
        })
    })
})
router.get('/home',(req,res)=>{
    if( res.app.locals.user )
        res.render('loginLayout')
        
    else 
        res.redirect('/')
})

router.post('/home',(req,res)=>{
    console.log(res.app.locals.user)
    if( res.app.locals.user )
    {
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
            res.app.locals.user = null
            res.redirect('/')
        }
    }    
})

/////////////////////////////////////    Stock-Display    /////////////////////////////////////////

router.get('/stockData',(req,res) =>{
    if( res.app.locals.user )
    {
        if(res.app.locals.stockData)
        {
            res.render('stockData',res.app.locals.stockData)
            res.app.locals.stockData = null
        }
        else
            res.render('stockData')
    }
    else 
        res.redirect('/')
})

router.post('/stockData',(req,res)=>{
    mongodbData.mongoConnect().then(client =>{
        var db = client.db('aadarshDatabase')
        db.collection('stock').findOne({date : req.body.stockViewDate},(err,stock)=>{
            if(err)
                return console.log(err)
            
            if(stock){
                res.app.locals.stockData = stock
                console.log(stock)
                res.redirect("/login/stockData")
            }else{
                res.render('stockData',{
                    message : "No stocks available for this date."
                })
            }
        })
    }).catch(err => console.log(err))
})

///////////////////////////////////////    Data Input    //////////////////////////////////////////

router.get('/dataInput',(req,res) =>{
    if( res.app.locals.user && res.app.locals.user.admin )
    {
        res.render('dataInput')
    }
    else 
        res.redirect('/')
})
router.post('/dataInput/date',(req,res)=>{
    // making localstorage null
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
                res.render('dataInput')
            }else{
                res.app.locals.stock = {
                    date : "",
                    data : [],
                    para1 : "",
                    para2 : ""
                }
                res.app.locals.update = false
                res.app.locals.stock.date = req.body.stockEntryDate
                res.render('dataInput')
            }
        })
    }).catch(err => console.log(err))
})

router.post('/dataInput/data',(req,res)=>{
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
    res.render('dataInput')
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

router.get('/accountDetails',(req,res) =>{
    if( res.app.locals.user )
    {
        res.render('accountDetails')
    }
    else 
        res.redirect('/')
})

////////////////////////////////////////////////////////////////////////////////////////////////////////

module.exports = router