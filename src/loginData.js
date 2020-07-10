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
                    message : "Invalid username or password"
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
    if( res.app.locals.user )
    {
        console.log(req.body)
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

router.get('/stockData',(req,res) =>{
    if( res.app.locals.user )
    {
        res.render('stockData')
    }
    else 
        res.redirect('/')
})

router.get('/dataInput',(req,res) =>{
    if( res.app.locals.user )
    {
        res.render('dataInput')
    }
    else 
        res.redirect('/')
})
router.post('/dataInput',(req,res)=>{

    res.app.locals.stock = {
        date : "",
        data : "",
        para1 : "",
        para2 : ""
    }
    res.app.locals.stock.date = req.body.stockEntryDate
    console.log(req.body)
})

router.get('/accountDetails',(req,res) =>{
    if( res.app.locals.user )
    {
        res.render('accountDetails')
    }
    else 
        res.redirect('/')
})



module.exports = router