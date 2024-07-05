export  class Slot {
  constructor(domElement, config = {}) {
    Symbol.preload();

    function fillArrayWithSequentialSymbols(symbols, rows, columns) {
      let array = [];
      let index = 0;
      for (let i = 0; i < rows; i++) {
          let row = [];
          for (let j = 0; j < columns; j++) {
              row.push(symbols[index % symbols.length]);
              index++;
          }
          array.push(row);
      }
      return array;
    }

    this.currentSymbols = fillArrayWithSequentialSymbols(Symbol.symbols, 5, 3);
    this.nextSymbols = fillArrayWithSequentialSymbols(Symbol.symbols, 5, 3);

    this.container = domElement;

    this.reels = Array.from(this.container.getElementsByClassName("reel")).map(
      (reelContainer, idx) =>
        new Reel(reelContainer, idx, this.currentSymbols[idx])
    );

    this.spinButton = document.getElementById("spin");
    this.spinButton.addEventListener("click", () => this.spin());
    this.autoPlayCheckbox = document.getElementById("autoplay");

    if (config.inverted) {
      this.container.classList.add("inverted");
    }

    this.config = config;
  }

  spin() {
    this.currentSymbols = this.nextSymbols;
    this.nextSymbols = [
      [Symbol.random(), Symbol.random(), Symbol.random()],
      [Symbol.random(), Symbol.random(), Symbol.random()],
      [Symbol.random(), Symbol.random(), Symbol.random()],
      [Symbol.random(), Symbol.random(), Symbol.random()],
      [Symbol.random(), Symbol.random(), Symbol.random()],
    ];

    this.onSpinStart(this.nextSymbols);

     Promise.all(
      this.reels.map((reel) => {
        reel.renderSymbols(this.nextSymbols[reel.idx]);
        return reel.spin();
      })
    );

    return this.onSpinEnd(this.nextSymbols);
  }

  onSpinStart(symbols) {
    this.spinButton.disabled = true;
    this.config.onSpinStart?.(symbols);
  }

  onSpinEnd(symbols) {
    this.spinButton.disabled = false;
    this.config.onSpinEnd?.(symbols);
    let app = window.Telegram.WebApp;
    app.showConfirm('No win. Spin again?', callbackTester);
  }
}

function callbackTester(callback) {
  if(callback){
    spin.click();
  }
}

const cache = {};

export class Symbol {
  constructor(name = Symbol.random()) {
    this.name = name;

    if (cache[name]) {
      this.img = cache[name].cloneNode();
    } else {
      this.img = new Image();
      this.img.src = require(`../assets/symbols/${name}.svg`);
      cache[name] = this.img;
    }
  }

  static preload() {
    Symbol.symbols.forEach((symbol) => new Symbol(symbol));
  }

  static get symbols() {
    return [
      "bincoin_isometric_logo_3d",
      "bitcoin-btc-cryptocurrency-svgrepo-com",
      "ethereum-crypto-cryptocurrency-svgrepo-com",
      "monero-crypto-cryptocurrency-coins-svgrepo-com",
      "ripple-xrp-cryptocurrency-svgrepo-com",
      "tether-crypto-cryptocurrency-svgrepo-com",
    ];
  }

  static random() {
    return this.symbols[Math.floor(Math.random() * this.symbols.length)];
  }
}

export default class Reel {
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
        {
          top: `calc((${Math.floor(this.factor) * 10} / 3) * -100% - (${
            Math.floor(this.factor) * 10
          } * 3px))`,
          filter: "blur(0)",
        },
      ],
      {
        duration: this.factor * 1000,
        easing: "ease-in-out",
      }
    );
    this.animation.cancel();

    initialSymbols.forEach((symbol) =>
      this.symbolContainer.appendChild(new Symbol(symbol).img)
    );
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
    if(!tonConnectUI.connected){
      return;
    }
    const animationPromise = new Promise(
      (resolve) => (this.animation.onfinish = resolve)
    );
    const timeoutPromise = new Promise((resolve) =>
      setTimeout(resolve, this.factor * 1000)
    );

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
  inverted: true, // true: reels spin from top to bottom; false: reels spin from bottom to top
  onSpinStart: (symbols) => {
    console.log("onSpinStart", symbols);
  },
  onSpinEnd: (symbols) => {
    console.log("onSpinEnd", symbols);
  },
};

const slot = new Slot(document.getElementById("slot"), config);

let tonConnectUI = new TON_CONNECT_UI.TonConnectUI({
  manifestUrl: 'https://bubkin007.github.io/bubkin007/tonconnect-manifest.json',
  buttonRootId: 'spin'
});

function connectToWallet() {
  const connectedWallet = tonConnectUI.connectWallet();
  // Do something with connectedWallet if needed
  console.log(connectedWallet);
}

// Call the function
connectToWallet().catch(error => {
  console.error("Error connecting to wallet:", error);
});

let app = window.Telegram.WebApp;
app.expand();

if(!tonConnectUI.connected){ 
  let spintext = document.getElementById("spintext");
  spintext.hidden = "true";
  let message = "SPIN?";
  function callbackTester(callback) {
    if(callback){
        spin.click();
    }
  }
}
