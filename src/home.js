const express = require('express')
const router = express.Router()
const mongodbData = require('./mongo')
const bodyParser = require('body-parser')
const { ObjectId } = require('mongodb')
const pay = require('./payment')
const paytmPay = require('./payment')
const algo = require('./algo')
const fs = require('fs')
const upload = require('express-fileupload')
const excel = require('exceljs')
const cookieParser = require('cookie-parser')

router.use(cookieParser())

// parse application/x-www-form-urlencoded
router.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
router.use(bodyParser.json())

router.use(upload())

router.get('/',checkAuthenticated,(req,res)=>{
    if( req.user ){
        user = req.user
        res.render('loginLayout',{user})
    }
})

router.post('/',checkAuthenticated,(req,res)=>{
    if(req.body.loginChoice == 1)
    {
        res.redirect('/home')
    }
    else if(req.body.loginChoice == 2)
    {
        res.redirect('/home')
    }
    else if(req.body.loginChoice == 3)
    {
        res.redirect('/home/stockData')    
    }
    else if(req.body.loginChoice == 4)
    {
        res.redirect('/home/dataInput')
    }
    else if(req.body.loginChoice == 5)
    {
        var dispBody = user.payment[user.payment.length - 1]
        if(dispBody){
            res.render('message',{
                user : req.user,
                dispBody
            })
        }
        else{
            req.flash('subscriptionWarning','No transaction history...')
            res.redirect('/home/pricing')
        }
    }
    else if(req.body.loginChoice == 6)
    {
        res.redirect('/home/pricing')
    }
    else if(req.body.loginChoice == 7)
    {
        res.redirect('/home/profile')
    }
    else if(req.body.loginChoice == 8)
    {
        res.redirect('/home/changePassword')
    }
    else if(req.body.loginChoice == 9)
    {
        req.logOut()
        res.redirect('/')        
    } 
})

/////////////////////////////////////    Stock-Display    /////////////////////////////////////////

router.get('/stockData',checkAuthenticated,checkSubscribed,(req,res) =>{
    var user = req.user
    res.render('stockData',{user})
})

router.post('/stockData',checkAuthenticated,checkSubscribed,(req,res)=>{
    var user = req.user
    mongodbData.mongoConnect().then(async client =>{
        var db = client.db('aadarshDatabase')
        await db.collection('stock').findOne({date : req.body.stockViewDate},(err,stock)=>{
            if(err)
                return console.log(err)
            
            if(stock){
                var stockData = stock
                res.render('stockData',{stockData,user})
            }else{
                res.render('stockData',{
                    message : "No stocks available for this date.",
                    user
                })
            }
            client.close()
        })
    }).catch(err => console.log(err))
})

///////////////////////////////////////    Data Input    //////////////////////////////////////////

router.get('/dataInput',checkAuthenticated,checkAdmin,(req,res) =>{
    if(req.user.admin){
        res.render('dataInput',{
            user : req.user,
            message : req.flash('message')
        })
    }else{
        res.redirect('/home')
    }
    
})
router.post('/dataInput/date',checkAuthenticated,checkAdmin,(req,res)=>{
    var user = req.user
    res.app.locals.stock = undefined
    res.app.locals.update = undefined

    mongodbData.mongoConnect().then(async client =>{
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
                    para2 : "",
                    link : []
                }
                res.app.locals.update = false
                res.app.locals.stock.date = req.body.stockEntryDate
                res.render('dataInput',{user})
            }
            client.close()
        })
        
    }).catch(err => console.log(err))
})

router.post('/dataInput/data',checkAuthenticated,checkAdmin,(req,res)=>{
    if(req.files)
    {
		fs.unlink('./uploads/test.xlsx',(err)=>{
            if(err)
              return console.log(err)    
            //console.log('Deleted')
          })
	  var file = req.files.xlsx
      file.mv('./uploads/test.xlsx',(err)=>{
        if(err)
          console.log(err)
        else
        {
          //console.log('Done!')
          var test = new excel.Workbook()
                   
          test.xlsx.readFile('./uploads/test.xlsx').then(()=>{
			var sh = test.getWorksheet("Sheet1")
            var stock = new Array(),link = new Array(),para1,para2
			for (i = 2; i <= sh.rowCount; i++) { 
				if(sh.getRow(i).getCell(1).value == null)
					break
				var data = {
					stockName : sh.getRow(i).getCell(1).value,
					buyAbove : sh.getRow(i).getCell(2).value,
					target : sh.getRow(i).getCell(3).value,
					stopLoss : sh.getRow(i).getCell(4).value,
					recentHigh : sh.getRow(i).getCell(5).value,
					recentLow : sh.getRow(i).getCell(6).value
				}
				stock.push(data)
            }
            for (i = 2; i <= sh.rowCount; i++) { 
				if(sh.getRow(i).getCell(7).value == null)
					break
				link.push(sh.getRow(i).getCell(7).value)
            }
            para1 = sh.getRow(2).getCell(8).value
            para2 = sh.getRow(2).getCell(9).value
			res.app.locals.stock.data = stock
            res.app.locals.stock.link = link
            res.app.locals.stock.para1 = para1
            res.app.locals.stock.para2 = para2 
          }).catch((err)=> console.log(err))
		}
      })
    }
    //console.log(res.app.locals.stock)
    res.render('dataInput',{user})
})
router.post('/dataInput/stockData',checkAuthenticated,checkAdmin,(req,res)=>{

    var data = res.app.locals.stock
    res.app.locals.stock = null
    if(res.app.locals.update){
        mongodbData.mongoConnect().then(async client =>{
            var db = client.db('aadarshDatabase')
            console.log('Update')
            await db.collection('stock').updateOne({date : data.date},{$set : data})
            client.close()
        }).catch(err => console.log(err))
    }
    else{
        mongodbData.mongoConnect().then(async client =>{
            var db = client.db('aadarshDatabase')
            //console.log('New')
            await db.collection('stock').insertOne(data)
            client.close()
        }).catch(err => console.log(err))
    }
    req.flash('message' ,'Stocks added successfully...')  
    res.redirect('/home/dataInput')
})

