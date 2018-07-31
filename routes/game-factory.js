const moment =require('moment');

const {GAME_DATE_TIME_FORMAT, GAME_DATE_FORMAT} = require('./consts');

class GameFactory {
  constructor() {
    this.factoryTimer = 0;
  }

  createGameModel(gameCore) {

    let st = Date.now();

    const gameModel = ({
      _gameCore: gameCore,

      // primitive
      id: '',
      gameTime: 0,
      formattedGameTime: '',
      gameStartDateTime: null,
      isActive: false,
      winnerIndex: -1,
      date: 0,
      qualifiedCompetitor: null,
      statusDescription: '',
      winDescription: '',

      // refs
      winner: {},
      status: {},
      sportType: {},
      competition: {},
      competitors: {},
      scores: [],
      events: [],
    });

    gameFactory.factoryTimer += Date.now() - st;

    return gameModel;
  }

  populateGameModel(gameModel, gameCore, initData, competitions) {
    gameModel.id = gameModel._gameCore.ID;
    gameModel.gameTime = gameModel._gameCore.GT >= 0 ? gameModel._gameCore.GT : gameModel.gameTime;
    gameModel.formattedGameTime = gameModel._gameCore.GTD ? gameModel._gameCore.GTD : gameModel.formattedGameTime;
    gameModel.gameStartDateTime = gameModel._gameCore.STime;
    gameModel.winnerIndex = gameModel._gameCore.Winner >= 0 ? gameModel._gameCore.Winner : gameModel.winnerIndex;
    gameModel.statusDescription = gameModel._gameCore.StatusDescription;
    gameModel.winDescription = gameModel._gameCore.WinDescription;
    gameModel.competitors = gameModel._gameCore.Comps && gameModel._gameCore.Comps.length ? gameModel._gameCore.Comps : gameModel.competitors;
    gameModel.winner = gameModel.competitors && gameModel.competitors.length && gameModel.winnerIndex >= 0 && [gameModel.winnerIndex - 1];
    gameModel.date = gameModel.gameStartDateTime ? moment(gameModel.gameStartDateTime, GAME_DATE_TIME_FORMAT).format(GAME_DATE_FORMAT) : null;
    gameModel.competition = competitions.filter((c) => c.ID === gameModel._gameCore.Comp)[0];
    gameModel.competitionId = gameModel.competition && gameModel.competition.ID;

    if (gameModel._gameCore.AggregatedScore) {
      gameModel.aggregatedScore = gameModel._gameCore.AggregatedScore;
    }

    if (gameModel._gameCore.ToQualify) {
      gameModel.qualifiedCompetitor = gameModel._gameCore.ToQualify;
    }

    gameModel.isActive = gameModel._gameCore.Active;

    return gameModel;
  }
}

 const gameFactory = new GameFactory();
module.exports = { gameFactory };
