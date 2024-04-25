const express = require("express");
const mongoose = require("mongoose");
const ShortUrl = require("./models/shortUrl");
const app = express();

mongoose.connect("mongodb://localhost:27017/urlSite");

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: false }));

app.get("/", async (req, res) => {
  const shortUrls = await ShortUrl.find();
  res.render("index", { shortUrls: shortUrls });
});

app.post("/shortUrl", async (req, res) => {
  await ShortUrl.create({ full: req.body.fullUrl });
  res.redirect("/");
});

app.get("/:shortUrl", async (req, res) => {
  const shorturl = await ShortUrl.findOne({ short: req.params.shortUrl });
  if (shorturl == null) return res.sendStatus(404);

  shorturl.clicks++;
  shorturl.save();

  res.redirect(shorturl.full);
});

app.listen(process.env.PORT || 5000);
