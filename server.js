const express = require("express");
const multer = require("multer");
const Jimp = require("jimp");
var path = require("path");
const { FontManager } = require("./font-manager");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.static("public"));

var storage = multer.memoryStorage();

var upload = multer({
  //multer settings
  storage: storage,
  fileFilter: function (req, file, callback) {
    var ext = path.extname(file.originalname);
    if (
      ext !== ".png" &&
      ext !== ".jpg" &&
      ext !== ".png" &&
      ext !== ".jpeg" &&
      ext !== ".JPG"
    ) {
      return callback(new Error("Only images are allowed"));
    }
    callback(null, true);
  },
  limits: {
    fileSize: 2024 * 1024,
  },
}).single("photo");

var data = null;
var x = null;
var y = 0;

app.post("/upload", function (req, res) {
  upload(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      console.log("error", err);
      res.json(err);
    } else if (err) {
      console.log(err);
      res.json("err");
    } else {
      data = req.file.buffer.toString("base64");
      res.json(data);
    }

    // Everything went fine.
  });
});

/* app.post("/upload", upload, (req, res) => {
  if (req.file) {
    data = req.file.buffer.toString("base64");
    res.json(data);
  } else throw "error";
}); */

app.get("/edited/:filename", async (req, res) => {
  const base64 = Buffer.from(data, "base64");
  const ORIGINAL_IMAGE = base64;

  let originalFrame = new Jimp(600, 745, "white", (err, image) => {
    if (err) throw err;
  });

  let kotoba = [
    "Halo",
    "Halo, Nama saya Nanda!",
    "Apa yang akan kita lakukan?",
    "Maaf!",
    "Saya mengalami kecelakaan!",
    "Saya berkibar!",
    "Apa golongan darah anda Aku tipe O!",
    "Apakah anda memiliki alergi?",
    "1 + 5 = 🍓",
    "Dimana yang sakit?",
    "Selamat datang!",
    "Mohon tunggu sebentar, siapa kamu?",
    "ke mana kamu mau pergi?",
    "Saya ingin berbicara dengan xxx.",
    "Apa tujuan perjalanan ini?",
    "ini dia!",
    "Bisakah saya minta kopi?",
    "Apa yang harus saya tulis di sini?",
    "Bisakah anda membantu saya dengan sesuatu?",
    "tolong jangan khawatir!",
    "Jangan tunggu aku!",
    "Bahkan jika hujan, saya harus pergi!",
    "Silakan datang kapan saja!",
    "Ayo jalan-jalan saat cuaca cerah!",
    "Kapan kamu datang",
    "Saya tidak bisa berbicara bahasa Jepang!",
    "Berapa usia anda sekarang",
    "『生活』 Bisakah kamu membaca kanji ini?",
    "oh, xxx. Apa kabar?",
    "Mengapa?",
    "Mengapa anda tidak datang ke tempat itu?",
    "Apa nama tempat itu?",
    "anda memiliki buku dan pensil di tas anda, bukan?",
    "Apa ada xx di bawah meja?",
    "Apa ada xx di atas meja?",
    "Bagaimana kabarmu, xx?",
    "Ini adalah situs web untuk xxx!",
    "xxx cantik, bukan?",
    "Saya orang Indonesia!",
    "Terima kasih atas kerja keras anda!",
    "Selamat datang!",
    "Silahkan datang lagi!",
    "Apa yang kamu lakukan belakangan ini",
    "Pernah ke taman?",
    "Disini panas!",
    "Apa kamu punya makanan favorit?",
    "Apakah anda memiliki makanan yang tidak anda sukai?",
    "Apa yang diinginkan xxx?",
    "anda tidak bisa bolos sekolah!",
    "Dapatkah saya duduk di sini?",
    "Tolong bacalah buku!",
    "Apa keluhan anda?",
    "Saya tidak berpikir begitu?",
  ];

  let time = new Date();

  var month = new Array(11);
  month[0] = "January";
  month[1] = "February";
  month[2] = "March";
  month[3] = "April";
  month[4] = "May";
  month[5] = "June";
  month[6] = "July";
  month[7] = "August";
  month[8] = "September";
  month[9] = "October";
  month[10] = "November";
  month[11] = "December";
  var moon = month[time.getMonth()];

  var weekday = new Array(7);
  weekday[0] = "Sunday";
  weekday[1] = "Monday";
  weekday[2] = "Tuesday";
  weekday[3] = "Wednesday";
  weekday[4] = "Thursday";
  weekday[5] = "Friday";
  weekday[6] = "Saturday";
  var day = weekday[time.getDay()];

  let detail = `${day} ${time.getDate()} ${moon} ${time.getFullYear()}`;

  const [
    image,
    logo,
    Consolas16Black,
    SanafonMugi18Black,
    JakobsHandwriting24Black,
    JakobsHandwriting36Black,
  ] = await Promise.all([
    Jimp.read(ORIGINAL_IMAGE),
    Jimp.read(originalFrame),
    Jimp.loadFont(FontManager.Consolas16Black),
    Jimp.loadFont(FontManager.SanafonMugi18Black),
    Jimp.loadFont(FontManager.JakobsHandwriting24Black),
    Jimp.loadFont(FontManager.JakobsHandwriting36Black),
  ]);

  if (y == 0) {
    x = Math.floor(Math.random() * (kotoba.length - 0));
    y = 1;
    setTimeout(() => {
      y = 0;
    }, 20000);
  }

  logo.print(
    JakobsHandwriting36Black,
    40,
    655,
    {
      text: kotoba[x],
      alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER,
      alignmentY: Jimp.VERTICAL_ALIGN_MIDDLE,
    },
    514
  );

  logo.print(JakobsHandwriting24Black, 20, 11, detail);
  logo.print(JakobsHandwriting24Black, 20, 11, detail);
  logo.print(SanafonMugi18Black, 506, 9, "その笑顔");
  logo.print(Consolas16Black, 375, 30, "sono-egao.herokuapp.com");
  image.resize(750, Jimp.AUTO);
  image.crop(0, 0, 556, 556);
  logo
    .composite(image, 22, 58, [
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
