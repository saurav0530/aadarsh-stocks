export var loginFunction = function() {

    var e = document.querySelector( '#choice' )
    var loginUserType = e.value
    var loginUsernameInput = document.querySelector( '.loginUsername' ).value 
    var loginPasswordInput = document.querySelector( '.loginPassword' ).value
    return {
        username : loginUsernameInput,
        userType : loginUserType,
        userPassword : loginPasswordInput
    }
}


export var adminLoginProcess = function ( data ){
    var el = document.querySelector( '.error' )
    if(el)
        el.parentElement.removeChild(el);
    console.log(" Login successfull ! ")

    var html = 
    `<select name="loginChoice" id="loginChoice">
    <option value="1">Welcome, ${data.name}</option>
    <option value="2">Data Input</option>
    <option value="3"><strong class="logout">Logout<strong></option>`
    document.querySelector( '.main-content' ).innerHTML = ' '
    document.querySelector( '.authentication' ).innerHTML = ' '
    document.querySelector( '.authentication' ).insertAdjacentHTML('beforeend',html)      
    var html2 =
    `<div class = 'stock-view-date'>
        <h4>Select date for viewing past stock suggestions : </h4>
        <input type="date" name="stock-view-date" id="stock-view-date">
    </div>
    <div class = "stock-display-para">
        <strong style="text-decoration: underline;">EDITOR'S NOTE :</strong>
        <br><br><p class = "para1" style="text-align: justify;">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quam odio saepe quo, animi dolorum neque voluptatem pariatur dicta numquam, hic assumenda cum dignissimos aut praesentium id inventore! Voluptates, nam incidunt. Lorem ipsum dolor sit amet consectetur adipisicing elit. Accusamus iure odio numquam, vero, deleniti illo ipsam harum facere similique nostrum quas. Modi debitis, provident commodi maiores iusto neque magni ipsa.</p>
        <p class = "para1" style="text-align: justify;">Lorem ipsum dolor sit amet consectetur adipisicing elit. Minima iste corrupti quia laudantium eos, nisi eligendi molestiae illum necessitatibus, exercitationem voluptatem, odio animi ea cumque ipsam mollitia voluptas consectetur libero. Lorem ipsum, dolor sit amet consectetur adipisicing elit. Magnam ullam incidunt earum sequi quo maxime qui libero ex, molestiae unde debitis, sapiente nemo quia eius fugiat voluptatem, velit minus inventore.</p><br><br>
    </div>
    <div class = "stock-display">
        <strong class = "stock-display-headers">Stock Name</strong>
        <strong class = "stock-display-headers">Buy above</strong>
        <strong class = "stock-display-headers">Target</strong>
        <strong class = "stock-display-headers">Stop Loss</strong>
        <strong class = "stock-display-headers">Current Price</strong>
        <strong class = "stock-display-headers">Recent High</strong>
        <strong class = "stock-display-headers">Recent Low</strong>
        <strong class = "stock-display-headers">Remarks</strong>

        <h8 class = "stock-display-items">Infosys</h8>
        <h8 class = "stock-display-items">500</h8>
        <h8 class = "stock-display-items">700</h8>
        <h8 class = "stock-display-items">20</h8>
        <h8 class = "stock-display-items">480</h8>
        <h8 class = "stock-display-items">900</h8>
        <h8 class = "stock-display-items">450</h8>
        <h8 class = "stock-display-items">Good</h8>
    </div>
    `
    document.querySelector( '.main-content' ).insertAdjacentHTML( "afterbegin",html2)

    document.querySelector( '#loginChoice' ).addEventListener('change', () => {
        var choice = document.querySelector( '#loginChoice' ).value
        console.log(choice)
        if( choice == 3 )
        {
            localStorage.clear()
            window.location.replace(window.location.origin)
        }
    
    })
    
}



export var userLoginProcess = function ( data ){
    var el = document.querySelector( '.error' )
    if(el)
        el.parentElement.removeChild(el);
    console.log(" Login successfull ! ")

    var html = 
    `<select name="loginChoice" id="loginChoice">
    <option value="1">Welcome, ${data.name}</option>
    <option value="2">Account Details</option>
    <option value="3"><strong class="logout">Logout<strong></option>`
    document.querySelector( '.main-content' ).innerHTML = ' '
    document.querySelector( '.authentication' ).innerHTML = ' '
    document.querySelector( '.authentication' ).insertAdjacentHTML('beforeend',html)      
    var html2 =
    `<div class = 'stock-view-date'>
        <h4>Select date for viewing past stock suggestions : </h4>
        <input type="date" name="stock-view-date" id="stock-view-date">
    </div>
    <div class = "stock-display-para">
        <strong style="text-decoration: underline;">EDITOR'S NOTE :</strong>
        <br><br><p class = "para1" style="text-align: justify;">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quam odio saepe quo, animi dolorum neque voluptatem pariatur dicta numquam, hic assumenda cum dignissimos aut praesentium id inventore! Voluptates, nam incidunt. Lorem ipsum dolor sit amet consectetur adipisicing elit. Accusamus iure odio numquam, vero, deleniti illo ipsam harum facere similique nostrum quas. Modi debitis, provident commodi maiores iusto neque magni ipsa.</p>
        <p class = "para1" style="text-align: justify;">Lorem ipsum dolor sit amet consectetur adipisicing elit. Minima iste corrupti quia laudantium eos, nisi eligendi molestiae illum necessitatibus, exercitationem voluptatem, odio animi ea cumque ipsam mollitia voluptas consectetur libero. Lorem ipsum, dolor sit amet consectetur adipisicing elit. Magnam ullam incidunt earum sequi quo maxime qui libero ex, molestiae unde debitis, sapiente nemo quia eius fugiat voluptatem, velit minus inventore.</p><br><br>
    </div>
    <div class = "stock-display">
        <strong class = "stock-display-headers">Stock Name</strong>
        <strong class = "stock-display-headers">Buy above</strong>
        <strong class = "stock-display-headers">Target</strong>
        <strong class = "stock-display-headers">Stop Loss</strong>
        <strong class = "stock-display-headers">Current Price</strong>
        <strong class = "stock-display-headers">Recent High</strong>
        <strong class = "stock-display-headers">Recent Low</strong>
        <strong class = "stock-display-headers">Remarks</strong>

        <h8 class = "stock-display-items">Infosys</h8>
        <h8 class = "stock-display-items">500</h8>
        <h8 class = "stock-display-items">700</h8>
        <h8 class = "stock-display-items">20</h8>
        <h8 class = "stock-display-items">480</h8>
        <h8 class = "stock-display-items">900</h8>
        <h8 class = "stock-display-items">450</h8>
        <h8 class = "stock-display-items">Good</h8>
    </div>
    `
    document.querySelector( '.main-content' ).insertAdjacentHTML( "afterbegin",html2)

    document.querySelector( '#loginChoice' ).addEventListener('change', () => {
        var choice = document.querySelector( '#loginChoice' ).value
        console.log(choice)
        if( choice == 3 )
        {
            localStorage.clear()
            window.location.replace(window.location.origin)
        }
    
    })
}