////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////        Pricing        //////////////////////////////////////////
router.get('/pricing',checkAuthenticated,(req,res)=>{
    var user = req.user
    if(user.status)
    {
        res.render('pricing',{user})
    }
    else
    {
        res.render('pricing',{
            user,
            warning : 'Your existing plan expired. Please subscribe to continue!'
        })
    }       
    
})

router.get('/payment/:id',checkAuthenticated,(req,res)=>{
    res.cookie('skey',req.user._id,{maxAge : 600000})
    var user = req.user
    if(req.params.id == 300 || req.params.id == 550)
        paytmPay(res,req.params.id,req.user.mobile,req.user.email)
    else
    {
        req.flash('subscriptionWarning','Invalid amount')
        res.redirect('/home/pricing')
    }
})
router.post('/paymentStatus',async (req,res)=>{
    //console.log(req.cookies)
    var ID = req.cookies.skey
    if(req.body.RESPMSG == 'Txn Success'){
        var dispBody ={
            orderid : req.body.ORDERID,
            txnid : req.body.TXNID,
            txndate : req.body.TXNDATE,
            bnkid : req.body.BANKTXNID,
            bnkname : req.body.GATEWAYNAME,
            status : req.body.STATUS,
            message : req.body.RESPMSG,
            amount : req.body.TXNAMOUNT
        }
        //console.log(dispBody)
        if(dispBody.amount == '300.00')
        {
            var planName = "Monthly"
        }
        else if(dispBody.amount == '550.00')
        {
            var planName = "Bi-monthly"
        }
        var user
        await mongodbData.mongoConnect().then(async client =>{
            var db = client.db('aadarshDatabase')
            await db.collection('users').findOne({_id : ObjectId(ID)}).then( async user1 =>{
                if(user1)
                {
                    user1.payment.push(dispBody)
                    user1.status = true
                    if(planName=='Bi-monthly'){
                        var date2 = new Date()
                        date2.setDate(date2.getDate()+55)
                        date2.toISOString()
                        planName = "56 days"
                    }else{
                        var date2 = new Date()
                        date2.setDate(date2.getDate()+27)
                        date2.toISOString()
                        planName = "28 days"
                    }
                    await db.collection('users').updateOne({_id : ObjectId(ID)},{$set : {
                        payment : user1.payment,
                        status : true,
                        planName : planName,
                        planExpiry : date2
                        }
                    })
                    user = user1
                }
            }).catch(error => console.log(error))
            var msg ={
                stats : req.body,
                user : user
            }
            await db.collection('payment').insertOne(msg).then(()=>{
                //console.log(req.body)
                client.close()
            })
            
        })
        res.render('message',{
            user,
            dispBody,
            sucmssg : "/home"
        })
        res.clearCookie('skey')
        if(req.user){
            req.logOut()
        }
    }
    else{
        var dispBody ={
            txnid : req.body.TXNID,
            txndate : req.body.TXNDATE,
            bnkid : req.body.BANKTXNID,
            bnkname : req.body.BANKNAME,
            status : req.body.STATUS,
            message : req.body.RESPMSG

        }
        var failedMessage = {
            txnMssg : req.body,
            user : {}
        }
        await mongodbData.mongoConnect().then(async client =>{
            var db = client.db('aadarshDatabase')
            await db.collection('users').findOne({_id : ObjectId(ID)}).then( async user =>{
                failedMessage.user = user
            })
            await db.collection('failedPayment').insertOne(failedMessage)
        })
        res.clearCookie('skey')
        if(req.user){
            req.logOut()
        }
        var user = failedMessage.user
        res.render('message',{
            user,
            dispBody,
            mssg : "/home/pricing"
        })
    }
})


///////////////////////////////////////    Account-Details    //////////////////////////////////////////

router.get('/profile',checkAuthenticated,(req,res) =>{
    var user = req.user
    res.render('profile',{user,message : "",color:"red"})
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
                client.close()
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

router.get('/logout',checkAuthenticated,(req,res)=>{
    req.logOut()
    res.redirect('/')
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
        return res.redirect('/home')
    }
    next()
}
function checkAdmin( req,res,next ){
    if( req.user && req.user.admin )
        return next()
    else if( req.user ){
        return res.redirect('/home')
    }else{
        res.redirect('/login')
    }
}
function checkCookie( req,res,next ){
    if( req.cookies.skey )
        return next()
    else{
        res.redirect('/login')
    }
}
function checkSubscribed(req,res,next){
    var user = req.user
    if(user.status)
        next()
    else
        res.redirect('/home/pricing')        
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////

module.exports = router