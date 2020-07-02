import * as serverData from '../data'
export var loginFunction = function() {
    if(document.querySelector('.form')!= null){
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
    
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// *****************************************   CHILD-FUNCTIONS   *********************************************//

// 1. Clearing input fields

var clearStockInputField = function (){
    if( document.querySelector('#stock-input-stockName').value != undefined )
        document.querySelector('#stock-input-stockName').value = ''
    if( document.querySelector('#stock-input-stopLoss').value != undefined )
        document.querySelector('#stock-input-stopLoss').value = ''
    if( document.querySelector('#stock-input-target').value != undefined )
        document.querySelector('#stock-input-target').value = ''
    if( document.querySelector('#stock-input-buyAbove').value != undefined )
        document.querySelector('#stock-input-buyAbove').value = ''
    if( document.querySelector('#stock-input-currentPrice').value != undefined )
        document.querySelector('#stock-input-currentPrice').value = ''
    if( document.querySelector('#stock-input-recentHigh').value != undefined )
        document.querySelector('#stock-input-recentHigh').value = ''
    if( document.querySelector('#stock-input-recentLow').value != undefined )    
        document.querySelector('#stock-input-recentLow').value = ''
    if( document.querySelector('#stock-input-remarks').value != undefined )
        document.querySelector('#stock-input-remarks').value = ''
}

// 2. Input data to be displayed in a row
var printInputData = function ( temp,length ){
    var html = 
                `
                <h8 class = "stock-display-items row${length}">${temp.stockName}</h8>
                <h8 class = "stock-display-items row${length}">${temp.buyAbove}</h8>
                <h8 class = "stock-display-items row${length}">${temp.target}</h8>
                <h8 class = "stock-display-items row${length}">${temp.stopLoss}</h8>
                <h8 class = "stock-display-items row${length}">${temp.currentPrice}</h8>
                <h8 class = "stock-display-items row${length}">${temp.recentHigh}</h8>
                <h8 class = "stock-display-items row${length}">${temp.recentLow}</h8>
                <h8 class = "stock-display-items row${length}">${temp.remarks}<input type="button" value="X" style="margin-right : 0;visibility : visible ;" class = "cut row${length}"></h8>
                `
                document.querySelector( '.stock-display' ).insertAdjacentHTML("beforeend",html)
}
// 3. Taking each row input from admin in daily stock data feed
var stockDataInput = function( id ){
    var stockDate,temp
           
    temp = {
        id : id,
        stockDate : document.querySelector('#stock-entry-date').value,
        stockName : document.querySelector( '#stock-input-stockName ').value,
        buyAbove : document.querySelector( '#stock-input-buyAbove ').value,
        target : document.querySelector( '#stock-input-target ').value,
        stopLoss : document.querySelector( '#stock-input-stopLoss ').value,
        currentPrice :document.querySelector( '#stock-input-currentPrice ').value,
        recentHigh : document.querySelector( '#stock-input-recentHigh ').value,
        recentLow : document.querySelector( '#stock-input-recentLow ').value,
        remarks : document.querySelector( '#stock-input-remarks ').value
    }
    printInputData(temp,temp.id)
    clearStockInputField()
    return temp
}  
// 4. Making Data Input Button in Admin login function
var dataInputPlatform = function() {
    var html = 
    `
    <br><br><br><br>
    <div class = 'stock-entry-date'>
        <h4>Select date corresponding to stock data entry : </h4>
        <input type="date" name="stock-entry-date" id="stock-entry-date">
    </div>
    <br><br>
    <div class = "stock-display-input" >
        <input type="search"  id="stock-input-stockName" placeholder = " Stock-name ">
        <input type="search"  id="stock-input-buyAbove" placeholder = " Buy above ">
        <input type="search"  id="stock-input-target" placeholder = " Target ">
        <input type="search"  id="stock-input-stopLoss" placeholder = " Stop Loss ">
        <input type="search"  id="stock-input-currentPrice" placeholder = " Current Price ">
        <input type="search"  id="stock-input-recentHigh" placeholder = " Recent High ">
        <input type="search"  id="stock-input-recentLow" placeholder = " Recent Low ">
        <input type="search"  id="stock-input-remarks" placeholder = " Remarks ">
    </div>
    <br>
    <button class = "add-row" >Add stock</button>
    <br><br>
    <div class = "stock-display">
        
        
        <strong class = "stock-display-headers">Stock Name</strong>
        <strong class = "stock-display-headers">Buy above</strong>
        <strong class = "stock-display-headers">Target</strong>
        <strong class = "stock-display-headers">Stop Loss</strong>
        <strong class = "stock-display-headers">Current Price</strong>
        <strong class = "stock-display-headers">Recent High</strong>
        <strong class = "stock-display-headers">Recent Low</strong>
        <strong class = "stock-display-headers">Remarks</strong>
    </div><br><br>

    <input type = "text" class = "para1-stock" placeholder="Para 1(required)" >
    <input type = "text" class = "para2-stock" placeholder="Para 2(required)" >

    <br><br><button class = "add-to-database" >Add to Database</button><br><br>
    `
    
    document.querySelector( '.main-content' ).innerHTML = ' '
    document.querySelector( '.main-content' ).insertAdjacentHTML( 'afterbegin',html )
}
// 5. Stock display function
var stockDisplayFunction = function( res ){
    var para = document.querySelector( '.stock-display-para' )
    var stockdisplay = document.querySelector( '.stock-display' )
    if( para != null && stockdisplay!=null )
    {
        para.parentNode.removeChild( para )
        stockdisplay.parentNode.removeChild( stockdisplay )
    }
    if( res.length != 0 ){
    var html = 
    `<br><br><br>
    <div class = "stock-display-para">
        <strong style="text-decoration: underline;font-size : 1.2vw;text-shadow: 0.1vw 0.1vh 01vh aqua;">EDITOR'S NOTE :</strong>
        <br><br><p class = "para1" style="text-align: justify;">1. ${res[0].para1}</p><br><br>
        <p class = "para1" style="text-align: justify;">2. ${res[0].para2}<p><br><br>
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
    </div>
    `
    document.querySelector( '.main-content' ).insertAdjacentHTML( "beforeend",html)

    
        var test = document.querySelector( '.stock-display-items' )
        while(test){
            if(test != undefined)
                test.parentNode.removeChild(test)
            var test = document.querySelector( '.stock-display-items' )
        }
        
        for( var i=0;i<res.length;i++ )
            for( var j=0;j<res[i].stockData.length;j++)
                document.querySelector( '.stock-display' ).insertAdjacentHTML('beforeend', `
                <h8 class = "stock-display-items">${res[i].stockData[j].stockName}</h8>
                <h8 class = "stock-display-items">${res[i].stockData[j].buyAbove}</h8>
                <h8 class = "stock-display-items">${res[i].stockData[j].target}</h8>
                <h8 class = "stock-display-items">${res[i].stockData[j].stopLoss}</h8>
                <h8 class = "stock-display-items">${res[i].stockData[j].currentPrice}</h8>
                <h8 class = "stock-display-items">${res[i].stockData[j].recentHigh}</h8>
                <h8 class = "stock-display-items">${res[i].stockData[j].recentLow}</h8>
                <h8 class = "stock-display-items">${res[i].stockData[j].remarks}</h8>
                `)
    }
}

// 6. Making delete icon work
var deleteButton = function( id,tempData ){
    var selector = document.querySelector(`.row${id}`)
    while( selector != undefined ){
            selector.parentNode.removeChild(selector)
            selector = document.querySelector( `.row${id}` )
    }
    for( var i=0;i<tempData.length;i++){
        if( tempData[i].id == id )
            return i
    }
}
// 7. Adding new stock to database
var addStockDataToDatabase = function ( changedDate ){
   
}
// 8. Update the existing data
var updateExistingStock = function(){

}
// 9. Check whether to update or add stock
var checkUpdateorAddStock = function( entryDate ){
    var tempServerData = serverData.stocksData
    if( tempServerData.length == 0 )
        return -10
    else{
        var stocksDataLength = tempServerData.length,test = 0
        for( var i=0; i<stocksDataLength ; i++ ){
            if( entryDate == tempServerData[i].stockDate ){
                test++
                return {
                    index : i
                }
            }
        }
        if(test == 0)
            return -10
    }
    

}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//1. Admin Login Function

export var adminLoginProcess = function ( data ){
    var el = document.querySelector( '.error' )
    if(el)
        el.parentElement.removeChild(el);

    var html = 
    `<select name="loginChoice" id="loginChoice">
    <option value="1">Welcome, ${data.name}</option>
    <option value="2">Stock Data</option>
    <option value="3">Data Input</option>
    <option value="4">Account Details</option>
    <option value="5"><strong class="logout">Logout<strong></option>`
    document.querySelector( '.main-content' ).innerHTML = ' '
    document.querySelector( '.authentication' ).innerHTML = ' '
    document.querySelector( '.authentication' ).insertAdjacentHTML('beforeend',html)      
    
    document.querySelector( '.main-content' ).innerHTML = ' '
            var html2 =
                `<br><br><div class = 'stock-view-date'>
                    <h4>Select date for viewing past stock suggestions : </h4>
                    <input type="date" name="stock-view-date" id="stock-view-date">
                </div>
                `
            document.querySelector( '.main-content' ).insertAdjacentHTML( "afterbegin",html2)

            document.querySelector( '#stock-view-date' ).addEventListener( 'change', ()=>{
                var res = serverData.stocksData.filter( data => (data.stockDate === document.querySelector('#stock-view-date').value) )
                    stockDisplayFunction( res )
            })

    document.querySelector( '#loginChoice' ).addEventListener('change', () => {
        var choice = document.querySelector( '#loginChoice' ).value
        if( choice == 2 ){
            document.querySelector( '.main-content' ).innerHTML = ' '
            var html2 =
                `<br><br><div class = 'stock-view-date'>
                    <h4>Select date for viewing past stock suggestions : </h4>
                    <input type="date" name="stock-view-date" id="stock-view-date">
                </div>
                `
            document.querySelector( '.main-content' ).insertAdjacentHTML( "afterbegin",html2)

            document.querySelector( '#stock-view-date' ).addEventListener( 'change', ()=>{
                var res = serverData.stocksData.filter( data => (data.stockDate === document.querySelector('#stock-view-date').value) )
                console.log(res)    
                stockDisplayFunction( res )
            })



        }
        else if( choice == 3){
            dataInputPlatform()
            document.querySelector( '#stock-entry-date' ).addEventListener( 'change' ,()=>{
                var changedDate = document.querySelector('#stock-entry-date').value
                var updateChoice = checkUpdateorAddStock( changedDate ),id
                if( updateChoice == -10 )
                {
                    var newStockData = []
                    // Click and keypress for adding row 
                    document.querySelector('.add-row').addEventListener('click', () =>{
                        if(newStockData.length == 0)
                            id = 0;
                        else
                            id = newStockData[newStockData.length - 1].id
                        var tempRow = stockDataInput(id+1)
                        newStockData.push(tempRow)
                    })
                    window.addEventListener('keypress', (event) =>{
                        if(event.keyCode == 13 || event.which == 13){
                            if(newStockData.length == 0)
                                id = 0;
                            else
                                id = newStockData[newStockData.length - 1].id
                            var tempRow = stockDataInput(id+1)
                            newStockData.push(tempRow)
                        }
                        
                    })
                    // Delete button
                    document.querySelector('.stock-display').addEventListener('click', (event)=>{
                        var delID = event.target.className.split(' ')[1].split('w')[1]
                        var eleIndex = deleteButton( delID,newStockData )
                        newStockData.splice(eleIndex,1)
                        console.log(newStockData) 
                    })
                    // Click for add data to database
                    document.querySelector('.add-to-database').addEventListener('click', ()=>{
                        var tempStockData = {
                            stockDate : changedDate,
                            para1 : document.querySelector('.para1-stock').value,
                            para2 : document.querySelector('.para2-stock').value,
                            stockData : newStockData
                        }
                        serverData.stocksData.push(tempStockData)
                        console.log(serverData.stocksData)
                        document.querySelector( '.main-content' ).innerHTML= ' '
                        document.querySelector( '.main-content' ).insertAdjacentHTML('afterbegin',`<strong class = "data-added-successfully">Stock Data added successfully !<strong>`)
                    })
                }
                else{
                    var newStockData = serverData.stocksData[updateChoice.index].stockData
                    for( var i=0;i<newStockData.length;i++){
                        printInputData( newStockData[i],newStockData[i].id )
                    }
                    // Click and keypress for adding row 
                    document.querySelector('.add-row').addEventListener('click', () =>{
                        if(newStockData.length == 0)
                            id = 0;
                        else
                            id = newStockData[newStockData.length - 1].id
                        var tempRow = stockDataInput(id+1)
                        newStockData.push(tempRow)
                    })
                    window.addEventListener('keypress', (event) =>{
                        if(event.keyCode == 13 || event.which == 13){
                            if(newStockData.length == 0)
                                id = 0;
                            else
                                id = newStockData[newStockData.length - 1].id
                            var tempRow = stockDataInput(id+1)
                            newStockData.push(tempRow)
                        }
                        
                    })
                    // Delete button
                    document.querySelector('.stock-display').addEventListener('click', (event)=>{
                        var delID = event.target.className.split(' ')[1].split('w')[1]
                        var eleIndex = deleteButton( delID,newStockData )
                        newStockData.splice(eleIndex,1)
                        console.log(newStockData) 
                    })
                    // Click for add data to database
                    document.querySelector('.add-to-database').addEventListener('click', ()=>{
                        var tempStockData = {
                            stockDate : changedDate,
                            para1 : document.querySelector('.para1-stock').value,
                            para2 : document.querySelector('.para2-stock').value,
                            stockData : newStockData
                        }
                        serverData.stocksData[updateChoice.index] = tempStockData
                        console.log(serverData.stocksData)
                        document.querySelector( '.main-content' ).innerHTML= ' '
                        document.querySelector( '.main-content' ).insertAdjacentHTML('afterbegin',`<strong class = "data-added-successfully">Stock Data added successfully !<strong>`)
                    })
                }
               
            })

            
        }
        else if( choice == 4 )
        {
            document.querySelector( '.main-content' ).innerHTML = ' '
            var html =
            `<br><br><br><br><br>
            <h6 class ="account-details-header">Account Details<h6>
            <br><br><br><br><br><br><br><br>
            <div class = "account-details">
            <strong> Name </strong><strong>: ${data.name} </strong>
            <strong> Mobile </strong><strong>: ${data.mobile}</strong>
            <strong> E-mail </strong><strong>: ${data.email}</strong>
            <strong> Password </strong><strong>: ${data.password}</strong>
            <strong> User-Type </strong><strong>: Administrator</strong>
            </div>
            ` 
            document.querySelector( '.main-content' ).insertAdjacentHTML( 'beforeend',html )
        }
        else if( choice == 5 )
        {
            localStorage.clear()
            window.location.replace(window.location.origin)
        }
        
    })
    
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//2. User Login function

export var userLoginProcess = function ( data ){
    var el = document.querySelector( '.error' )
    if(el)
        el.parentElement.removeChild(el);
    console.log(" Login successfull ! ")

    var html = 
    `<select name="loginChoice" id="loginChoice">
    <option value="1">Welcome, ${data.name}</option>
    <option value="2">Stocks Suggestions</option>
    <option value="3">Account Details</option>
    <option value="4"><strong class="logout">Logout<strong></option>`
    document.querySelector( '.main-content' ).innerHTML = ' '
    document.querySelector( '.authentication' ).innerHTML = ' '
    document.querySelector( '.authentication' ).insertAdjacentHTML('beforeend',html)      
    
    document.querySelector( '.main-content' ).innerHTML = ' '
            var html2 =
                `<div class = 'stock-view-date'>
                    <h4>Select date for viewing past stock suggestions : </h4>
                    <input type="date" name="stock-view-date" id="stock-view-date">
                </div>
                `
            document.querySelector( '.main-content' ).insertAdjacentHTML( "afterbegin",html2)

            document.querySelector( '#stock-view-date' ).addEventListener( 'change', ()=>{
                var res = serverData.stocksData.filter( data => (data.stockDate === document.querySelector('#stock-view-date').value) )
                    stockDisplayFunction( res )
            })

    document.querySelector( '#loginChoice' ).addEventListener('change', () => {
        var choice = document.querySelector( '#loginChoice' ).value
        console.log(choice)
        if( choice == 2 ){
            document.querySelector( '.main-content' ).innerHTML = ' '
            var html2 =
                `<div class = 'stock-view-date'>
                    <h4>Select date for viewing past stock suggestions : </h4>
                    <input type="date" name="stock-view-date" id="stock-view-date">
                </div>
                `
            document.querySelector( '.main-content' ).insertAdjacentHTML( "afterbegin",html2)

            document.querySelector( '#stock-view-date' ).addEventListener( 'change', ()=>{
                var res = serverData.stocksData.filter( data => (data.stockDate === document.querySelector('#stock-view-date').value) )
                    stockDisplayFunction( res )
            })
        }
        else if( choice == 3 ){
            document.querySelector( '.main-content' ).innerHTML = ' '
            var html =
            `<br><br><br><br><br>
            <h6 class ="account-details-header">Account Details<h6>
            <br><br><br><br><br><br><br><br>
            <div class = "account-details">
            <strong> Name </strong><strong>: ${data.name} </strong>
            <strong> Mobile </strong><strong>: ${data.mobile}</strong>
            <strong> E-mail </strong><strong>: ${data.email}</strong>
            <strong> Password </strong><strong>: ${data.password}</strong>
            <strong> User-Type </strong><strong>: Data-user</strong>
            </div>
            ` 
            document.querySelector( '.main-content' ).insertAdjacentHTML( 'beforeend',html )
        }
        if( choice == 4 )
        {
            localStorage.clear()
            window.location.replace(window.location.origin)
        }
    
    })
}
