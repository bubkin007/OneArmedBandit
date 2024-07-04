let tgWebApp = window.Telegram.WebApp;
tgWebApp.expand();
let message = "SPIN?"
function callbackTester(callback) {
    if(callback){
        spin.click();
    }
  }
tgWebApp.showConfirm(message,callbackTester)