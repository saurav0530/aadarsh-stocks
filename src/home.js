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
        res.redirect('/home/stockData')
    }
    else if(req.body.loginChoice == 3)
    {
        res.redirect('/home/dataInput')    
    }
    else if(req.body.loginChoice == 6)
    {
        res.redirect('/home/pricing')
    }
    else if(req.body.loginChoice == 4)
    {
        res.redirect('/home/profile')
    }
    else if(req.body.loginChoice == 5)
    {
        req.logOut()
        res.redirect('/')
    }
    else if(req.body.loginChoice == 7)
    {
        res.redirect('/home')
    } 
})

/////////////////////////////////////    Stock-Display    /////////////////////////////////////////

router.get('/stockData',checkSubscribed,checkAuthenticated,(req,res) =>{
    var user = req.user
    res.render('stockData',{user})
})

router.post('/stockData',checkSubscribed,checkAuthenticated,(req,res)=>{
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
                    message : "No stocks available for this date.",
                    user
                })
            }
        })
    }).catch(err => console.log(err))
})

///////////////////////////////////////    Data Input    //////////////////////////////////////////

router.get('/dataInput',checkAuthenticated,(req,res) =>{
    if(req.user.admin){
        res.render('dataInput',{
            user : req.user,
            message : req.flash('message')
        })
    }else{
        res.redirect('/home')
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
                    para2 : "",
                    link : []
                }
                res.app.locals.update = false
                res.app.locals.stock.date = req.body.stockEntryDate
                res.render('dataInput',{user})
            }
        })
    }).catch(err => console.log(err))
})

router.post('/dataInput/data',checkAuthenticated,(req,res)=>{
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
router.post('/dataInput/stockData',(req,res)=>{

    var data = res.app.locals.stock
    res.app.locals.stock = null
    if(res.app.locals.update){
        mongodbData.mongoConnect().then(client =>{
            var db = client.db('aadarshDatabase')
            console.log('Update')
            db.collection('stock').updateOne({date : data.date},{$set : data})
        }).catch(err => console.log(err))
    }
    else{
        mongodbData.mongoConnect().then(client =>{
            var db = client.db('aadarshDatabase')
            //console.log('New')
            db.collection('stock').insertOne(data)
        }).catch(err => console.log(err))
    }
    req.flash('message' ,'Stocks added successfully...')  
    res.redirect('/home/dataInput')
})

////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////        Pricing        //////////////////////////////////////////
router.get('/pricing',checkAdmin,(req,res)=>{
    var user = req.user
    var warning = req.flash('subscriptionWarning')
    if(warning)
        res.render('pricing',{user,warning})
    else
        res.render('pricing',{user})
    
})

router.get('/payment/:id',checkAdmin,(req,res)=>{
    var user = req.user
    //console.log(req.params.id)
    paytmPay(res,req.params.id,req.user.mobile,req.user.email)
})
router.post('/paymentStatus',checkAdmin,async (req,res)=>{
    //console.log(req.body)
    if(req.body.RESPMSG == 'Txn Success'){
        var dispBody ={
            orderid : req.body.ORDERID,
            txnid : req.body.TXNID,
            txndate : req.body.TXNDATE,
            bnkid : req.body.BANKTXNID,
            bnkname : req.body.GATEWAYNAME,
            status : req.body.STATUS,
            message : req.body.RESPMSG
        }
        var user = req.user
        res.render('message',{
            user,
            dispBody,
            sucmssg : "/home"
        })
        mongodbData.mongoConnect().then(async client =>{
            var db = client.db('aadarshDatabase')
            await db.collection('users').findOne({_id : ObjectId(req.user._id)}).then( async user =>{
                if(user)
                {
                    console.log(user.payment)
                    user.payment.push(req.body)
                    await db.collection('users').updateOne({_id : ObjectId(req.user._id)},{$set : {
                        payment : user.payment
                    }
                })
            }
            }).catch(error => console.log(error))
        })
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
        var user = req.user
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
function checkSubscribed(req,res,next){
    var user = req.user
    if(user.status)
        next()
    else
    {
        req.flash('subscriptionWarning','Your existing plan expired. Please subscribe to continue!')
        res.redirect('/home/pricing')
    }
        
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////

module.exports = router