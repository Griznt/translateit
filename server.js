const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const SENTENCES_REGEXP = /((?!=|\.).)+(.)/g;

require("dotenv").config();

const translate = require("yandex-translate")(process.env.YANDEX_API_KEY);

const port = process.env.PORT || 3000;
const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(`${__dirname}/build`));

app.get("/", (request, response) => {
  response.status(200).sendFile(`${__dirname}/build/index.html`);
});

app.post("/api/v1/translate", (request, response) => {
  try {
    const { text, from, to } = request.body;
    translateText({
      textArray: splitTextIntoSentences(text),
      from,
      to
    })
      .then(results => {
        response.status(200).send(results);
      })
      .catch(error => catchError({ error, response }));
  } catch (error) {
    catchError({ error, response });
  }
});

function catchError({ error, response }) {
  console.error("catchError", { error });
  response
    .status(error.code >= 100 && error.code < 600 ? error.code : 500)
    .send(error.message ? error.message : "error occured.");
}
app.listen(port, err => {
  if (err) {
    return console.error("something doing wrong", err);
  }
  console.log(`server is listening on ${port}`);
});

function translateIt(text, { from, to }) {
  return new Promise((resolve, reject) => {
    translate.translate(text, { from, to }, (err, res) => {
      if (err) reject(err);
      else if (res.code === 200) resolve(res.text);
      else reject(res);
    });
  });
}

function translateText({ textArray, from, to }) {
  return new Promise((resolve, reject) => {
    if (!textArray) reject("Bad Request params");
    const results = [];
    textArray
      .map(element => {
        return element.length > 0 ? element : "\r\n";
      })
      .forEach((element, i) => {
        if (!element) reject("Bad Request params");
        translateIt(element, {
          from: from || "auto",
          to: to || "en"
        })
          .then(res => {
            results.push({
              i,
              source: element,
              target: res[0]
            });
            if (results.length === textArray.length) resolve(results);
          })
          .catch(err => {
            console.error({ err });
            reject("Bad Request");
          });
      });
  });
}

function splitTextIntoSentences(text) {
  return text.match(SENTENCES_REGEXP);
}
