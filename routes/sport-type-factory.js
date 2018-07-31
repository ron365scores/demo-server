class SportTypeFactory {
  constructor() {
    this.timer = 0;
  }

  createSportType(initData, gameModel) {

    const gameCore = gameModel._gameCore;
    const sportTypeCore = initData.SportTypes.filter(s => s.ID === gameCore.SID)[0];

    let st = Date.now();

    const sportTypeModel = ({
      id: sportTypeCore.ID,
      name: sportTypeCore.Name,
      shortName: sportTypeCore.ShortName,
      statuses: sportTypeCore.Statuses,
      stages: sportTypeCore.Stages.filter(t => Object.assign({}, t)),
      eventTypes: sportTypeCore.EventTypes.filter(t => Object.assign({}, t)),
    });

    sportTypeFactory.timer += Date.now() - st;

    if (gameCore.STID) {
      gameModel.status = Object.assign({}, sportTypeModel.statuses.filter(
        s => s.ID === gameCore.STID)[0]);

      gameModel.status.shortestName = gameModel.status.ShortName || gameModel.status.Name;

      gameModel.sportType.toString = () => gameCore.STID;
    }


    if (gameModel._gameCore.Scrs && gameModel._gameCore.Scrs.length) {
      gameModel.scores.push({}, {});
      sportTypeCore.Stages.forEach((stage, stageIndex) => {
        gameModel.scores[0][stage.AliasName] = gameModel._gameCore.Scrs[stageIndex * 2];
        gameModel.scores[1][stage.AliasName] = gameModel._gameCore.Scrs[stageIndex * 2 + 1];

      });
    }
    return sportTypeModel;
  }
}

 const sportTypeFactory = new SportTypeFactory();
module.exports = { sportTypeFactory };
