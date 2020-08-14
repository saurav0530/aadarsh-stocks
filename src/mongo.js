const mongodb = require('mongodb')
const MongoClient = mongodb.MongoClient
const { ObjectId } = require('mongodb')


const connectionURL = 'mongodb+srv://sauravadmin:Saurav9113@aadarshstocksdatabase.kdbyg.mongodb.net/<dbname>?retryWrites=true&w=majority'
//const connectionURL ='mongodb://localhost:27017'
const databaseName = 'aadarshDatabase'

const writeFunc = function( fileType,data ){
    MongoClient.connect( connectionURL, {useNewUrlParser : true, useUnifiedTopology : true}, (err,client) => {
        if( err )
            return console.log(err)
        
        const db = client.db( databaseName )
        db.collection( fileType ).insertOne( data ).then(dt => {
            referralIDassign(dt.insertedId)
        })
    })
}


const mongoConnect = function(){
        return MongoClient.connect( connectionURL, {useUnifiedTopology : true, useNewUrlParser : true})
}
/////////////////////////////// Algorithm for Referral Code //////////////////////////////
var referralIDassign = function( userID )
{
    mongoConnect().then(async client =>{
        const db = client.db('aadarshDatabase')
        db.collection('users').find({_id : ObjectId(userID)}).toArray( async (err,users)=>{
            console.log(users.length)
            for(var i = 0; i<users.length ;i++){
                var id = users[i]._id
                var msec = ObjectId( id ).getTimestamp().getMilliseconds().toString()
                var yr = ObjectId( id ).getTimestamp().getFullYear().toString()%1000
                var mth = ObjectId( id ).getTimestamp().getMonth().toString()
                var dt = ObjectId( id ).getTimestamp().getDate().toString()
                var min = ObjectId( id ).getTimestamp().getMinutes().toString()
                var hrs = ObjectId( id ).getTimestamp().getHours().toString()
                var sec = ObjectId( id ).getTimestamp().getSeconds().toString()
                var ref = msec + min + sec + hrs + mth + dt + yr 
                ref = Number(ref).toString(16)
                await db.collection('users').updateOne({_id : ObjectId(id) }, {$set: {referralID : ref}})
                // console.log(ref,'Updated')
            }
        })
    }).catch(err => console.log(err))
}

module.exports = {
    writeFunc : writeFunc,
    mongoConnect : mongoConnect,
    referralIDassign : referralIDassign
}

////////////////////////////// To add/drop fields ///////////////////////////////////////

// mongoConnect().then(async client =>{
//     const db = client.db('aadarshDatabase')
//     var date = new Date()
//     date.setDate(date.getDate()+8)
//     date = date.toISOString()
//     //await db.collection('users').updateMany({}, {$unset: {referral:0}}, false, true)
//     await db.collection('users').updateOne({email:'sm@grr.la'}, {$set: {
//         status : true,
//         payment : []

//     }}, false, true)
// }).catch(err => console.log(err))