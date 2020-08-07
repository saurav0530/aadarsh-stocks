const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const path = require('path')
const mongodbData = require('./mongo')
const bodyParser = require('body-parser')
const sgMail = require('@sendgrid/mail')
const {mailapikey}=require('./keys')
const { ObjectId } = require('mongodb')


// parse application/x-www-form-urlencoded
router.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
router.use(bodyParser.json())





router.get('/',(req,res) =>{
    
    res.render('register',{
        message : req.flash('message'),
        danzer : req.flash('danzer'),
        link : req.flash('link'),
        color : req.flash('color')
    })
})
router.get('/:id',(req,res)=>{
    res.render('register',{referralCode : req.params.id})
})
router.post('/',async ( req,res ) =>{
    let newUser ={
        firstName : req.body.registerFirstName,
        lastName : req.body.registerLastName,
        email : req.body.registerEmail,
        password : req.body.registerPassword,
        mobile : req.body.registerMobile,
        access : "User",
        admin : false,
        referredTo : []
    }
    var regSucMssg = async function(data){
        await mongodbData.writeFunc( 'users', data )
        req.flash('color' ,'green')
        req.flash('message' ,'Registration Successful!')
        req.flash('link' ,'Go to Login')
        res.redirect('/register')
    }
    var dupEmailMssg = function(){
        req.flash('color' ,'red')
        req.flash('message' ,'! E-mail already taken !')
        req.flash('link' ,'')
        res.redirect('/register')
    }
    var saveNewUserData = ()=>{
        mongodbData.mongoConnect().then((client)=>{
            var db = client.db('aadarshDatabase')
            db.collection('users').findOne({email : newUser.email}).then(async (data)=>{
                if(data){
                    dupEmailMssg()
                }else{
                    /////////////////////////////////// Referral Implementation //////////////////////////////////
 
                    if(req.body.referralCode){
                        if(req.body.referralCode){
                            var referee
                            await mongodbData.mongoConnect().then(async (client)=>{
                                var db = client.db('aadarshDatabase')
                                await db.collection('users').findOne({referralID : req.body.referralCode}).then((data)=>{
                                    data.referredTo.push(newUser.email)
                                    referee = data
                                    newUser.referredBy = data.email
                                    db.collection('users').updateOne({referralID : req.body.referralCode},{$set : data})
                                }).catch(err =>{
                                    console.log(err)
                                })
                            })
                            //console.log(referee)
                            if(referee){
                                regSucMssg(newUser)
                                sendmail(newUser.email)
                                mongodbData.mongoConnect().then(client =>{
                                    var db = client.db('aadarshDatabase')
                                    db.collection('users').findOne({email : newUser.email}).then(data1 =>{
                                        //console.log(data1)
                                        mongodbData.referralIDassign(data1._id)
                                    })
                                })
                            }
                            else
                            {
                                req.flash('color' ,'red')
                                req.flash('message' ,'Invalid Referral Code')
                                req.flash('link' ,'')
                                res.redirect('/register')
                            }
                        }
                        else{
                            req.flash('color' ,'red')
                            req.flash('message' ,'Invalid Referral Code')
                            req.flash('link' ,'')
                            res.redirect('/register')
                        }
                    }
                    else{
                        regSucMssg(newUser)
                        sendmail(newUser.email)
                        mongodbData.mongoConnect().then(client =>{
                            var db = client.db('aadarshDatabase')
                            db.collection('users').findOne({email : newUser.email}).then(data1 =>{
                                mongodbData.referralIDassign(data1._id)
                            })
                        })
                    }
                
                ////////////////////////////////////////////////////////////////////////////////////////////// 
                }
            }).catch((err) => console.log(err))
        }).catch((err) => console.log(err,"connection error"))   
    }

    //---------------------MAIL Function--------------------------------------
    var sendmail= function(email){
    sgMail.setApiKey(mailapikey);
    const msg = {
    to: email,
    from: 'aadarshstock@gmail.com',
    subject: 'Welcome to Aadarsh Stocks Family !!',
    text: 'and easy to do anywhere, even with Node.js',
    html: '<strong>Hi Dear <br> A warm welcome from Aadarsh Stocks family. Wish we have a great ahead. </strong>',
    };
    sgMail.send(msg);
    }

    if(newUser.password == req.body.registerPassword2){
        saveNewUserData()   
    }else{
        req.flash('color' ,'red')
        req.flash('message' ,"Password didn't match...")
        req.flash('link' ,'')
        res.redirect('/register')
    }
        
})

module.exports = router