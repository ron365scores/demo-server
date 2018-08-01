var express = require('express');
var router = express.Router();
const { initManager } = require('./init-manager');

const { scoresBoardController } = require('./scores-board-controller');

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
router.get('/', function(req, res, next) {
  res.json(cache);
});

/* GET home page. */
router.get('/games', function(req, res, next) {
  let split = req.query.split;
  console.log('split',split);

  const game = {
    "id": 1,
    "date": "16/07/2018",
    "status": "started",
    "statusText": "ET 109'",
    "time": "21:00",
    "timePostfix": "AM",
    "isFutureGame": false,
    "lineupsStatus": 1,
    "hasTVNetworks": false,
    "hasMissingPlayers": false,
    "hasBetsTeaser": false,
    "description": "Barcelona has won 5-3 after Penalties",
    "aggregatedText": "aggregated",
    "homeCompetitor": {
      "id": 1,
      "name": "Argentina",
      "score": 2,
      "aggregatedScore": 4,
      "isQualified": false,
      "isWinner": false,
      "redCards": 0,
      "country": {
        "id": 11,
        "name": "Argentina"
      }
    },
    "awayCompetitor": {
      "id": 2,
      "name": "Brazil",
      "score": 0,
      "aggregatedScore": 2,
      "isQualified": false,
      "isWinner": false,
      "redCards": 1,
      "country": {
        "id": 12,
        "name": "Brazil"
      }
    },
    "sport": {
      "id": 1,
      "name": "Football"
    },
    "competition": {
      "id": 1,
      "name": "World Cup",
      "hasTable": true,
      "country": {
        "id": 1,
        "name": "Argentina"
      }
    },
    "round": {
      "id": 1,
      "name": "Round One"
    }
  };
  const splitGame = {
    "id": 1,
    "date": "16/07/2018",
    "status": "started",
    "statusText": "ET 109'",
    "time": "21:00",
    "timePostfix": "AM",
    "isFutureGame": false,
    "lineupsStatus": 1,
    "hasTVNetworks": false,
    "hasMissingPlayers": false,
    "hasBetsTeaser": false,
    "description": "Barcelona has won 5-3 after Penalties",
    "aggregatedText": "aggregated",
    "homeCompetitor": {
      "id": 1,
      "name": "Argentina",
      "score": 2,
      "aggregatedScore": 4,
      "isQualified": false,
      "isWinner": false,
      "redCards": 0,
      "countryId": 11

    },
    "awayCompetitor": {
      "id": 2,
      "name": "Brazil",
      "score": 0,
      "aggregatedScore": 2,
      "isQualified": false,
      "isWinner": false,
      "redCards": 1,
      "countryId": 12
    },
    "round": {
      "id": 1,
      "name": "Round One"
    },
    sportId: 1,
    competitionId: 1,
  };

  const initialObjectData = {
    sports: [],
    competitions: [],
    countries: [],
    games: []
  };

  const country = {
    id: 12,
    name: "Brazil"
  };
  const competition = {
    id: 1,
    name: "World Cup",
    hasTable: true,
    countryId: 1,
  };

  const data = !!split ? initialObjectData : {games: []};
  for(let i=0; i<612; i++){
    data.games.push(!!split ? splitGame : game);
  }
  if(!!split) {
    for (let i = 0; i < 65; i++) {
      data.countries.push(country);
    }
    for (let i = 0; i < 12; i++) {
      data.competitions.push(competition);
    }
  }


  res.json(data);
});

module.exports = router;
