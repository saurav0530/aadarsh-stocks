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
            var html = `<div class = "successInfoh4">
                        <h4>SignUp Successful</h4><br><br><br></div>
                        <div class= "signup-successful">
                        <strong>Name      </strong><strong>: ${data.name}  </strong>
                        <strong>E-mail    </strong><strong>: ${data.email} </strong>
                        <strong>Mobile    </strong><strong>: ${data.mobile}</strong></div>
                        <div class = "successInfo">
                        <br><br><br><br><p>Congrats! You have successfully registered.</p>
                        <br><br><a href = "/login">Go to login<a></div>`
            
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