const axios = require("axios");
const querystring = require("querystring");

const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const SENTENCES_REGEXP = /((?!=|\.).)+(.)/g;

const DEEPL_API_URL = "https://api.deepl.com/v2/translate";

require("dotenv").config();

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

const DEEPL_AUTH_KEY = process.env.DEEPL_AUTH_KEY;

function translate(text, target_lang) {
  return axios.post(
    DEEPL_API_URL,
    querystring.stringify({
      auth_key: DEEPL_AUTH_KEY,
      text,
      target_lang
    }),
    {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      }
    }
  );
}

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

function translateText({ textArray, from, to }) {
  return new Promise((resolve, reject) => {
    if (!textArray) reject("Bad Request params");
    const results = [];
    textArray
      .map(sentence => {
        return sentence.length > 0 ? sentence : "\r\n";
      })
      .forEach((sentence, i) => {
        if (!sentence) reject("Bad Request params");
        translate(sentence, to)
          .then(res => {
            results.push({
              i,
              source: sentence,
              target: res.data.translations[0].text,
              sourceLang: res.data.translations[0].detected_source_language
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

function calculateWordsCount(sentence) {
  return {
    wordsCount: sentence
      .trim()
      .split(" ")
      .filter(word => word.match(/[\w\d]+/g))
      .map(word => 1)
      .reduce((acc, item) => acc + item, 0)
  };
}

function splitTextIntoSentences(text) {
  return text.match(SENTENCES_REGEXP);
}
