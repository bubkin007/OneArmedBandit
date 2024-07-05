let app = window.Telegram.WebApp;
app.expand();
let message = "SPIN?"
function callbackTester(callback) {
    if(callback){
        spin.click();
    }
  }
  app.showConfirm(message,callbackTester)
