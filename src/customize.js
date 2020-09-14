const express = require('express')
const router = express.Router()
const bodyParser = require('body-parser')
const mongo = require('./mongo')
const { ObjectId, ObjectID } = require('mongodb')
const alert = require('alert')
const multer = require('multer')
const path = require('path')
const fs = require('fs')

// parse application/x-www-form-urlencoded
router.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
router.use(bodyParser.json())
////////////////////////////////////////////////  MULTER ///////////////////////////////////////////
//Set the Storage Engine
const storage = multer.diskStorage({
    destination : (req, file, cb)=>{
        cb(null,'resource/publicCarousel/')
    },
    filename: async function(req,file,cb){
        let index = 1
        
        await mongo.mongoConnect().then(async client =>{
             var db = client.db('aadarshDatabase')
             await db.collection('carousel').findOne({_id : ObjectID('5f5211f675f631ef29f09728')}).then(async data =>{
                var temp = new Array()
                temp = data.image
                index = data.top + 1
                var newImage = {
                    name : 'img'+index
                }
                console.log(temp)
                temp.push(newImage)
                await db.collection('carousel').updateOne({_id : ObjectID('5f5211f675f631ef29f09728')},{$set :{image :temp, top : data.top +1}})
             })
        })
        cb(null,'img'+index)
    }
})

// Init upload
const upload = multer({
    storage : storage
}).single('carouselImage')
////////////////////////////////////////////////////////////////////////////////////////////////////

router.use(express.static('./public'))

router.get('/',checkAuthenticated,checkAdmin,async (req,res)=>{
    var user = req.user
    res.render('customize',{user })
})
router.get('/:id',checkAuthenticated,async (req,res)=>{
    var update = req.flash('statusUpdate')[0]
    var user = req.user
    var carousel = new Array()
    var notice
    await mongo.mongoConnect().then(async client=>{
        var db = client.db('aadarshDatabase')
        await db.collection('carousel').findOne({_id : ObjectID('5f5211f675f631ef29f09728')}).then(async data =>{
            carousel = data.image
        })
        await db.collection('carousel').findOne({_id : ObjectID('5f535acb4e99191b65b66381')}).then(async data=>{
            notice = data
        })
    })
    //console.log(carousel)
    if(req.params.id == 'adminfaqsentry'){
        res.render('customize1',{
            user,
            carousel : carousel,
            adminfaqsentry : true,
            adminAddCarousel : false,
            adminEditCarousel : false,
            adminAddNotice : false
        })
    }
    else if(req.params.id == 'adminAddCarousel'){
        res.render('customize1',{
            user,
            carousel : carousel,
            adminfaqsentry : false,
            adminAddCarousel : true,
            adminEditCarousel : false,
            adminAddNotice : false
        })
    }
    else if(req.params.id == 'adminEditCarousel'){
        res.render('customize1',{
            user,
            carousel : carousel,
            adminfaqsentry : false,
            adminAddCarousel : false,
            adminEditCarousel : true,
            adminAddNotice : false
        })
    }
    else if(req.params.id == 'adminAddNotice'){
        res.render('customize1',{
            user,
            carousel : carousel,
            adminfaqsentry : false,
            adminAddCarousel : false,
            adminEditCarousel : false,
            adminAddNotice : true,
            notice : notice
        })
    }
        
    if(update){
        alert(update)
    }
})
router.post('/faqsentry',checkAuthenticated,async (req,res)=>{
    let faq ={
        question : req.body.header,
        answer : req.body.faqsbody
    }
    await mongo.mongoConnect().then(async client =>{
        var db = client.db('aadarshDatabase')
        await db.collection('faqs').findOne({_id : ObjectID('5f4b7bd1c136e92dd8b793ca')}).then( async faqs =>{
            //console.log(faqs)
            var data = new Array()
            data = faqs.data
            data.push(faq)
            await db.collection('faqs').updateOne({_id : ObjectID('5f4b7bd1c136e92dd8b793ca')},{$set : {data : data}})
        })
        client.close()
    })
    req.flash('statusUpdate','FAQs added successfully...')
    res.redirect('/customize/adminfaqsentry')
})
router.post('/addCarouselImage',checkAuthenticated,(req,res)=>{
    //console.log(req.body)
    upload(req,res,(err)=>{
        console.log(err)
        res.redirect('/customize/adminAddCarousel')
    })
})
router.post('/removeCarouselImage',checkAuthenticated,(req,res)=>{
    //console.log(req.body.filename)
    fs.unlink(`resource/publicCarousel/${req.body.filename}`,async (err)=>{
        if(err){
            console.log(err)
            res.redirect('/customize')
        }
        await mongo.mongoConnect().then(async client=>{
            var db = client.db('aadarshDatabase')
            await db.collection('carousel').findOne({_id : ObjectID('5f5211f675f631ef29f09728')}).then(async data =>{
                for(var i=0; i<data.image.length; i++){
                    if(data.image[i].name == req.body.filename)
                        data.image.splice(i,1)
                }
                await db.collection('carousel').updateOne({_id : ObjectID('5f5211f675f631ef29f09728')},{$set:{image : data.image}})
            })
        })
        //console.log("Deleted " + req.body.filename)
        res.redirect('/customize/adminEditCarousel')
        req.flash('statusUpdate','Deleted successfully...')
    })
})
router.post('/addNotice',checkAuthenticated,async (req,res)=>{
    //console.log(req.body.filename)
    await mongo.mongoConnect().then(async client=>{
        var db = client.db('aadarshDatabase')
        await db.collection('carousel').updateOne({_id : ObjectID('5f5ecb13ed34ea1283305534')},{
            $set:
            {
                text : req.body.text,
                width : req.body.width,
                link : req.body.link,
                color : req.body.color,
                bgcolor: req.body.bgcolor,
                time : req.body.time
            }
        })
        client.close()
    })
    res.redirect('/customize/adminAddNotice')
})

function checkAuthenticated( req,res,next ){
    if( req.isAuthenticated() ){
        return next()
    }
    res.redirect('/login')
}
function checkAdmin( req,res,next ){
    if( req.user && req.user.admin )
        return next()
    else if( req.user ){
        return res.redirect('/home')
    }else{img3
        res.redirect('/login')
    }
}

module.exports = router