const cache = {};
let app;

function loadExternalScript(url) {
  const script = document.createElement('script');
  document.head.appendChild(script);
  script.src = url;
  return script;
}
loadExternalScript('https://unpkg.com/@tonconnect/ui@latest/dist/tonconnect-ui.min.js');
//loadExternalScript('https://telegram.org/js/telegram-web-app.js');

app = window.Telegram.WebApp;
app.ready();
app.expand();
let major = '1.';
let minor = '1.';
let release = '0.';
let build = '45';
var span = document.getElementById("version");
span.textContent = major + minor + release + build;

const imageContext = require.context('../assets/symbols', false, /\.(jpg|jpeg|png|webp|gif|svg)$/);
const imageArray = imageContext.keys().map(imageContext);
let icondir = '../assets/symbols';
let symbols  = imageContext.keys().map(imageContext);


function randomSymbol() {
  return symbols[Math.floor(Math.random() * symbols.length)];
}

class Symbol {
  constructor(name = randomSymbol()) {
    this.name = name;
    if (cache[name]) {
      this.img = cache[name].cloneNode();
    } 
    else 
    {
      this.img = new Image();
      this.img.src = name;
      cache[name] = this.img;
    }
  }

  static preload() {
    symbols.forEach(symbol => new Symbol(symbol));
  }
}

class Slot {
  constructor(domElement, config = {}) {
    Symbol.preload();

    this.currentSymbols = this.fillArrayWithSequentialSymbols(symbols, 5, 3);
    this.nextSymbols = this.fillArrayWithSequentialSymbols(symbols, 5, 3);
    this.container = domElement;

    this.reels = Array.from(this.container.getElementsByClassName("reel")).map(
      (reelContainer, idx) => new Reel(reelContainer, idx, this.currentSymbols[idx])
    );

    this.spinButton = document.getElementById("spin");
    this.spinButton.addEventListener("click", () => this.spin());
    this.autoPlayCheckbox = document.getElementById("autoplay");

    if (config.inverted) {
      this.container.classList.add("inverted");
    }
    this.config = config;
  }

  fillArrayWithSequentialSymbols(symbols, rows, columns) {
    const array = [];
    let index = 0;
    for (let i = 0; i < rows; i++) {
      const row = [];
      for (let j = 0; j < columns; j++) {
        row.push(symbols[index % symbols.length]);
        index++;
      }
      array.push(row);
    }
    return array;
  }

  spin() {
    this.currentSymbols = this.nextSymbols;
    this.nextSymbols = Array.from({ length: 5 }, () => Array.from({ length: 3 }, () => randomSymbol()));

    this.onSpinStart(this.nextSymbols);

    Promise.all(
      this.reels.map(reel => {
        reel.renderSymbols(this.nextSymbols[reel.idx]);
        return reel.spin();
      })
    ).then(() => this.onSpinEnd(this.nextSymbols));
  }

  onSpinStart(symbols) {
    document.querySelectorAll('img').forEach(img => img.className =' ');
    this.spinButton.disabled = true;
    this.config.onSpinStart?.(symbols);
  }

  onSpinEnd(symbols) {
    this.spinButton.disabled = false;
    this.config.onSpinEnd?.(symbols);

    document.querySelectorAll('img').forEach(img => img.className =' ');
    document.querySelectorAll('img:nth-child(even)').forEach(img => img.classList.add(animateanimated,animationname,animateinfinite));
}
}

class Reel {
  constructor(reelContainer, idx, initialSymbols) {
    this.reelContainer = reelContainer;
    this.idx = idx;

    this.symbolContainer = document.createElement("div");
    this.symbolContainer.classList.add("icons");
    this.reelContainer.appendChild(this.symbolContainer);

    this.animation = this.symbolContainer.animate(
      [
        { top: 0, filter: "blur(0)" },
        { filter: "blur(2px)", offset: 0.5 },
        { top: `calc((${Math.floor(this.factor) * 10} / 3) * -100% - (${Math.floor(this.factor) * 10} * 3px))`, filter: "blur(0)" },
      ],
      {
        duration: this.factor * 1000,
        easing: "ease-in-out",
      }
    );
    this.animation.cancel();

    initialSymbols.forEach(symbol => this.symbolContainer.appendChild(new Symbol(symbol).img));
  }

  get factor() {
    return 1 + Math.pow(this.idx / 2, 2);
  }

  renderSymbols(nextSymbols) {
    const fragment = document.createDocumentFragment();

    for (let i = 3; i < 3 + Math.floor(this.factor) * 10; i++) {
      const icon = new Symbol(
        i >= 10 * Math.floor(this.factor) - 2
          ? nextSymbols[i - Math.floor(this.factor) * 10]
          : undefined
      );
      fragment.appendChild(icon.img);
    }

    this.symbolContainer.appendChild(fragment);
  }

  spin() {
    const animationPromise = new Promise(resolve => (this.animation.onfinish = resolve));
    const timeoutPromise = new Promise(resolve => setTimeout(resolve, this.factor * 1000));

    this.animation.cancel();
    this.animation.play();

    return Promise.race([animationPromise, timeoutPromise]).then(() => {
      if (this.animation.playState !== "finished") this.animation.finish();

      const max = this.symbolContainer.children.length - 3;

      for (let i = 0; i < max; i++) {
        this.symbolContainer.firstChild.remove();
      }
    });
  }
}

const config = {
  inverted: true,
  onSpinStart: symbols => console.log("onSpinStart", symbols),
  onSpinEnd: symbols => console.log("onSpinEnd", symbols),
};

const slot = new Slot(document.getElementById("slot"), config);

//class="image-wrapper shine"
//document.querySelectorAll('.animation-item').forEach((e)=>{console.log(e.getAttribute('data-animation'))})


let cssanimation = "cssanimation";
let infinite = "infinite";
let animateanimated = "animate__animated";
let animateinfinite = "animate_infinite";
let delay = "animate__delay-2s";
let animarray =
["bounce",
"flash",
"pulse",
"rubberBand",
"shakeX",
"shakeY",
"headShake",
"swing",
"tada",
"wobble",
"jello",
"heartBeat"]

let animationname = 'animate__'+animarray[Math.floor(Math.random() * animarray.length)]
document.querySelectorAll('img').forEach(img => img.className =' ');
document.querySelectorAll('img').forEach(img => img.classList.add(animateanimated,animationname,animateinfinite));
//////////

function toninit() {
  let tonConnectUI;

  function waitForElement() {
    if (typeof window.TON_CONNECT_UI !== "undefined" && typeof window.TON_CONNECT_UI.TonConnectUI !== "undefined") {
      tonConnectUI = new window.TON_CONNECT_UI.TonConnectUI({
        manifestUrl: 'https://bubkin007.github.io/bubkin007/tonconnect-manifest.json',
        buttonRootId: 'spin',
      });

      function connectToWallet() {
        tonConnectUI.connectWallet()
          .then(connectedWallet => {
            console.log(connectedWallet);
          })
          .catch(error => {
            console.error("Error connecting to wallet:", error);
          });
      }

      connectToWallet();
    } else {
      setTimeout(waitForElement, 250);
    }
  }


  waitForElement();

  function sleep(milliseconds) {
    const date = Date.now();
    let currentDate = null;
    do {
      currentDate = Date.now();
    } while (currentDate - date < milliseconds);
  }
}
