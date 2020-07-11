const mongodb = require('mongodb')
const MongoClient = mongodb.MongoClient

// 'mongodb://localhost:27017'
// 'mongodb+srv://sauravadmin:Saurav9113@aadarshstocksdatabase.kdbyg.mongodb.net/<dbname>?retryWrites=true&w=majority'
const connectionURL = 'mongodb+srv://sauravadmin:Saurav9113@aadarshstocksdatabase.kdbyg.mongodb.net/<dbname>?retryWrites=true&w=majority'
const databaseName = 'aadarshDatabase'

const writeFunc = function( fileType,data ){
    MongoClient.connect( connectionURL, {useNewUrlParser : true, useUnifiedTopology : true}, (err,client) => {
        if( err )
            return console.log(err)
        
        const db = client.db( databaseName )
        db.collection( fileType ).insertOne( data )
    })
}

const findUsers = function(userType,username,password){
    
    MongoClient.connect( connectionURL, {useUnifiedTopology : true, useNewUrlParser : true}, (err,client)=>{
        if(err)
            return console.log(err)

        const db = client.db( databaseName )
        if(userType == 1)
        {
            db.collection('users').find({email : username, password: password}).toArray((err,data)=>{
                if(err)
                    return console.log(err)
                
                // Call the login function here
                console.log(data)
            })
        }
        
        else if( userType == 2 )
            db.collection('admin').find({username : username, password: password}).toArray((err,data)=>{
                if(err)
                    return console.log(err)
                 
                // Call the login function here
                console.log(data)
            })
    } )
}

const mongoConnect = function(){
        return MongoClient.connect( connectionURL, {useUnifiedTopology : true, useNewUrlParser : true})
}


module.exports = {
    writeFunc : writeFunc,
    findUsers : findUsers,
    mongoConnect : mongoConnect
}