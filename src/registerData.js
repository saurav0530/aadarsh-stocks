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
    
    res.render('register',{
        message : " ",
        danzer : " ",
        link : " "
    })
})

router.post('/',( req,res ) =>{
    let newUser ={
        firstName : req.body.registerFirstName,
        lastName : req.body.registerLastName,
        email : req.body.registerEmail,
        password : req.body.registerPassword,
        mobile : req.body.registerMobile,
        access : "User",
        admin : false
    }
    var testFunc1 = function(data){
        mongodbData.writeFunc( 'users', data )
        res.render('register',{
            color : "green",
            message : "Registration Successful!",
            link : "Go to Login"
        })
    }
    var testFunc2 = function(){
        res.render('register',{
            message : "! E-mail already taken !",
            color : "red",
            link : " "
        })
    }
    mongodbData.mongoConnect().then((client)=>{
        var db = client.db('aadarshDatabase')
        db.collection('users').findOne({email : newUser.email}).then((data)=>{
            if(data){
                testFunc2()
            }else{
                testFunc1(newUser)
            }
        }).catch((err) => console.log(err))
    }).catch((err) => console.log(err,"connection error"))
})

module.exports = router