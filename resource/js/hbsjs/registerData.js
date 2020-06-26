class registerClass {
    constructor( obj ){
        this.name = obj.name;
        this.mobile = obj.mobile;
        this.email = obj.email;
        this.password = obj.password;
    }
    addUser( data ){
        serverData.userList.push( data )
    }
}
var submitRegisterForm = function () {
   var data = {
            name : document.querySelector('.register-first-name').value + ' ' + document.querySelector('.register-last-name').value,
            mobile : document.querySelector('.register-mobile').value,
            email : document.querySelector('.register-email').value,
            password : document.querySelector('.register-password').value,
            confirmPassword : document.querySelector('.register-confirm-password').value
        }
        if( data.password === data.confirmPassword)
        {
            document.querySelector( '.main-content' ).innerHTML = ' ';
            var html = `<div class= "signup-successful"><h4>SignUp Successful</h4>
                        <br><strong>Name : ${data.name}</strong>
                        <br><strong>E-mail    : ${data.email}</strong>
                        <br><strong>Mobile    : ${data.mobile}</strong>
                        <br><br><br><p>Congrats! You have successfully registered.</p>
                        <br><br><a href = "/login">Go to login page<a></div>`
            
            document.querySelector( '.main-content' ).insertAdjacentHTML('afterbegin',html)
            return data
        }
        else
        {
            var el = document.querySelector( '.error' )
            if(el)
            el.parentElement.removeChild(el);
            document.querySelector( '.main-content' ).insertAdjacentHTML('beforeend',`<p class = "error" style = "color : red;padding-left:44.5%;">Password doesn't match! </p>`)
            
        }
}

export { registerClass,submitRegisterForm }

console.log("registerData")