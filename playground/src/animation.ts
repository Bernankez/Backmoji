import Stats from "stats.js";

export type Fn = () => void;

export class Animate {
  #showStat: boolean = false;
  #stats: Stats;
  #cb: Fn | undefined = undefined;
  #raf: number | undefined = undefined;
  public timestamp = 0;

  constructor(showStat?: boolean) {
    this.#stats = new Stats();
    this.#stats.showPanel(0);
    this.setStat(showStat ?? false);
  }

  setStat(showStat: boolean) {
    if (this.#showStat === showStat) {
      return;
    }

    if (showStat) {
      this.#stats.dom.style.left = "unset";
      this.#stats.dom.style.right = "0";
      document.body.appendChild(this.#stats.dom);
    } else {
      document.body.removeChild(this.#stats.dom);
    }
    this.#showStat = showStat;
  }

  setCallback(cb: Fn) {
    this.#cb = cb;
  }

  play() {
    if (!this.#cb) {
      return;
    }

    this.timestamp += 0.5;
    this.#stats.begin();
    this.#cb?.();
    this.#stats.end();
    this.#raf = requestAnimationFrame(this.play.bind(this));
  }

  pause() {
    if (this.#raf) {
      cancelAnimationFrame(this.#raf);
      this.#raf = undefined;
    }
  }

  reset() {
    this.timestamp = 0;
    this.pause();
    this.#cb?.();
  }
}
