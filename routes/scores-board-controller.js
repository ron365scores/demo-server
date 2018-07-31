const moment = require('moment');
const {gamesService} = require('./games-service');
const {INTERVAL_UPDATE_TIME, GAME_DATE_FORMAT, DEV_MODE} = require('./consts');
const {gameVMFactory} = require('./game-vm-factory');
const _ = require('lodash');

const state = {
  filterBy: {
    type: 'topEvents',
    date: moment().format(GAME_DATE_FORMAT)
  },
  filterData: {},
  isLoading: true,
  isLoadingFailed: false,
  isLoadingDelta: false,
  isLoadingDeltaFailed: false,
  isInitialFetchingCompleted: false,
  competitions: {},
  board: {},
  liveGamesCount: 0,
};

class ScoresBoardController {

  constructor() {
    this.state = state;
    this.intervalTimer = 0;
  }

  initialGamesFetch() {
    return this.fetchGames(true)
  }

  fetchGames(force = false) {
    this.state.isLoading = true;
    this.state.isLoadingFailed = false;

    return gamesService.fetchGames(this.state.filterBy.date, force, [1])
      .then((games => {

        this.clearBoard();
        this.state.board = (this.createBoard(games));
        return games;
      }))
      .then(() => {
        this.state.isLoading = false;

        scoresBoardController.startFetchingDelta(this.state.filterBy.date);

        this.state.isInitialFetchingCompleted = true;

        return this.state;
      })
      .catch((e) => {
        console.log('e', e);

        this.state.isLoadingFailed = true;
      });
  }

  startFetchingDelta(date, force = false) {

    let shouldFetch = !DEV_MODE || force;

    if (shouldFetch) {

      scoresBoardController.intervalTimer = setInterval(action(() => {
        scoresBoardController.fetchDelta(date);
      }), INTERVAL_UPDATE_TIME);
    }
  }

  stopFetchingDelta() {
    if (scoresBoardController.intervalTimer) {
      clearInterval(scoresBoardController.intervalTimer);
    }
  }

  populateBoard(games, date) {

    if (games && games.length) {

      for (const index in games) {
        const gameModel = games[index];
        const gameVM = gameVMFactory.createGameViewModel(gameModel);

        if (gameVM) {
          const competition = gameModel.competition;
          const hasExistingCompetition = !!this.state.board[date].sports[gameVM.sportType].competitions[gameVM.competitionId];

          if (!hasExistingCompetition) {
            extendObservable(this.state.board[date].sports[gameVM.sportType].competitions, {
              [gameVM.competitionId]: {
                competition: gameVMFactory.createCompetitionViewModel(competition),
                games: {
                  [gameVM.id]: gameVM
                }
              }
            })
          } else {
            const existingVM = this.state.board[date].sports[gameVM.sportType].competitions[gameVM.competitionId].games[gameVM.id];

            if (!existingVM) {
              this.state.board[date].sports[gameVM.sportType].competitions[gameVM.competitionId].games[gameVM.id] = gameVM;
            } else {
              Object.assign(existingVM, gameVM);
            }
          }
        }
      }
    }
  }

  clearBoard() {
    for (const index in this.state.board) {
      delete this.state.board[index];
    }
  }

  createBoard(games) {
    const board = {};
    let nextIndex = 0;
    let currentIndex = 0;

    for (const key in games) {
      const gameModel = games[key];
      const gameVM = gameVMFactory.createGameViewModel(games[key]);

      if (!board[gameVM.date]) {
        board[gameVM.date] = {};
      }

      if (!board[gameVM.date].sports) {
        board[gameVM.date].sports = {};
      }

      if (!board[gameVM.date].sports[gameVM.sportType]) {
        board[gameVM.date].sports[gameVM.sportType] = {
          sportType: gameModel.sportType
        };
      }

      if (!board[gameVM.date].sports[gameVM.sportType].competitions) {
        board[gameVM.date].sports[gameVM.sportType].competitions = {};
      }

      if (!board[gameVM.date].sports[gameVM.sportType].competitions[gameVM.competitionId]) {
        currentIndex = nextIndex++;
        board[gameVM.date].sports[gameVM.sportType].competitions[gameVM.competitionId] = {
          competition: gameVMFactory.createCompetitionViewModel(gameModel.competition),
          index: currentIndex,
          sortIndex: 0,
          isCollapsed: true
        };
      }

      if (!board[gameVM.date].sports[gameVM.sportType].competitions[gameVM.competitionId].games) {
        board[gameVM.date].sports[gameVM.sportType].competitions[gameVM.competitionId].games = {};
      }

      board[gameVM.date].sports[gameVM.sportType].competitions[gameVM.competitionId].games[gameVM.id] = gameVM;
    }

    return (board);
  };

}

 const scoresBoardController = new ScoresBoardController();
module.exports = { scoresBoardController };
