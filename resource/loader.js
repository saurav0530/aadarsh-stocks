//1. Function for loader
function myfunction(content){
    if(content == 'loginChoice'){
        var val = document.getElementById(content).value
        if(val == 1 || val ==2)
            content = 'Loading user home page...'
        else if(val == 3)
            content = 'Loading stocks page...'
        else if(val == 4)
            content = 'Loading stocks entry page...'
        else if(val == 6)
            content = 'Loading subscription page...'
        else if(val == 7)
            content = 'Loading Profile...'
        else if(val == 8)
            content = 'Loading password reset portal...'
        else if(val == 9)
            content = 'Logging Out...'
    }
    var html = 
    `
    <center>
        <div class="anim">
            <div id="loader"></div><br>
            <strong>${content}</strong>
        </div>
    </center>
    `
    document.querySelector('.main-content').innerHTML = ' '
    document.querySelector('.main-content').insertAdjacentHTML('afterbegin',html)
}

//2. Function for copying referrals
function clickFunction(clas) {
    var copyText = document.getElementById(clas)
    console.log(copyText)
    copyText.select();
    copyText.setSelectionRange(0, 99999)
    document.execCommand("copy");
    alert("Copied the text: " + copyText.value);
}