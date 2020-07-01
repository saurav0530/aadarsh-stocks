import * as register from './hbsjs/registerData'
import * as serverData from './data'
import * as adminLoginData from './hbsjs/login'
////////////////////////////////////////////////////////////////////////////////////////////////////////////////



////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//Register Function
var regFunc = function (){
    //1. Making register button functionable
    var regData = new Array()
    regData.push( register.submitRegisterForm() );

    //2. 
        //2.1. Retrieve data from main-server to a variable named serverUserData
    
    serverData.userList = new Array()
    if( JSON.parse(localStorage.getItem( 'userData' ))!= null )
        serverData.userList = JSON.parse(localStorage.getItem( 'userData' ))
    serverData.userList.push( regData) 
    //3. Storing regData to client-side Javascript
    localStorage.setItem( 'userData', JSON.stringify(serverData.userList) )
}
if(document.location.pathname === "/register"){
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////
    ///////////////////                             Click login                            ////////////////////////
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////
    document.querySelector('.register-submit').addEventListener('click',( event ) =>{
    regFunc()
    })
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////
    ///////////////////                          Keypress Register                         ////////////////////////
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////
    document.addEventListener('keypress',( event ) =>{
        if( event.keyCode == 13 || event.which == 13 )
            regFunc()
    })
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//Login Function
var loginFunc = function (){
    // console.log( serverData.adminList )
    return adminLoginData.loginFunction()
}

if(document.location.pathname === "/login"){
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////
    ///////////////////                             Click login                            ////////////////////////
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////
document.querySelector( '.loginSubmit').addEventListener('click',() => {
        //1. Get login input by user
        var loginDataInput = loginFunc()
        // console.log(loginDataInput)
        if( loginDataInput != undefined )
        {
            var loginStatus = 0,databaseUserData,adminCheck,userCheck

            //2. Check the database
            if( loginDataInput.userType === "1" )
            {
                databaseUserData = JSON.parse(localStorage.getItem( 'userData' ))
                console.log(databaseUserData)
                userCheck = databaseUserData.filter( (data) => (loginDataInput.username === data[0].email)&&(loginDataInput.userPassword === data[0].password))
                    loginStatus++
                if( loginStatus === 1 )
                {
                    adminLoginData.userLoginProcess( userCheck[0][0] )
                }
            }
            else if( loginDataInput.userType === "2" ){
                // console.log(2)
                databaseUserData = serverData.adminList
                adminCheck = databaseUserData.filter( (data) =>  (loginDataInput.username === data.email)&&(loginDataInput.userPassword === data.password))
                if( adminCheck[0] !== undefined )
                    loginStatus++
                if( loginStatus === 1 )
                {
                    adminLoginData.adminLoginProcess( adminCheck[0] )
                }
            }

            //3. Check loginStatus
            if(loginStatus === 0)
            {
                var el = document.querySelector( '.error' )
                if(el)
                    el.parentElement.removeChild(el);
                document.querySelector( '.main-content' ).insertAdjacentHTML('beforeend',`<p class = "error" style = "color : red;padding-left:44.5%;">Invalid email or password! </p>`)
            
            }
        }
})
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////
    ///////////////////                          Keypress login                            ////////////////////////
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////
    document.addEventListener('keypress',(event) => {
        if( event.keyCode == 13 || event.which == 13 ){
            //1. Get login input by user
            var loginDataInput = loginFunc()
            // console.log(loginDataInput)
            if( loginDataInput != undefined )
            {
                var loginStatus = 0,databaseUserData,adminCheck,userCheck

                //2. Check the database
                if( loginDataInput.userType === "1" )
                {
                    databaseUserData = JSON.parse(localStorage.getItem( 'userData' ))
                    console.log(databaseUserData)
                    userCheck = databaseUserData.filter( (data) => (loginDataInput.username === data[0].email)&&(loginDataInput.userPassword === data[0].password))
                        loginStatus++
                    if( loginStatus === 1 )
                    {
                        adminLoginData.userLoginProcess( userCheck[0][0] )
                    }
                }
                else if( loginDataInput.userType === "2" ){
                    // console.log(2)
                    databaseUserData = serverData.adminList
                    adminCheck = databaseUserData.filter( (data) =>  (loginDataInput.username === data.email)&&(loginDataInput.userPassword === data.password))
                    if( adminCheck[0] !== undefined )
                        loginStatus++
                    if( loginStatus === 1 )
                    {
                        adminLoginData.adminLoginProcess( adminCheck[0] )
                    }
                }

                //3. Check loginStatus
                if(loginStatus === 0)
                {
                    var el = document.querySelector( '.error' )
                    if(el)
                        el.parentElement.removeChild(el);
                    document.querySelector( '.main-content' ).insertAdjacentHTML('beforeend',`<p class = "error" style = "color : red;padding-left:44.5%;">Invalid email or password! </p>`)
                
                }
            }
        }
    })
}
  

////////////////////////////////////////////////////////////////////////////////////////////////////////////////