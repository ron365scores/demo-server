const {gameEventFactory} =require('./game-event-factory');

class GameEventService {
  createGameEvents(events, gameModel) {
    const gameEventModels = (events || [])
      .map((e) => gameEventFactory.createGameEvent(e, gameModel))
      .filter(e => !!e);

    return gameEventModels;
  }

  getEventsByType(gameModel, typeId) {
    return gameModel.events.filter(x => x.subType.type.ID === typeId);
  }
}

 const gameEventService = new GameEventService();

module.exports = { gameEventService };

