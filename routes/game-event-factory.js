class GameEventFactory {
  createGameEvent(gameEventCore, gameModel) {
    const gameEventModel = ({
      _eventCore: gameEventCore,

      // represents Num on event core, plus the type of the event
      id: '',

      subType: null,
      competitorIndex: -1,
      gameTime: -1,
      formattedGameTime: '',
      addedTime: -1,
      gameCompletion: -1,
      playerName: '',
      status: -1,
      isDel: false,
      eventOrder: -1
    });

    gameEventModel.id = gameEventCore.Num.toString() + gameEventCore.toString();
    const eventType = gameModel.sportType.eventTypes[gameEventCore.Type];

    if (!eventType) {

      return null; // todo: remove

      // throw new Error(`No event type for id: ${gameEventCore.Type}`)
    }

    gameEventModel.subType = Object.assign({} ,eventType.SubTypes.filter(st => st.ID === gameEventCore.SType)[0] || {});
    gameEventModel.subType.type = eventType;
    gameEventModel.status = gameEventCore.Status;
    gameEventModel.formattedGameTime = gameEventCore.GTD;
    gameEventModel.gameTime = gameEventCore.GT;
    gameEventModel.addedTime = gameEventCore.AddedTime;
    gameEventModel.eventOrder = gameEventCore.EventOrder;
    gameEventModel.competitorIndex = gameEventCore.Comp;
    gameEventModel.gameCompletion = gameEventCore.GameCompletion;
    gameEventModel.playerName = gameEventCore.Player;
    gameEventModel.isDel = gameEventCore.IsDel;

    return gameEventModel;
  }
}

const gameEventFactory = new GameEventFactory();

module.exports = { gameEventFactory };

