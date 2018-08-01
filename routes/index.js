var express = require('express');
var router = express.Router();
const {initManager} = require('./init-manager');

const {scoresBoardController} = require('./scores-board-controller');

let cache = {};

initManager.fetchInitData()
  .then((initData) => {
    initManager.fetchLocale()
      .then(locale => {

        scoresBoardController.initialGamesFetch().then(x => {
          cache = x
        });

      });

  });

/* GET home page. */
router.get('/', function (req, res, next) {
  res.json(cache);
});

router.get('/init', function (req, res, next) {
  const data = {
    "Languages":
      [{
      "Name": "English",
      "ID": 1,
      "Direction": "ltr",
      "CultureName": "en",
    }, {
      "Name": "Bahasa Indonesia",
      "ID": 34,
      "Direction": "ltr",
      "CultureName": "id-ID",
    }, {
      "Name": "Čeština",
      "ID": 40,
      "Direction": "ltr",
      "CultureName": "cs-CZ",
    }, {
      "Name": "Crnogorski",
      "ID": 77,
      "Direction": "ltr",
      "CultureName": "sr-Latn-ME",
    }, {
      "Name": "Deutsch",
      "ID": 16,
      "Direction": "ltr",
      "CultureName": "de-DE",
    }, {
      "Name": "English (UK)",
      "ID": 10,
      "Direction": "ltr",
      "CultureName": "en-GB",
    }, {
      "Name": "English (US)",
      "ID": 9,
      "Direction": "ltr",
      "CultureName": "en-US",
    }, {
      "Name": "Español (España)",
      "ID": 14,
      "Direction": "ltr",
      "CultureName": "es-ES",
    }, {
      "Name": "Español (Latinoamérica)‬",
      "ID": 29,
      "Direction": "ltr",
      "CultureName": "es-419",
    }, {
      "Name": "Français",
      "ID": 15,
      "Direction": "ltr",
      "CultureName": "fr-FR",
    }, {
      "Name": "Italiano",
      "ID": 12,
      "Direction": "ltr",
      "CultureName": "it-IT",
    }, {
      "Name": "Magyar",
      "ID": 38,
      "Direction": "ltr",
      "CultureName": "hu-HU",
    }, {
      "Name": "Nederlands",
      "ID": 37,
      "Direction": "ltr",
      "CultureName": "nl-NL",
      "FB_Code": "nl_NL",
      "AndroidLocale": "nl_NL"
    }, {
      "Name": "Polski",
      "ID": 35,
      "Direction": "ltr",
      "CultureName": "pl-PL",
    }, {
      "Name": "Português",
      "ID": 30,
      "Direction": "ltr",
      "CultureName": "pt-PT",
    }, {
      "Name": "Português (Brasil)",
      "ID": 31,
      "Direction": "ltr",
      "CultureName": "pt-BR",
    }, {
      "Name": "Pусский",
      "ID": 21,
      "Direction": "ltr",
      "CultureName": "ru-RU",
    }, {
      "Name": "Română",
      "ID": 36,
      "Direction": "ltr",
      "CultureName": "ro-RO",
    }, {
      "Name": "Slovenčina",
      "ID": 70,
      "Direction": "ltr",
      "CultureName": "sk-SK",
    }, {
      "Name": "Srpski",
      "ID": 75,
      "Direction": "ltr",
      "CultureName": "sr-Latn-RS",
    }, {
      "Name": "Türkçe",
      "ID": 33,
      "Direction": "ltr",
      "CultureName": "tr-TR",
    }, {
      "Name": "Ελληνικά",
      "ID": 39,
      "Direction": "ltr",
      "CultureName": "el-GR",
    }, {
      "Name": "Български",
      "ID": 41,
      "Direction": "ltr",
      "CultureName": "bg-BG",
    }, {
      "Name": "Українська",
      "ID": 78,
      "Direction": "ltr",
      "CultureName": "uk-UA",
    }, {
      "Name": "עברית",
      "ID": 2,
      "Direction": "rtl",
      "CultureName": "he-IL",
    }, {
      "Name": "العربية",
      "ID": 27,
      "Direction": "rtl",
      "CultureName": "ar",
    }, {
      "Name": "ไทย",
      "ID": 88,
      "Direction": "ltr",
      "CultureName": "th-TH",
    }, {
      "Name": "中文(简体)",
      "ID": 141,
      "Direction": "ltr",
      "CultureName": "zh-Hans",
    }, {
      "Name": "日本語",
      "ID": 57,
      "Direction": "ltr",
      "CultureName": "ja-JP",
    }],
    Terms:[],
    sportTypes: [],
  };
  const term = {
    "AliasName":"SELECTIONS_MENU_RECENT_SEARCHES",
    "Name":"Recent Searches"
  };

  const sportType = {
    "ID":1,
    "Name":"Football"
  };

  for(let i=0;i<100;i++){
    data.Terms.push(term);
  }
  for(let i=0;i<9;i++){
    data.sportTypes.push(sportType);
  }
  res.json(data);
});

module.exports = router;
