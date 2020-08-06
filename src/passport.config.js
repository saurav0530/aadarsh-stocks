const localStrategy = require('passport-local').Strategy
const mongo = require('./mongo')
const { ObjectID, ObjectId } = require('mongodb')
const { use } = require('./registerData')

function initialize( passport ){
    const authenticateUser = async ( username, password, done )=>{
        var newUser
        await mongo.mongoConnect().then( async client =>{
            var db = client.db('aadarshDatabase')
            await db.collection('users').findOne({email : username,password:password}).then( user =>{
                if(user)
                    newUser = user
            }).catch(err =>{
                console.log(err)
            })
            
        })
                
        if(newUser){
            return done(null, newUser)
            
        }
        else{
            return done(null,false,{message : "Invalid email or password"})
        }
            
    }

    passport.use(new localStrategy((username,password,done) => {
        authenticateUser(username,password,done)}))
    passport.serializeUser((user, done) => {
        done(null, user._id)
    })
    passport.deserializeUser( async (id,done)=>{
        var userInfo
        await mongo.mongoConnect().then(async client =>{
            var db = client.db('aadarshDatabase')
            await db.collection('users').findOne({_id : ObjectId(id)}).then( user =>{
                if(user)
                    userInfo = user
            }).catch(error => console.log(error))
        })
        return done(null, userInfo)
    })
}

module.exports = initialize