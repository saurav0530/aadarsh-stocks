const mongodb = require('mongodb')
const MongoClient = mongodb.MongoClient

const connectionURL = 'mongodb+srv://sauravadmin:Saurav9113@aadarshstocksdatabase.kdbyg.mongodb.net/<dbname>?retryWrites=true&w=majority'
//const connectionURL ='mongodb://localhost:27017'
const databaseName = 'aadarshDatabase'

const writeFunc = function( fileType,data ){
    MongoClient.connect( connectionURL, {useNewUrlParser : true, useUnifiedTopology : true}, (err,client) => {
        if( err )
            return console.log(err)
        
        const db = client.db( databaseName )
        db.collection( fileType ).insertOne( data )
    })
}


const mongoConnect = function(){
        return MongoClient.connect( connectionURL, {useUnifiedTopology : true, useNewUrlParser : true})
}


module.exports = {
    writeFunc : writeFunc,
    mongoConnect : mongoConnect
}


// mongoConnect().then(async client =>{
//     const db = client.db('aadarshDatabase')
//     await db.collection('users').updateMany({}, {$unset: {referral:0}}, false, true)
//     await db.collection('users').updateMany({}, {$set: {referredTo:[]}}, false, true)
// }).catch(err => console.log(err))