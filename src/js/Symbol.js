

const cache = {};

export default class Symbol {
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