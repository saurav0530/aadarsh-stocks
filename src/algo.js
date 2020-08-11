const mongo = require('./mongo')
const { ObjectId } = require('mongodb')
var mon31 = [1,3,5,7,8,10,12]

function timeInt(req){
    var user = req.user
    var loggedDate = new Date(user.payment[user.payment.length-1].TXNDATE)
    var payDate = new Date(user.payment[user.payment.length-1].TXNDATE)
    var loggedYear = loggedDate.getFullYear()
    var loggedMonth = loggedDate.getMonth()
    if( loggedMonth == 11 ){
        loggedMonth = 1
        loggedYear += 1
    }else if( loggedMonth < 11 ){
        loggedMonth +=1
    }
    loggedDate.setMonth(loggedMonth) 
    loggedDate.setFullYear(loggedYear)  
    var nowDate = new Date()
    console.log(nowDate , loggedDate)
    mongo.mongoConnect().then(client =>{
        var db = client.db('aadarshDatabase')
        var id = user._id
        if((nowDate <= loggedDate) && (nowDate >= payDate)){
            user.status = true
            db.collection('users').updateOne({_id : ObjectId(id)},{$set : {status : true}})
            console.log('true')
        }
        else{ 
            user.status = false
            console.log('false')
            db.collection('users').updateOne({_id : ObjectId(id)},{$set : {status : false}})
    }}).catch(err => console.log(err))
}

var timeDiff = function (a,b){
    var utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate())
    var utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate())
    var diff = utc1 - utc2
    var days = diff/(24*3600*1000)
    return (days+1) 
}

module.exports = {
    timeInt : timeInt,
    timeDiff : timeDiff
}