const express = require("express");
const multer = require("multer");
const Jimp = require("jimp");

const app = express();
const PORT = 3000;

app.use(express.static("public"));

var storage = multer.memoryStorage();

var upload = multer({ storage: storage });

var data = null;

app.post("/upload", upload.single("photo"), (req, res) => {
  if (req.file) {
    data = req.file.buffer.toString("base64");
    res.json(data);
  } else throw "error";
});

app.get("/edited/:filename", async (req, res) => {
  const base64 = Buffer.from(data, "base64");
  const ORIGINAL_IMAGE = base64;

  const LOGO = "./bg.png";

  const LOGO_MARGIN_PERCENTAGE = 5;

  const [image, logo] = await Promise.all([
    Jimp.read(ORIGINAL_IMAGE),
    Jimp.read(LOGO),
  ]);

  logo.resize(image.bitmap.width / 10, Jimp.AUTO);

  const xMargin = (image.bitmap.width * LOGO_MARGIN_PERCENTAGE) / 100;
  const yMargin = (image.bitmap.width * LOGO_MARGIN_PERCENTAGE) / 100;

  const X = image.bitmap.width - logo.bitmap.width - xMargin;
  const Y = image.bitmap.height - logo.bitmap.height - yMargin;

  image
    .composite(logo, X, Y, [
      {
        mode: Jimp.BLEND_SCREEN,
        opacitySource: 0.1,
        opacityDest: 1,
      },
    ])
    .getBuffer(Jimp.MIME_JPEG, (err, buffer) => {
      res.set("Content-Type", Jimp.MIME_JPEG);
      res.send(buffer);
    });
});

app.listen(PORT, () => {
  console.log("Listening at " + PORT);
});
