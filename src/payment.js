const checksum = require('../pay/checksum/checksum')

const testmkey = 'GDZ17vhmHc&TSJGn'
const devmkey = 'eXi3Aa8J9N#1iibH'

const paytmPay = (res,amount,mobile,email) =>{
    var today = new Date()
    // var paytmParams = {
    //     "MID" : "NlRATJ20037763203941",
    //     "WEBSITE" : "WEBSTAGING",
    //     "INDUSTRY_TYPE_ID" : "Retail",
    //     "CHANNEL_ID" : "WEB",
    //     "ORDER_ID" : 'ORD'+today.getDate()+today.getSeconds()+today.getMinutes(),
    //     "CUST_ID" : 'CUS'+today.getDate()+today.getSeconds()+today.getMinutes(),
    //     "MOBILE_NO" : "7631539113",
    //     "EMAIL" : "sauravkumar0530@gmail.com",
    //     "TXN_AMOUNT" : amount,
    //     "CALLBACK_URL" : "http://localhost:4000/home/paymentStatus",
    // };
    var paytmParams = {
        "MID" : "xOoeDK18938964067707",
        "WEBSITE" : "DEFAULT",
        "INDUSTRY_TYPE_ID" : "Retail",
        "CHANNEL_ID" : "WEB",
        "ORDER_ID" : 'ORD'+today.getDate()+today.getUTCMilliseconds() +today.getMinutes(),
        "CUST_ID" : 'CUS'+today.getDate()+today.getUTCMilliseconds()+today.getMinutes(),
        "MOBILE_NO" : mobile,
        "EMAIL" : email,
        "TXN_AMOUNT" : amount,
        "CALLBACK_URL" : "http://aadarsh-stocks.herokuapp.com/home/paymentStatus",
        //"CALLBACK_URL" : "http://localhost:4000/home/paymentStatus",
    };
    checksum.genchecksum(paytmParams,devmkey,(err,checksum)=>{
        //let url = "https://securegw-stage.paytm.in/order/process"
        let url = 'https://securegw.paytm.in/order/process'
        res.writeHead(200, {'Content-Type': 'text/html'});
		res.write('<html>');
		res.write('<head>');
		res.write('<title>Merchant Checkout Page</title>');
		res.write('</head>');
		res.write('<body>');
		res.write('<center><h1>Please do not refresh this page...</h1></center>');
		res.write('<form method="post" action="' + url + '" name="paytm_form">');
		for(var x in paytmParams){
			res.write('<input type="hidden" name="' + x + '" value="' + paytmParams[x] + '">');
		}
		res.write('<input type="hidden" name="CHECKSUMHASH" value="' + checksum + '">');
		res.write('</form>');
		res.write('<script type="text/javascript">');
		res.write('document.paytm_form.submit();');
		res.write('</script>');
		res.write('</body>');
		res.write('</html>');
		res.end();
    })
}
module.exports = paytmPay
