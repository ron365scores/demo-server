const moment = require('moment');

const {gamesService} = require('./games-service');
const {initManager} = require('./init-manager');
const {GAME_DATE_TIME_FORMAT} = require('./consts');

class GameVMFactory {
  constructor() {
    this.timer = 0;
  }

  calcTimerText(game) {
    const {status} = game;

    if (status.HasGameTime) {
      return status.GameTimeForStatus ? `${status.shortestName} + ${game.formattedGameTime}` : `${game.formattedGameTime}`;
    }

    else {
      return `${status.shortestName}`
    }
  }

  calcBottomStatuses(game) {

    if (game.winDescription) {
      return [game.winDescription];
    }

    if (game.aggregatedScore) {
      return [`Agg `, `${game.aggregatedScore[0]} - ${game.aggregatedScore[1]}`];
    }

    if (game.statusDescription) {
      return [game.statusDescription];
    }

    return [];
  }

  calcGameTopStatusText(gameStatus) {
    return gameStatus.isFinished ? gameStatus.Name : '';
  }

  createGameViewModel(game) {

    if (!game.competitors || !game.competitors.length || !game.status) {
      return null;
    }

    const initData = initManager.getInitData();

    const homeTeamCurrentResult = game.scores.length && game.scores[0].CurrResult;
    const homeTeamHasResult = homeTeamCurrentResult && homeTeamCurrentResult === -1;
    const awayTeamCurrentResult = game.scores.length && game.scores[1].CurrResult;
    const awayTeamHasResult = awayTeamCurrentResult && homeTeamCurrentResult === -1;

    const homeTeamScore = homeTeamHasResult ? '' : homeTeamCurrentResult;
    const awayTeamScore = awayTeamHasResult ? '' : awayTeamCurrentResult;
    const hasStarted = !game.status.isNotStarted;

    const gameVM = {
      date: game.date,
      id: game.id,
      competitionId: game.competitionId,
      countryId: game.competition.CID,
      hasStarted,
      score: hasStarted ? `${homeTeamScore} - ${awayTeamScore}` : null,
      sportType: game.sportType.id,
      statusText: this.calcGameTopStatusText(game.status),
      timerText: this.calcTimerText(game),
      isLive: game.status.isActive,
      startTime: game.gameStartDateTime && moment(game.gameStartDateTime, GAME_DATE_TIME_FORMAT).format(initData.DateFormats.ShortTimePattern),
      subStatusText: this.calcBottomStatuses(game),

      homeTeamName: game.competitors[0].Name,
      homeTeamShortName: game.competitors[0].SName,
      homeTeamId: game.competitors[0].ID,
      homeTeamRedCards: gamesService.getRedCardCount(game, 1),
      homeTeamPendingQualification: !game.winDescription && game.aggregatedScore && game.qualifiedCompetitor === 1,
      homeTeamQualified: game.status.isFinished && game.qualifiedCompetitor === 1,

      awayTeamName: game.competitors[1].Name,
      awayTeamShortName: game.competitors[1].SName,
      awayTeamId: game.competitors[1].ID,
      awayTeamRedCards: gamesService.getRedCardCount(game, 2),
      awayTeamPendingQualification: !game.winDescription && game.aggregatedScore && game.qualifiedCompetitor === 2,
      awayTeamQualified: game.status.isFinished && game.qualifiedCompetitor === 2,

      winnerIndex: game.winnerIndex,
      starred: false
    };

    return gameVM;
  }

  createCompetitionViewModel(competition) {
    const competitionVM = {
      id: competition.ID,
      countryId: competition.CID,
      name: competition.Name,
      starred: false,
      hasTable: competition.HasTbl,
      sportId: competition.SID
    };

    return competitionVM;
  }
}

const gameVMFactory = new GameVMFactory();
module.exports = {gameVMFactory};
