const BG_IMAGES = [
  "res/assets/bg/beach.png",
  "res/assets/bg/cellar.png",
  "res/assets/bg/coop.png",
  "res/assets/bg/date.png",
  "res/assets/bg/greek.png",
  "res/assets/bg/kyliefree.png",
  "res/assets/bg/offlicense.png",
  "res/assets/bg/picnic.png",
  "res/assets/bg/stomping.png",
  "res/assets/bg/supermarket.png",
  "res/assets/bg/traitors.png",
];

const CYCLE_INTERVAL_MS = 3000;
const FADE_MS = 2000;

function shuffle(array) {
  const result = array.slice();
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

class BackgroundCycler {
  constructor(images) {
    this.order = shuffle(images);
    this.index = 0;

    this.layerA = document.getElementById("bgLayerA");
    this.layerB = document.getElementById("bgLayerB");
    this.activeLayer = this.layerA;
    this.inactiveLayer = this.layerB;

    // First image should just appear, not fade in from the empty/white
    // canvas behind it - only turn on the transition once it's showing.
    this.activeLayer.style.backgroundImage = `url("${this.order[0]}")`;
    this.activeLayer.classList.add("bg-layer-visible");
    requestAnimationFrame(() => {
      [this.layerA, this.layerB].forEach((layer) => {
        layer.style.transitionDuration = `${FADE_MS}ms`;
      });
    });
  }

  start() {
    setInterval(() => this.advance(), CYCLE_INTERVAL_MS);
  }

  advance() {
    this.index = (this.index + 1) % this.order.length;
    if (this.index === 0) this.order = shuffle(this.order);

    const nextSrc = this.order[this.index];
    this.inactiveLayer.style.backgroundImage = `url("${nextSrc}")`;

    // Force a reflow so the browser registers the new background-image
    // before we animate opacity, otherwise the fade can get skipped.
    void this.inactiveLayer.offsetWidth;

    this.inactiveLayer.classList.add("bg-layer-visible");
    this.activeLayer.classList.remove("bg-layer-visible");

    [this.activeLayer, this.inactiveLayer] = [this.inactiveLayer, this.activeLayer];
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const cycler = new BackgroundCycler(BG_IMAGES);
  cycler.start();
});
