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
  const data = {
    test: 'heya'
  };
  res.json(data);
});

module.exports = router;
