const Path = require("path");
const Jimp = require("jimp");

let singleton = null;
class FontManager {
  static instance() {
    if (singleton) return singleton;
    singleton = new FontManager();
    return singleton;
  }

  constructor() {
    this.fonts = Object.create(null);
  }

  load(fileName) {
    const { fonts } = this;
    const absFileName = Path.resolve(fileName);

    if (absFileName in fonts) {
      return Promise.resolve(fonts[absFileName]);
    }

    return Jimp.loadFont(absFileName).then(function (font) {
      fonts[absFileName] = font;
      return font;
    });
  }
}
FontManager.Consolas16Black = "./fonts/Consolas16Black/Consolas16Black.fnt";
FontManager.JakobsHandwriting24Black =
  "./fonts/JakobsHandwriting24Black/JakobsHandwriting24Black.fnt";
FontManager.JakobsHandwriting36Black =
  "./fonts/JakobsHandwriting36Black/JakobsHandwriting36Black.fnt";
FontManager.SanafonMugi18Black =
  "./fonts/SanafonMugi18Black/SanafonMugi18Black.fnt";

exports.FontManager = FontManager;
