const localStrategy = require('passport-local').Strategy
const mongo = require('./mongo')
const { ObjectID, ObjectId } = require('mongodb')
const { use } = require('./registerData')
const algo = require('./algo')
const { referralIDassign } = require('./mongo')

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
            if(!newUser.referralID)
            {
                algo.referralIDassign(newUser._id) 
            }
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
        var newUser
        await mongo.mongoConnect().then(async client =>{
            var db = client.db('aadarshDatabase')
            await db.collection('users').findOne({_id : ObjectId(id)}).then( async user =>{
                if(user){
                    newUser = user
                    if(newUser.access == "User")
                    {
                        newUser.planExpiry = new Date(newUser.planExpiry)
                        var date2 = new Date()
                        newUser.planExpiry = algo.timeDiff(newUser.planExpiry, date2)
                        if(newUser.planExpiry < 0){
                            newUser.status = false
                            newUser.planExpiry = "Plan expired"
                            await db.collection('users').updateOne({_id : ObjectId(id)},{$set:{status : false}})
                        }else{
                            newUser.planExpiry = newUser.planExpiry + " days left"
                        }
                            
                    }
                    else if(newUser.access == "Administrator")
                    {
                        newUser.status = true
                    }
                }
                    
            }).catch(error => console.log(error))
        })
        return done(null, newUser)
    })
}

module.exports = initialize