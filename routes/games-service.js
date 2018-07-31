const {gameFactory} = require('./game-factory');
const {sportTypeFactory} = require('./sport-type-factory');
const {gameEventService} = require('./games-event-service');
const {SOCCER_EVENT_TYPES, SPORT_TYPES} = require('./consts');
const {gamesRepository} = require('./games-repository');
const {initManager} = require('./init-manager');

class GamesService {

  fetchGames(date, force, sportTypes) {
    return gamesRepository.fetchGames(date, force, sportTypes)
      .then(delta => gamesService.resolveGames(delta.Games))
  }

  resolveGames(gamesDelta) {
    if (!gamesDelta) {
      return;
    }

    const existingGames = gamesRepository.getGames() || [];
    const newGames = [];

    const allModifiedGames = gamesDelta.map(gd => {
      const existingGameModel = (existingGames).filter((g) => g.id === gd.ID)[0];

      if (existingGameModel) {
        this.updateGame(existingGameModel, gd);

        existingGames.push(existingGameModel);

        return existingGameModel;
      }

      const gameModel = this.initGameModel(gd);

      this.populateGameModel(gameModel);

      newGames.push(gameModel);

      return gameModel;
    });

    const gamesToStore = [...existingGames];
    gamesToStore.push(...newGames);
    gamesRepository.setGames(gamesToStore);

    return allModifiedGames;
  }

  initGameModel(gameCore) {

    const gameModel = gameFactory.createGameModel(gameCore);

    this.populateGameModel(gameModel);

    return gameModel;
  }

  getCompetitionInfo(competitionId) {
    const comps = gamesRepository.getCompetitions();
    const result = comps && comps.filter((comp) => comp.ID === Number(competitionId))[0];

    return result;
  };

  updateGame(gameModel, gameCore) {
    const existingGameCore = gameModel._gameCore;
    const newGameCore = gameCore;
    const mergedScores = this.mergeGameScores(existingGameCore, newGameCore);
    const mergedEvents = this.margeGameEvents(existingGameCore.Events, newGameCore.Events);

    Object.assign(existingGameCore, newGameCore);

    existingGameCore.Scrs = mergedScores;
    existingGameCore.Events = mergedEvents;

    this.populateGameModel(gameModel);
  }

  //update logic for scores array
  mergeGameScores(existingGameCore, newGameCore) {
    const existingScores = [];

    if (existingGameCore.Scrs && existingGameCore.Scrs.length) {
      existingScores.push(...existingGameCore.Scrs);
    }

    if (newGameCore.Scrs && existingScores.length === newGameCore.Scrs.length) {
      newGameCore.Scrs.forEach((score, index) => {
        if (score >= 0) {
          existingScores[index] = score;
        }
      });
    }

    return existingScores;
  }

  margeGameEvents(existingEvents, newEvents) {

    if (!newEvents) {
      return existingEvents;
    }

    if (!existingEvents) {
      existingEvents = [];
    }

    const allEvents = existingEvents;

    newEvents.forEach((newEvent) => {
      const isNewEventAlreadyExists = allEvents.map(x => x.Num + x.Type.toString()).includes(newEvent.Num + newEvent.Type.toString());

      if (isNewEventAlreadyExists) {
        const existingEvent = allEvents.filter(x => x.Num === newEvent.Num && x.Type === newEvent.Type)[0];

        return Object.assign(existingEvent, newEvent);
      }

      allEvents.push(newEvent);
    });

    const allEventsFiltered = allEvents.filter(e => !e.IsDel);

    return allEventsFiltered;
  }

  getRedCardCount(game, competitorIndex) {

    if (!game.sportType.ID === SPORT_TYPES.soccer) {
      return 0;
    }

    const count = game.events.filter(x => {
      let hasMatch = true;

      hasMatch &= (x.subType.type.ID - 1) === SOCCER_EVENT_TYPES.redCard;
      hasMatch &= x.competitorIndex === competitorIndex;

      return hasMatch;
    }).length;

    return count;
  };

  populateGameModel(gameModel) {
    const initData = initManager.getInitData();
    const competitions = gamesRepository.getCompetitions();

    gameFactory.populateGameModel(gameModel, gameModel._gameCore, initData, competitions);

    const events = gameModel._gameCore.Events;

    gameModel.sportType = sportTypeFactory.createSportType(initData, gameModel);
    gameModel.events = gameEventService.createGameEvents(events, gameModel);

    return gameModel;
  }
}

 const gamesService = new GamesService();
module.exports = { gamesService };
