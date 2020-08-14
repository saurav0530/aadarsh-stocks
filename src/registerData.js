const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const path = require('path')
const mongodbData = require('./mongo')
const bodyParser = require('body-parser')
const sgMail = require('@sendgrid/mail')
const {mailapikey}=require('./keys')
const { ObjectId } = require('mongodb')
const algo = require('./algo')


// parse application/x-www-form-urlencoded
router.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
router.use(bodyParser.json())





router.get('/',checkNotAuthenticated,(req,res) =>{
    
    res.render('register',{
        message : req.flash('message'),
        danzer : req.flash('danzer'),
        link : req.flash('link'),
        color : req.flash('color')
    })
})
router.get('/:id',checkNotAuthenticated,(req,res)=>{
    res.render('register',{
        referralCode : req.params.id,
        message : req.flash('message'),
        danzer : req.flash('danzer'),
        link : req.flash('link'),
        color : req.flash('color')
    })
})
router.post('/',async ( req,res ) =>{
    var date = new Date()
    date.setDate(date.getDate()+13)
    date = date.toISOString()
    let newUser ={
        firstName : req.body.registerFirstName,
        lastName : req.body.registerLastName,
        email : req.body.registerEmail,
        password : req.body.registerPassword,
        mobile : req.body.registerMobile,
        access : "User",
        admin : false,
        referredTo : [],
        payment : [],
        planExpiry : date,
        planName : "Free-trial",
        status : true
    }
    var regSucMssg = async function(data){
        await mongodbData.writeFunc( 'users', data )
        req.flash('color' ,'green')
        req.flash('message' ,'Registration Successful')
        req.flash('link' ,'Go to Login')
        res.redirect('/register')
    }
    var dupEmailMssg = function(){
        req.flash('color' ,'red')
        req.flash('message' ,'E-mail already taken')
        req.flash('link' ,'')
        if(req.body.referralCode)
            return res.redirect(`${req.originalUrl}/${req.body.referralCode}`)
        res.redirect('/register')

    }
    var saveNewUserData = ()=>{
        mongodbData.mongoConnect().then(async (client)=>{
            var db = client.db('aadarshDatabase')
            await db.collection('users').findOne({email : newUser.email}).then(async (data)=>{
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
                                    if(data){
                                        data.referredTo.push(newUser.email)
                                        referee = data
                                        newUser.referredBy = data.email
                                        db.collection('users').updateOne({referralID : req.body.referralCode},{$set : data})
                                    }
                                }).catch(err =>{
                                    console.log(err)
                                })
                            })
                            //console.log(referee)
                            if(referee){
                                await regSucMssg(newUser)
                                sendmail(newUser.email)
                            }
                            else
                            {
                                //console.log(req)
                                req.flash('color' ,'red')
                                req.flash('message' ,'Invalid Referral Code')
                                req.flash('link' ,'')
                                res.redirect(`/register`)
                            }
                        }
                        else{
                            //console.log(req)
                            req.flash('color' ,'red')
                            req.flash('message' ,'Invalid Referral Code')
                            req.flash('link' ,'')
                            res.redirect(`/register`)
                        }
                    }
                    else{
                        regSucMssg(newUser)
                        sendmail(newUser.email)
                    }
                
                ////////////////////////////////////////////////////////////////////////////////////////////// 
                }
            }).catch((err) => console.log(err))
            client.close()
        }).catch((err) => console.log(err,"connection error"))   
    }

    //---------------------MAIL Function--------------------------------------
    var sendmail= function(email){
    sgMail.setApiKey(mailapikey);
    var htmlDoc = `
        <strong>Hi Dear <br> A warm welcome from Aadarsh Stocks family. Wish we have a great ahead. </strong>
    `
    const msg = {
    to: email,
    from: 'aadarshstock@gmail.com',
    subject: 'Welcome to Aadarsh Stocks Family !!',
    text: 'and easy to do anywhere, even with Node.js',
    html: htmlDoc,
    };
    sgMail.send(msg);
    }

    if(newUser.password == req.body.registerPassword2){
        await saveNewUserData()           
    }else{
        req.flash('color' ,'red')
        req.flash('message' ,"Password didn't match...")
        req.flash('link' ,'')
        if(req.body.referralCode)
            res.redirect(`${req.originalUrl}/${req.body.referralCode}`)
        else
            res.redirect('/register')
    }
         
})

function checkNotAuthenticated( req,res,next ){
    if( req.isAuthenticated() ){
        return res.redirect('/home')
    }
    next()
}

module.exports = router