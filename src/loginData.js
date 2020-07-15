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
    successRedirect : '/home',
    failureRedirect : '/register',
    failureFlash : true
}))

function checkNotAuthenticated( req,res,next ){
    if( req.isAuthenticated() ){
        return res.redirect('/home')
    }
    next()
}

////////////////////////////////////////////////////////////////////////////////////////////////////////

module.exports = router